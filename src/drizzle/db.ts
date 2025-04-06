
//Config for PostgreSQL (node-postgres driver)

/* import { env } from "@/data/env/server"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema"

export const db = drizzle({
  schema,
  connection: {
    password: env.DB_PASSWORD,
    user: env.DB_USER,
    database: env.DB_NAME,
    host: env.DB_HOST,
  },
}) */


//Config for Neon DB + neon-http driver
// import { env } from "@/data/env/server";
// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-http';
// import * as schema from "./schema"
// const sql = neon(env.DATABASE_URL);
// export const db = drizzle({ client: sql,schema});


//Config for Neon + PostgreSQL (node-postgres driver)
import { env } from "@/data/env/server";
import * as schema from "./schema"
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});
export const db = drizzle({ client: pool, schema: schema});
 
