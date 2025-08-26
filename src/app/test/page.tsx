"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useState } from "react";

export default function Page() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    // sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });
  const [input, setInput] = useState("");

  return (
    <>
      {messages?.map((message) => (
        <div key={message.id}>
          <strong>{`${message.role}: `}</strong>
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return <div key={i}>{part.text}</div>;
              case "tool-webSearcher":
                switch (part.state) {
                  case "input-available":
                    return <div key={i}>Searching the web...</div>;
                }
              default:
                return null;
            }
          })}
          <br />
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
          }
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} />
      </form>
    </>
  );
}
