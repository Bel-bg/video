// runMigrations.js
const fs = require("fs");
const path = require("path");
const supabase = require("./src/config/supabase");

async function runMigrations() {
  try {
    console.log("Running database migrations...");

    // Get all migration files
    const migrationsDir = path.join(__dirname, "database", "migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    console.log(`Found ${migrationFiles.length} migrations to run`);

    // Run each migration
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);

      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, "utf8");

      // Split by semicolon to run multiple statements
      const statements = sql.split(";").filter((stmt) => stmt.trim() !== "");

      for (const statement of statements) {
        if (statement.trim() !== "") {
          const { error } = await supabase.rpc("execute_sql", {
            sql: statement.trim(),
          });
          if (error) throw error;
        }
      }

      console.log(`Completed migration: ${file}`);
    }

    console.log("All migrations completed successfully!");
  } catch (error) {
    console.error("Error running migrations:", error);
  }
}

runMigrations();
