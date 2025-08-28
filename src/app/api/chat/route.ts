import { saveChat, updateChatTitle } from "@/ai/functions";
import {
  appBuilder,
  emailSender,
  imageGenerator,
  webSearcher,
} from "@/ai/tools";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { Model } from "@/modules/chat/hooks/types";
import { systemPrompt } from "@/prompt";
import {
  convertToModelMessages,
  createIdGenerator,
  smoothStream,
  streamText,
  UIMessage,
} from "ai";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const {
    messages,
    model,
    chatId,
  }: { messages: UIMessage[]; model: Model["id"]; chatId: string } =
    await req.json();

  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authData) {
    throw new Error("Unauthorized");
  }

  // fetch usage + limit
  const [userData] = await db
    .select({
      maxTokens: user.maxTokens,
      totalTokensUsed: user.totalTokensUsed,
    })
    .from(user)
    .where(eq(user.id, authData.user.id));

  // enforce limit
  if (
    userData.maxTokens !== null &&
    userData.totalTokensUsed >= userData.maxTokens
  ) {
    throw new Error("Token limit reached!");
  }

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
      emailSender: emailSender,
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
      if (messages.length < 2) {
        updateChatTitle({
          chatId: chatId,
          messages,
          model: model,
        });
      }

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

      const fullUsage = await result.usage;

      // increment only totalTokensUsed (no more JSON usage object)
      const updatedTotal =
        userData.totalTokensUsed + (fullUsage.totalTokens ?? 0);

      console.log("Updating usage");
      await db
        .update(user)
        .set({
          totalTokensUsed: updatedTotal,
          updatedAt: new Date(),
        })
        .where(eq(user.id, authData.user.id));

      console.log("updated usage");
    },
  });
}
