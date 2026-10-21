export const requireAuth = (req, res, next) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }
  next();
};
