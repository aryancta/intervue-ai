import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle>;

declare global {
  var __db__: ReturnType<typeof drizzle> | undefined;
}

if (process.env.NODE_ENV === "production") {
  db = drizzle(new Database("sqlite.db"));
} else {
  if (!global.__db__) {
    global.__db__ = drizzle(new Database("sqlite.db"));
  }
  db = global.__db__;
}

export { db, schema };