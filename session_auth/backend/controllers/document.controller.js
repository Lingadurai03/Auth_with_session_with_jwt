import * as DocumentService from "../services/document.service.js";

export const createDocument = async (req, res, next) => {
  try {
    const userId = req.session?.userId;
    console.log(req.body?.title);
    const document = await DocumentService.createDocument({
      userId,
      title: req.body?.title,
    });
    res.status(200).json({
      message: "Document created successfully",
      data: document,
    });
  } catch (e) {
    return next(e);
  }
};

export const getDocumentById = async (req, res, next) => {
  try {
    const userId = req.session?.userId;

    const document = await DocumentService.getDocumentById(
      req.params.id,
      userId,
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }
    console.log(userId);
    console.log(document.userId);
    return res.status(200).json(document);
  } catch (error) {
    return next(error);
  }
};

export const updateDocument = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const docId = req.params.id;

    const affected = await DocumentService.updateDocument(docId, userId, {
      title: req.body.title,
    });

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document updated successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const docId = req.params.id;

    const affected = await DocumentService.deleteDocument(docId, userId);

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};
