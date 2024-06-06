import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  ItemId, 
  NewItemParams,
  UpdateItemParams, 
  updateItemSchema,
  insertItemSchema, 
  items,
  itemIdSchema 
} from "@/lib/db/schema/items";
import { generateEmbedding } from "@/lib/ai/embeddings";

export const createItem = async (item: NewItemParams) => {
  const newItem = insertItemSchema.parse(item);
  try {
    const [i] =  await db.insert(items).values({ ...newItem }).returning();
    return { item: i };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateItem = async (id: ItemId, item: UpdateItemParams) => {
  const { id: itemId } = itemIdSchema.parse({ id });
  const newItem = updateItemSchema.parse(item);
  try {
    const [i] =  await db
     .update(items)
     .set({...newItem, updatedAt: new Date() })
     .where(eq(items.id, itemId!))
     .returning();
    return { item: i };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteItem = async (id: ItemId) => {
  const { id: itemId } = itemIdSchema.parse({ id });
  try {
    const [i] =  await db.delete(items).where(eq(items.id, itemId!))
    .returning();
    return { item: i };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

