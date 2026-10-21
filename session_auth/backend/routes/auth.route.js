import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import * as userSchema from "../schemas/user.schema.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

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

authRouter.get("/getMe", requireAuth, authController.getMe);

authRouter.patch(
  "/updateMe",
  requireAuth,
  validateRequest(userSchema.udpateUserData),
  authController.updateMe,
);

authRouter.get("/logout", requireAuth, authController.logout);

export default authRouter;
