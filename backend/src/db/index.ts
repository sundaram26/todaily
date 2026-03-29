import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DATABASE_URL } from "../config/env";
import * as schema from "./schema/index"

const pool = new Pool({
  connectionString: DATABASE_URL,
});
export const db = drizzle({ client: pool, schema });

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("DB Connected Successfully");
    client.release();
  } catch(error) {
    console.log("DB Connection Failed: ", error);
    process.exit(1);
  }
}