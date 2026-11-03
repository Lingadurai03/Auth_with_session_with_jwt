import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest.middleware.js";
import * as authValidators from "../validators/auth.validators.js";
import * as authController from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest(authValidators.registerUserdata),
  authController.register,
);

authRouter.post(
  "/login",
  validateRequest(authValidators.LoginUserdata),
  authController.login,
);

export default authRouter;
