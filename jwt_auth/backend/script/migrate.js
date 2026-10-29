import { Client } from "pg";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileName = process.argv[2];
const client = new Client({ connectionString: process.env.DATABASE_URL });
if (!fileName) {
  console.error("No migration filename provided.");
  process.exitCode = 1;
} else {
  runMigration();
}

async function runMigration() {
  try {
    const sqlFilePath = path.join(__dirname, "..", "migrations", fileName);
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`Migration file not found: ${fileName}`);
    }
    await client.connect();
    console.log("Connected to the DB");

    const checkFileNameExistOnMigrationSchema_query = `select count(*) from schema_migrations where migration_name = ($1)`;
    const fileNameExistOnMigationSchema = await client.query(
      checkFileNameExistOnMigrationSchema_query,
      [fileName],
    );
    if (Number(fileNameExistOnMigationSchema.rows[0].count) > 0) {
      console.log("Migration already done");
      return;
    }

    console.log(`Reading: ${fileName}`);
    const sql = fs.readFileSync(sqlFilePath, "utf-8");
    try {
      await client.query("begin");
      console.log("Running sql Query");
      await client.query(sql);

      const migrationQuery = `insert into schema_migrations(migration_name) values ($1)`;
      await client.query(migrationQuery, [fileName]);
      await client.query("commit");

      console.log(` Success! ${fileName} executed successfully.`);
    } catch (e) {
      await client.query("rollback");
      console.error(
        `Migration failed for ${fileName}. Changes rolled back.`,
        e,
      );
      throw e;
    }
  } catch (e) {
    console.error("Migration failed:", e.message);
    process.exitCode = 1;
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}
