import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import * as userSchema from "../schemas/user.schema.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest(userSchema.registerUserSchema),
  authController.register,
);
authRouter.post(
  "/login",
  validateRequest(userSchema.loginUserSchema),
  authController.login,
);

export default authRouter;
