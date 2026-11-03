import * as authService from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await authService.register(userData);

    return res
      .status(201)
      .json({ message: "User created successfully", data: user });
  } catch (e) {
    return next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await authService.login(userData);
    return res.status(200).json(user);
  } catch (e) {
    return next(e);
  }
};
