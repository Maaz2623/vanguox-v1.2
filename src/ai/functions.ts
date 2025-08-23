"use server";

import { UIMessage, convertToModelMessages, generateText } from "ai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { db } from "@/db";
import { messagesTable } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function updateChatTitle({
  messages,
  chatId,
  model,
}: {
  messages: UIMessage[];
  chatId: string;
  model: string;
}) {
  try {
    const result = await generateText({
      model: model,
      system:
        "You are a messages summarizer. You take the prompts and extract the topics efficiently in least possible words. This title will be give for the chat. Do not include markdown, just plain text. Never say no topic and never say anything like varied topics. If multiple topics seperate by commas. Never exceed more than 4 words.",
      messages: convertToModelMessages(messages),
    });

    const title = result.text;

    await convex.mutation(api.chats.updateConvexChatTitle, {
      title: title,
      chatId: chatId,
    });
  } catch (error) {
    console.log("updateChatTitle error", error);
  }
}

export async function loadChat(id: string) {
  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.chatId, id));

  if (messages.length === 0) {
    return [];
  }

  const formattedMessages = messages.map((msg) => msg.message);

  return formattedMessages;
}

export async function saveChat({
  chatId,
  messages,
  modelId,
}: {
  chatId: string;
  messages: UIMessage[];
  modelId: string;
}) {
  try {
    console.log("Saving chat...");
    const ids = messages.map((m) => m.id);

    // Get existing message IDs from the DB
    const existing = await db
      .select({ id: messagesTable.id })
      .from(messagesTable)
      .where(inArray(messagesTable.id, ids));

    const existingIds = new Set(existing.map((e) => e.id));

    // Filter out already-saved messages
    const newMessagesToInsert = messages.filter(
      (msg) => !existingIds.has(msg.id)
    );

    if (newMessagesToInsert.length === 0) return [];

    const newMessages = await db
      .insert(messagesTable)
      .values(
        newMessagesToInsert.map((msg) => ({
          id: msg.id,
          message: msg, // no need to spread id into message again
          chatId,
          modelId: modelId,
        }))
      )
      .returning();

    console.log("messages saved.");
    return newMessages;
  } catch (error) {
    console.error("Failed to save chat:", error);
    return [];
  }
}
