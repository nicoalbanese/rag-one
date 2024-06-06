import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { findSimilarContent } from "@/lib/ai/embeddings";

// there is a version of this without abstractions in app/api/chat-inlined/route.ts

export async function POST(request: Request) {
  const { messages }: { messages: CoreMessage[] } = await request.json();
  const lastFewMessages = messages
    .slice(-3)
    .map((m) => m.content)
    .join("; ") as string;
  const similarContent = await findSimilarContent(lastFewMessages);
  console.log(similarContent.map((c) => c.name).join("; "));

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
          similarContent.map((c) => c.name).join("; "),
      },
    ],
  });
  return result.toAIStreamResponse();
}
