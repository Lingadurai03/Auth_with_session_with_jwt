import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    fullName: {
      name: "full_name",
      type: "varchar",
      length: 255,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    role: {
      type: "enum",
      enum: ["admin", "user"],
      default: "user",
    },
    passwordHash: {
      name: "password_hash",
      type: "varchar",
      length: 255,
      nullable: false,
      select: false,
    },
    createdAt: {
      name: "created_at",
      type: "timestamptz",
      createDate: true,
    },
    updatedAt: {
      name: "updated_at",
      type: "timestamptz",
      updateDate: true,
    },
    disabledAt: {
      name: "disabled_at",
      type: "timestamptz",
      nullable: true,
    },
  },

  relations: {
    documents: {
      type: "one-to-many",
      target: "Document",
      inverseSide: "user",
    },
  },
});
