import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import * as userSchema from "../schemas/user.schema.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  getCsrfToken,
  validateCsrfToken,
} from "../middlewares/csrf.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateCsrfToken,
  validateRequest(userSchema.registerUserSchema),
  authController.register,
);
authRouter.post(
  "/login",
  validateCsrfToken,
  validateRequest(userSchema.loginUserSchema),
  authController.login,
);

authRouter.get("/getMe", requireAuth, authController.getMe);

authRouter.patch(
  "/updateMe",
  requireAuth,
  validateCsrfToken,
  validateRequest(userSchema.udpateUserData),
  authController.updateMe,
);

authRouter.post(
  "/logout",
  requireAuth,
  validateCsrfToken,
  authController.logout,
);
authRouter.get("/csrf-token", getCsrfToken);
authRouter.get(
  "/all",
  requireAuth,
  requireRole("admin"),
  authController.getAllUser,
);

export default authRouter;
