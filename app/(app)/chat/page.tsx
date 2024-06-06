"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-xl">Vercel AI SDK - RAG Demo</h1>
      <div className="flex-grow space-y-2 my-4">
        {messages.map((m) => (
          <div key={m.id}>
            {m.role}:{"\n"}
            {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
        <Button disabled={isLoading}>Send</Button>
      </form>
    </div>
  );
}
