import { sql } from "drizzle-orm";
import { varchar, timestamp, pgTable, text } from "drizzle-orm/pg-core";
import { z } from "zod";

import { type getItems } from "@/lib/api/items/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const items = pgTable("items", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  content: varchar("content", {length: 10000}).notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for items - used to validate API requests
// const baseSchemaO = createSelectSchema(items).omit(timestamps);
const baseSchema = z.object({
  id: z.string(),
  content: z.string(),
});

// export const insertItemSchemaO = createInsertSchema(items).omit(timestamps);
export const insertItemSchema = z.object({
  content: z.string(),
});
export const insertItemParams = baseSchema.extend({}).omit({
  id: true,
});

export const updateItemSchema = baseSchema;
export const updateItemParams = baseSchema.extend({});
export const itemIdSchema = baseSchema.pick({ id: true });

// Types for items - used to type API request params and within Components
export type Item = typeof items.$inferSelect;
export type NewItem = z.infer<typeof insertItemSchema>;
export type NewItemParams = z.infer<typeof insertItemParams>;
export type UpdateItemParams = z.infer<typeof updateItemParams>;
export type ItemId = z.infer<typeof itemIdSchema>["id"];

// this type infers the return from getItems() - meaning it will include any joins
export type CompleteItem = Awaited<
  ReturnType<typeof getItems>
>["items"][number];
