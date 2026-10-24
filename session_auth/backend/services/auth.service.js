import { AppDataSource } from "../config/data-source.js";
import { pgPool } from "../config/session.js";
import { User } from "../entities/User.js";
import bcrypt from "bcrypt";

export const register = async (user) => {
  const { fullName, email, password } = user;
  const userRepo = AppDataSource.getRepository(User);
  const existingUser = await findUser(email);
  if (existingUser) {
    const error = new Error("Email already register");
    error.statusCode = 400;
    throw error;
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = userRepo.create({
    fullName: fullName,
    email,
    passwordHash: hashedPassword,
  });

  await userRepo.save(newUser);

  const { passwordHash: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const login = async (loginDetails) => {
  const { email, password } = loginDetails;
  const user = await findUser(email);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.disabledAt) {
    const error = new Error(
      "Your account is disabled. Please contact an administrator.",
    );
    error.statusCode = 403;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
export const getMe = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    return null;
  }

  return user;
};

export const updateMe = async (userId, userData) => {
  const userRepo = AppDataSource.getRepository(User);

  const updateData = {};

  if (userData.fullName !== undefined) {
    updateData.fullName = userData.fullName;
  }

  if (Object.keys(updateData).length === 0) {
    return false;
  }

  const result = await userRepo.update({ id: userId }, updateData);

  return result.affected > 0;
};

export const getAllUser = () => {
  const userRepo = AppDataSource.getRepository(User);

  return userRepo.find();
};

const findUser = (email) => {
  const userRepo = AppDataSource.getRepository(User);

  return userRepo
    .createQueryBuilder("user")
    .addSelect("user.passwordHash")
    .where("user.email = :email", { email })
    .getOne();
};
export const findUserById = (userId) => {
  const userRepo = AppDataSource.getRepository(User);

  return userRepo.findOneBy({ id: userId });
};

export const deactivateUser = async (userId) => {
  return AppDataSource.transaction(async (manager) => {
    // 1. Disable the account.
    const userResult = await manager
      .createQueryBuilder()
      .update(User)
      .set({ disabledAt: () => "NOW()" })
      .where("id = :userId", { userId })
      .returning(["id"])
      .execute();

    if (userResult.affected === 0) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // 2. Revoke all sessions belonging to this user.
    const sessionResult = await manager.query(
      `DELETE FROM "session"
       WHERE sess ->> 'userId' = $1`,
      [String(userId)],
    );

    // 3. TypeORM commits automatically if the callback succeeds.
    return {
      userId: userResult.raw[0].id,
      sessionsRevoked: sessionResult.length,
    };
  });
};
