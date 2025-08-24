import { saveChat } from "@/ai/functions";
import { myToolSet } from "@/ai/tools";
import { auth } from "@/lib/auth/auth";
import { Model } from "@/modules/chat/hooks/types";
import { systemPrompt } from "@/prompt";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  smoothStream,
  createIdGenerator,
} from "ai";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authData) throw new Error("Unauthorized");

  try {
    const body = await req.json();

    const {
      messages,
      model,
      chatId,
    }: { messages: UIMessage[]; model: Model["id"]; chatId: string } = body;
    const result = streamText({
      model: model,
      tools: myToolSet,
      messages: convertToModelMessages(messages),
      system: systemPrompt,
      experimental_transform: smoothStream({
        chunking: "word",
        delayInMs: 25,
      }),
      toolChoice: "auto",
    });

    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
      originalMessages: messages,
      generateMessageId: createIdGenerator({
        prefix: "msg",
        size: 16,
      }),
      onFinish: async ({ messages: updatedMessages }) => {
        // if (messages.length < 2) {
        //   updateChatTitle({
        //     chatId: id,
        //     messages,
        //     model: model,
        //   });
        // }

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
  } catch (error) {
    console.log(error);
  }
}
