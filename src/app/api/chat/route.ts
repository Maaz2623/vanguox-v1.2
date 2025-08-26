import { saveChat } from "@/ai/functions";
import { Model } from "@/modules/chat/hooks/types";
import { systemPrompt, webSearcherPrompt } from "@/prompt";
import {
  convertToModelMessages,
  createIdGenerator,
  generateText,
  smoothStream,
  streamText,
  tool,
  UIMessage,
} from "ai";
import z from "zod";

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
      webSearcher: tool({
        description: "Search through the web.",
        inputSchema: z.object({
          prompt: z.string("The prompt to search the web for"),
        }),
        execute: async ({ prompt }) => {
          try {
            const result = await generateText({
              model: "perplexity/sonar",
              prompt: prompt,
              system: webSearcherPrompt,
            });
            console.log(result.content);
            return result.content;
          } catch (error) {
            console.log(error);
          }
        },
      }),
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
