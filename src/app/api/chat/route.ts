import { saveChat, updateChatTitle } from "@/ai/functions";
import {
  addResource,
  getInformation,
  imageGenerator,
  webSearcher,
} from "@/ai/tools";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { Model } from "@/modules/chat/hooks/types";
import { systemPrompt } from "@/prompt";
import { getQueryClient, trpc } from "@/trpc/server";
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

  // --- Auth ---
  const authData = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!authData) {
    throw new Error("Unauthorized");
  }

  // --- Subscription & usage ---
  const queryClient = getQueryClient();
  const data = await queryClient.fetchQuery(
    trpc.subscription.getCurrentSubscription.queryOptions()
  );

  const [usage] = await db
    .select({
      tokensUsed: user.totalTokensUsed,
      maxTokens: user.maxTokens,
    })
    .from(user)
    .where(eq(user.id, authData.user.id));

  const billingCycleEnd = data?.billingCycleEnd
    ? new Date(data.billingCycleEnd).getTime()
    : 0;

  // --- Enforce token limit ---
  if (
    usage.maxTokens !== null &&
    usage.tokensUsed >= usage.maxTokens &&
    Date.now() < billingCycleEnd
  ) {
    throw new Error("Token limit reached");
  }

  // --- Streaming response ---
  const result = streamText({
    model,
    system: `${systemPrompt}`,
    messages: convertToModelMessages(messages),
    experimental_transform: smoothStream({
      chunking: "word",
      delayInMs: 25,
    }),
    tools: {
      webSearcher,
      imageGenerator: imageGenerator(model),
      getInformation,
      addResource,
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
          chatId,
          messages,
          model,
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

      // Save chat
      await saveChat({
        chatId,
        messages: [userMessage, assistantMessage],
        modelId: model,
      });

      // Update usage
      const fullUsage = await result.usage;
      const updatedTotal = usage.tokensUsed + (fullUsage.totalTokens ?? 0);

      await db
        .update(user)
        .set({
          totalTokensUsed: updatedTotal,
          updatedAt: new Date(),
        })
        .where(eq(user.id, authData.user.id));
    },
  });
}
