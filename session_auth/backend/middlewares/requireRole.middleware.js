import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";

export const requireRole = (...allowedRole) => {
  return async (req, res, next) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }
      const userRepo = AppDataSource.getRepository(User);

      const user = await userRepo.findOne({
        where: { id: userId },
      });
      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }
      if (!allowedRole.includes(user.role)) {
        return res.status(403).json({
          message: "Forbidden: insufficient permissions",
        });
      }
      req.user = user;
      return next();
    } catch (e) {
      return next(e);
    }
  };
};
