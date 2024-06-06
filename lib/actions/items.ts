"use server";

import { revalidatePath } from "next/cache";
import { createItem, deleteItem, updateItem } from "@/lib/api/items/mutations";
import {
  ItemId,
  NewItemParams,
  UpdateItemParams,
  itemIdSchema,
  insertItemParams,
  updateItemParams,
} from "@/lib/db/schema/items";
import { generateManyEmbeddings } from "../ai/embeddings";
import { db } from "../db";
import { embeddings } from "../db/schema/embeddings";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateItems = () => revalidatePath("/items");

export const createItemAction = async (input: NewItemParams) => {
  try {
    const payload = insertItemParams.parse(input);
    const contentSmall = payload.content.replace("\n", " ");

    const { item } = await createItem({ content: contentSmall });
    const e = await generateManyEmbeddings(contentSmall);
    await db
      .insert(embeddings)
      .values(e.map((embed) => ({ itemId: item.id, ...embed })));
    revalidateItems();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateItemAction = async (input: UpdateItemParams) => {
  try {
    const payload = updateItemParams.parse(input);
    await updateItem(payload.id, payload);
    revalidateItems();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteItemAction = async (input: ItemId) => {
  try {
    const payload = itemIdSchema.parse({ id: input });
    await deleteItem(payload.id);
    revalidateItems();
  } catch (e) {
    return handleErrors(e);
  }
};
