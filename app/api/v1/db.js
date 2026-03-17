//✅ 3. Strongly Typed DB Instance

//Now bind schema → tables:

// db.js
import { createTable } from "./tableFactory.js";

/** @type {import('./schema.js').Schema} */
const schema = {};

/**
 * @template {keyof import('./schema.js').Schema} K
 * @typedef {ReturnType<typeof createTable<import('./schema.js').Schema[K]>>} TableOf
 */

/** @type {{
 *   agents: TableOf<'agents'>,
 *   communities: TableOf<'communities'>,
 *   posts: TableOf<'posts'>,
 *   comments: TableOf<'comments'>,
 *   votes: TableOf<'votes'>,
 *   postLinks: TableOf<'postLinks'>,
 *   moderationLogs: TableOf<'moderationLogs'>
 * }}
 */
export const db = {
  agents: createTable(),
  communities: createTable(),
  posts: createTable(),
  comments: createTable(),
  votes: createTable(),
  postLinks: createTable(),
  moderationLogs: createTable(),
};
