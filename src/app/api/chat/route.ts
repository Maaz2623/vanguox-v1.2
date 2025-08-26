import { saveChat } from "@/ai/functions";
import { appBuilder, imageGenerator, webSearcher } from "@/ai/tools";
import { Model } from "@/modules/chat/hooks/types";
import { systemPrompt } from "@/prompt";
import {
  convertToModelMessages,
  createIdGenerator,
  smoothStream,
  streamText,
  UIMessage,
} from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    model,
    chatId,
  }: { messages: UIMessage[]; model: Model["id"]; chatId: string } =
    await req.json();

  const result = streamText({
    model: model,
    system: `${systemPrompt}`,
    messages: convertToModelMessages(messages),
    experimental_transform: smoothStream({
      chunking: "word",
      delayInMs: 25,
    }),
    tools: {
      appBuilder: appBuilder,
      webSearcher: webSearcher,
      imageGenerator: imageGenerator(model),
    },
  });
  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    sendSources: true,
    originalMessages: messages,
    generateMessageId: createIdGenerator({
      prefix: "msg",
      size: 16,
    }),
    onFinish: async ({ messages: updatedMessages }) => {
      const reversed = [...updatedMessages].reverse();

      const assistantMessage = reversed.find(
        (m) =>
          m.role === "assistant" &&
          m.parts.some((p) => p.type === "text") &&
          m.parts.every(
            (p) => p.type !== "tool-generateImage" || p.output !== undefined
          )
      );

      if (!assistantMessage) return;

      // Now find the user message that came before this assistant message
      const assistantIndex = updatedMessages.findIndex(
        (m) => m.id === assistantMessage.id
      );

      const userMessage = updatedMessages
        .slice(0, assistantIndex)
        .reverse()
        .find((m) => m.role === "user");

      if (!userMessage) return;

      await saveChat({
        chatId: chatId,
        messages: [userMessage, assistantMessage],
        modelId: model,
      });
    },
  });
}
