import * as authService from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      }
      req.session.userId = user.id;

      req.session.save((error) => {
        if (error) {
          return next(error);
        }
        return res.status(201).json({
          message: "User created successfully",
          data: user,
        });
      });
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await authService.login(req.body);
    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      }
      req.session.userId = user.id;
      req.session.save((error) => {
        if (error) {
          return next(error);
        }
        return res.status(200).json({
          data: user,
        });
      });
    });
  } catch (e) {
    return next(e);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.session.userId);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists or is unavailable",
      });
    }

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateMe = async (req, res, next) => {
  const userData = req.body;
  const userId = req.session?.userId;

  try {
    const result = await authService.updateMe(userId, userData);

    if (!result) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (e) {
    return next(e);
  }
};

export const logout = async (req, res, next) => {
  req.session.destroy((e) => {
    if (e) {
      return next(e);
    }
    res.clearCookie("connect.sid");

    return res.status(200).json({
      message: "Logout successful",
    });
  });
};
