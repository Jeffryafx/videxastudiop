import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL || "mysql:

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
});
