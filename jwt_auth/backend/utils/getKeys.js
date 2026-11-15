import { readFileSync } from "node:fs";

export const privateKey = readFileSync(process.env.JWT_SECRET_PRIVATE, "utf8");

export const publicKey = readFileSync(process.env.JWT_SECRET_PUBLIC, "utf8");
