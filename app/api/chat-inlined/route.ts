import { CoreMessage, embed, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddings } from "@/lib/db/schema/embeddings";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const { messages }: { messages: CoreMessage[] } = await request.json();
  
  // create embedding for previous messages
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-ada-002"),
    value: messages.map((m) => m.content).join("; "),
  });

  // retrieve similar content from DB
  const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, embedding)})`;
  const similarContent = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings).where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity)).limit(4);

  // generate answer that uses content
  const result = await streamText({
    model: openai("gpt-4o"),
    system:
      "You are a helpful assistant." +
      `Answer the user's question using only the provided information.\n` +
      `If the user's question cannot be answered using the provided information, ` +
      `respond with "I don't know`,
    messages: [
      ...messages,
      {
        role: "user",
        content:
          "Here is some relevant information to use: " +
          JSON.stringify(similarContent, null, 2),
      },
    ],
  });
  return result.toAIStreamResponse();
}
