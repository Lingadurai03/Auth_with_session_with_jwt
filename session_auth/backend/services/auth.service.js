import { AppDataSource } from "../config/data-source.js";
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

  const { password_hash: _, ...userWithoutPassword } = newUser;
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
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const findUser = (email) => {
  const userRepo = AppDataSource.getRepository(User);
  return userRepo.findOneBy({ email });
};
