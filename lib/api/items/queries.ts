import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type ItemId, itemIdSchema, items } from "@/lib/db/schema/items";

export const getItems = async () => {
  const rows = await db.select().from(items);
  const i = rows
  return { items: i };
};

export const getItemById = async (id: ItemId) => {
  const { id: itemId } = itemIdSchema.parse({ id });
  const [row] = await db.select().from(items).where(eq(items.id, itemId));
  if (row === undefined) return {};
  const i = row;
  return { item: i };
};


