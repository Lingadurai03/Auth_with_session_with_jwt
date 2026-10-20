import { ZodError } from "zod";

export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed.body;
      req.params = parsed.params;

      if (req.query) {
        for (const key in req.query) {
          delete req.query[key];
        }
        Object.assign(req.query, parsed.query);
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: formattedErrors,
        });
      }

      return next(error);
    }
  };
};
