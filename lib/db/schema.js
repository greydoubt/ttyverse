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
