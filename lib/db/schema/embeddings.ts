import { varchar, index, pgTable, vector } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { z } from "zod";
import { items } from "./items";

export const embeddings = pgTable(
  "embeddings",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    content: varchar("content", { length: 5000 }).notNull(),
    itemId: varchar("item_id").references(() => items.id, {
      onDelete: "cascade",
    }),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

// Schema for items - used to validate API requests
// const baseSchemaO = createSelectSchema(items).omit(timestamps);
const baseSchema = z.object({
  id: z.string(),
  content: z.string(),
  embedding: z.array(z.number()),
});
