import crypto from "node:crypto";

export const getCsrfToken = (req, res) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }

  return res.status(200).json({
    csrfToken: req.session.csrfToken,
  });
};

export const validateCsrfToken = (req, res, next) => {
  const sessionToken = req.session?.csrfToken;
  const requestToken = req.get("X-CSRF-Token");

  if (typeof sessionToken !== "string" || typeof requestToken !== "string") {
    return res.status(403).json({
      message: "Invalid or missing CSRF token",
    });
  }

  const expected = Buffer.from(sessionToken);
  const received = Buffer.from(requestToken);

  if (
    expected.length !== received.length ||
    !crypto.timingSafeEqual(expected, received)
  ) {
    return res.status(403).json({
      message: "Invalid or missing CSRF token",
    });
  }

  return next();
};
