import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Drizzle-kit ładuje tylko .env – jawnie ładujemy .env.local (Next.js)
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
