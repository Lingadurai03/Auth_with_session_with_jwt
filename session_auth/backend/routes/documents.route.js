import { Router } from "express";
import { validateCsrfToken } from "../middlewares/csrf.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { documentSchema } from "../schemas/docuemnt.schema.js";
import * as DocumentController from "../controllers/document.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const documentRouter = Router();

documentRouter.post(
  "",
  validateCsrfToken,
  validateRequest(documentSchema),
  requireAuth,
  DocumentController.createDocument,
);

documentRouter.get("/:id", requireAuth, DocumentController.getDocumentById);

documentRouter.patch(
  "/:id",
  requireAuth,
  validateCsrfToken,
  validateRequest(documentSchema),
  DocumentController.updateDocument,
);

documentRouter.delete(
  "/:id",
  requireAuth,
  validateCsrfToken,
  DocumentController.deleteDocument,
);

export default documentRouter;
