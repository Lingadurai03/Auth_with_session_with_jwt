export class CreateUsersJs1792319202462 {
  name = "CreateUsersJs1792319202462";

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(255) NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "disabled_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"
          PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "users_email_unique"
      ON "users" (LOWER("email"))
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      DROP INDEX "public"."users_email_unique"
    `);

    await queryRunner.query(`
      DROP TABLE "users"
    `);
  }
}
