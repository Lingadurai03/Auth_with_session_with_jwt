import { pgPool } from "../config/db_config.js";
import { compare, hash } from "bcrypt";
import { randomUUID, randomBytes, createHash } from "crypto";
import jwt from "jsonwebtoken";
import { privateKey } from "../utils/getKeys.js";

export const register = async (userData) => {
  const { email, password, fullName } = userData;
  const isAccountExist = await checkUserExist(email);
  if (isAccountExist) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  try {
    const query =
      "INSERT INTO  users(email, full_name,password_hash ) VALUES ($1, $2, $3) RETURNING id, full_name, email, created_at, updated_at, disabled_at";
    const newUser = await pgPool.query(query, [
      email,
      fullName,
      hashedPassword,
    ]);

    return newUser.rows[0];
  } catch (e) {
    if (e.code === "23505" && e.constraint === "users_email_key") {
      const error = new Error("Email already registered");
      error.statusCode = 409;
      throw error;
    }
    throw e;
  }
};

export const login = async (userData) => {
  const { email, password } = userData;
  const user = await getUserWithPasswordHash(email.toLowerCase().trim());
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }
  if (user.disabled_at) {
    const error = new Error(
      "Your account has been deactivated. Please contact support for assistance.",
    );
    error.statusCode = 403;
    throw error;
  }
  const { password_hash, ...safeUser } = user;
  const isPasswordMatch = await compare(password, password_hash);
  if (!isPasswordMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const createdAt = new Date();
  const accessTokenPayload = {
    sub: safeUser.id,
    role: safeUser.role,
    jti: randomUUID(),
  };

  const accessToken = generateAccessToken(accessTokenPayload);
  const refreshToken = generateRefreshToken();
  const hashedRefreshToken = hashRefreshToken(refreshToken);

  await addRefreshTokenOnDB(safeUser.id, hashedRefreshToken, createdAt);
  return { ...safeUser, accessToken, refreshToken };
};

export const refreshToken = async (refreshToken) => {
  const client = await pgPool.connect();
  let isTransactionStarted = false;
  try {
    await client.query("BEGIN");
    isTransactionStarted = true;
    const query = `
        SELECT 
        r.id AS "refreshSessionId",
        u.id AS "userId",
        u.email,
        u.role,
        u.full_name AS "fullName"
        FROM refresh_token_sessions r 
        INNER JOIN 
        users u on u.id = r.user_id
        WHERE 
        r.token_hash = $1 
        AND r.expires_at > NOW()
        AND r.revoked_at IS NULL
        AND u.disabled_at IS NULL
        FOR UPDATE OF r
  `;

    const oldHashedRefreshtoken = hashRefreshToken(refreshToken);
    const { rows } = await client.query(query, [oldHashedRefreshtoken]);
    const result = rows[0];

    if (!result) {
      const historicalToken = await findHistoricalTokenSession(
        client,
        oldHashedRefreshtoken,
      );

      // Finish the original transaction first.
      await client.query("ROLLBACK");
      isTransactionStarted = false;

      if (historicalToken) {
        await revokeSession(historicalToken.sessionId);

        const error = new Error(
          "Refresh token reuse detected. Session revoked.",
        );
        error.statusCode = 401;
        throw error;
      }

      const error = new Error("Session not found");
      error.statusCode = 401;
      throw error;
    }
    const accessTokenPayload = {
      sub: result.userId,
      role: result.role,
      jti: randomUUID(),
    };
    await storeOldHashOnHistory(
      client,
      result.refreshSessionId,
      oldHashedRefreshtoken,
    );
    const newAccessToken = generateAccessToken(accessTokenPayload);
    const newRefreshToken = generateRefreshToken();
    const hashedRefreshToken = hashRefreshToken(newRefreshToken);

    await updateRefreshToken(
      hashedRefreshToken,
      result.refreshSessionId,
      client,
    );
    await client.query("COMMIT");
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    if (isTransactionStarted) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }

    throw error;
  } finally {
    client.release();
  }
};

const checkUserExist = async (email) => {
  const query = "SELECT  COUNT(*) FROM users WHERE email = ($1)";
  const user = await pgPool.query(query, [email]);
  return Boolean(+user.rows[0].count);
};

const getUserWithPasswordHash = async (email) => {
  const query =
    "SELECT id, full_name, email, role, password_hash, disabled_at FROM users WHERE email = $1";
  const user = await pgPool.query(query, [email]);
  return user.rows[0];
};

const addRefreshTokenOnDB = async (userId, token, createdAt) => {
  const query =
    "INSERT INTO refresh_token_sessions(user_id, token_hash, expires_at) values($1, $2, $3)";

  const expireAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  return pgPool.query(query, [userId, token, expireAt]);
};

const updateRefreshToken = async (tokenHash, refreshSessionId, client) => {
  const query = `
    UPDATE 
    refresh_token_sessions
    set
    token_hash = $1, 
    expires_at= NOW() + INTERVAL '7 days', 
    last_used_at= NOW()
    WHERE
    id = $2 
    AND revoked_at IS NULL
    AND expires_at > NOW()
    RETURNING id, user_id AS "userId", expires_at AS "expiresAt";
  `;
  const result = await client.query(query, [tokenHash, refreshSessionId]);
  if (result.rowCount === 0) {
    const error = new Error("Session is invalid, expired or revoked");
    error.statusCode = 401;
    throw error;
  }
  return result.rows[0];
};

const findHistoricalTokenSession = async (client, tokenHash) => {
  const query = `
    SELECT
      h.session_id AS "sessionId"
    FROM refresh_token_history h
    INNER JOIN refresh_token_sessions s
      ON s.id = h.session_id
    WHERE h.token_hash = $1
    FOR UPDATE OF s
  `;

  const { rows } = await client.query(query, [tokenHash]);

  return rows[0] || null;
};

const revokeSession = async (sessionId) => {
  const client = await pgPool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `
        SELECT id, revoked_at, expires_at
        FROM refresh_token_sessions
        WHERE id = $1
        FOR UPDATE
      `,
      [sessionId],
    );

    const session = rows[0];

    if (!session || session.revoked_at || session.expires_at <= new Date()) {
      await client.query("COMMIT");
      return false;
    }

    await client.query(
      `
        UPDATE refresh_token_sessions
        SET revoked_at = NOW()
        WHERE id = $1
      `,
      [sessionId],
    );

    await client.query("COMMIT");
    return true;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Revocation rollback failed:", rollbackError);
    }

    throw error;
  } finally {
    client.release();
  }
};

const storeOldHashOnHistory = async (client, sessionId, token) => {
  const query = `
    INSERT INTO refresh_token_history(token_hash,session_id, revoked_at)
    VALUES($1, $2, NOW())
   `;
  return client.query(query, [token, sessionId]);
};

const generateAccessToken = (payload) => {
  return jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "15m",
    issuer: "auth_server",
  });
};
const generateRefreshToken = () => {
  return randomBytes(32).toString("hex");
};
const hashRefreshToken = (token) => {
  return createHash("sha256").update(token).digest("hex");
};
