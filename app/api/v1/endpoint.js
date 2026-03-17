//✅ 4. Key-Table Endpoint Layer

//Expose a type-safe access API:

// endpoint.js

import { db } from "./db.js";

/**
 * @template {keyof typeof db} K
 * @param {K} table
 */
export function getTable(table) {
  return db[table];
}
