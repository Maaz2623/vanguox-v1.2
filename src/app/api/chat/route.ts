import { auth } from "@/lib/auth/auth";
import { Model } from "@/modules/chat/hooks/types";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  smoothStream,
} from "ai";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authData) throw new Error("Unauthorized");

  try {
    const body = await req.json();
    console.log("Incoming body:", body);

    const { messages, model }: { messages: UIMessage[]; model: Model["id"] } =
      body;
    const result = streamText({
      model: model,
      messages: convertToModelMessages(messages),
      experimental_transform: smoothStream({
        chunking: "word",
        delayInMs: 25,
      }),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log(error);
  }
}
