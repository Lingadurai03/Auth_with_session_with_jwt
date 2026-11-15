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

    const { accessToken, refreshToken, ...userWithoutToken } = user;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/auth/refresh",
    });
    return res.status(200).json(userWithoutToken);
  } catch (e) {
    return next(e);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      throw error;
    }
    const { accessToken, refreshToken } =
      await authService.refreshToken(oldRefreshToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/auth/refresh",
    });
    return res.status(200).json({ message: "Cookies updated successfully" });
  } catch (e) {
    return next(e);
  }
};
