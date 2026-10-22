import { AppDataSource } from "../config/data-source.js";
import { Document } from "../entities/Document.entity.js";

export const createDocument = async (document) => {
  const documentRepo = AppDataSource.getRepository(Document);

  return documentRepo.save(document);
};

export const getDocumentById = async (docId, userId) => {
  const documentRepo = AppDataSource.getRepository(Document);

  return documentRepo.findOneBy({
    id: docId,
    userId,
  });
};

export const updateDocument = async (docId, userId, updates) => {
  const documentRepo = AppDataSource.getRepository(Document);

  const result = await documentRepo.update(
    {
      id: docId,
      userId,
    },
    {
      title: updates.title,
    },
  );

  return result.affected;
};

export const deleteDocument = async (docId, userId) => {
  const documentRepo = AppDataSource.getRepository(Document);

  const result = await documentRepo.delete({
    id: docId,
    userId,
  });

  return result.affected;
};
