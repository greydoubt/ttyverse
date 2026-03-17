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
