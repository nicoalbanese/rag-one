import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { db } from "../db";
import { embeddings } from "../db/schema/embeddings";

export const model = openai("gpt-4o");

export const generateChunks = (input: string): string[] => {
  return input.trim().split(".").filter(i => i !== "");
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\n", " ");
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-ada-002"),
    value: input,
  });
  return embedding;
};

export const generateManyEmbeddings = async (
  value: string,
): Promise<Array<{embedding: number[], content: string }>> => {
  const chunks = generateChunks(value);
  console.log(chunks)
  const { embeddings, values } = await embedMany({
    model: openai.embedding("text-embedding-ada-002"),
    values: chunks,
  });
  console.log({embeddings, values})
  return embeddings.map(( e, i ) => ({content: values[i], embedding: e}));
};

export const findSimilarContent = async (description: string) => {
  const embedding = await generateEmbedding(description);
  const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, embedding)})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  return similarGuides;
};
