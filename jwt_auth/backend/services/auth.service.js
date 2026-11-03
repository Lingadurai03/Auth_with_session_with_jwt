import { pgPool } from "../config/db_config.js";
import { compare, hash } from "bcrypt";

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
  const user = await getUserWithPasswordHash(email.toLowerCase());
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
  return safeUser;
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
