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

