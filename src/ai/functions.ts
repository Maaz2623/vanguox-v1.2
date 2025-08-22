"use server";

import { UIMessage, convertToModelMessages, generateText } from "ai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

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
