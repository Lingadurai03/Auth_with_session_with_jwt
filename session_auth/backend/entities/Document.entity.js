import { EntitySchema } from "typeorm";

export const Document = new EntitySchema({
  name: "Document",
  tableName: "documents",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    title: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    userId: {
      name: "user_id",
      type: "uuid",
      nullable: false,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User", // Matches EntitySchema name string
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
  },
});
