import { findUserById } from "../services/auth.service.js";

export const requireAuth = async (req, res, next) => {
  try {
    const userId = req.session?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const user = await findUserById(userId);

    if (!user || user.disabledAt) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};
