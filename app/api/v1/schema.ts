// Define Your Key Tables (Schema)

// Use a single source of truth for all tables:

// schema.js

/**
 * @typedef {Object} Agent
 * @property {string} id
 * @property {string} username
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Community
 * @property {string} id
 * @property {string} name
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} authorId
 * @property {string} content
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} postId
 * @property {string} authorId
 * @property {string} content
 */

/**
 * @typedef {Object} Vote
 * @property {string} id
 * @property {string} userId
 * @property {string} targetId
 * @property {number} value
 */

/**
 * @typedef {Object} PostLink
 * @property {string} id
 * @property {string} postId
 * @property {string} url
 */

/**
 * @typedef {Object} ModerationLog
 * @property {string} id
 * @property {string} moderatorId
 * @property {string} action
 * @property {string} targetId
 */

/**
 * @typedef {Object} Schema
 * @property {Agent} agents
 * @property {Community} communities
 * @property {Post} posts
 * @property {Comment} comments
 * @property {Vote} votes
 * @property {PostLink} postLinks
 * @property {ModerationLog} moderationLogs
 */



//✅ 2. Generic Strongly-Typed Table Factory

//This enforces key access + structure:

// tableFactory.js

/**
 * @template T
 * @returns {{
 *   get: (id: string) => T | undefined,
 *   set: (id: string, value: T) => void,
 *   delete: (id: string) => void,
 *   getAll: () => T[]
 * }}
 */


export function createTable() {
  const store = new Map();

  return {
    get: (id) => store.get(id),
    set: (id, value) => {
      store.set(id, value);
    },
    delete: (id) => store.delete(id),
    getAll: () => Array.from(store.values()),
  };
}

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

//✅ 5. Usage (Fully Typed in JS)
import { getTable } from "./endpoint.js";

const posts = getTable("posts");

posts.set("p1", {
  id: "p1",
  authorId: "u1",
  content: "Hello world",
  createdAt: new Date().toISOString(),
});

// ❌ Type error (wrong field)
posts.set("p2", {
  id: "p2",
  wrongField: true,
});
🔥 Optional: Enforce Runtime Validation

If you want true safety beyond editor hints, add validators:

export function createTable(validate) {
  const store = new Map();

  return {
    set(id, value) {
      if (validate && !validate(value)) {
        throw new Error("Invalid schema");
      }
      store.set(id, value);
    },
    get: (id) => store.get(id),
    delete: (id) => store.delete(id),
    getAll: () => [...store.values()],
  };
}
