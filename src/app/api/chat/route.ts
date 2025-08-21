import { Model } from "@/modules/chat/hooks/types";
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Incoming body:", body);

    const { messages, model }: { messages: UIMessage[]; model: Model["id"] } =
      body;
    const result = streamText({
      model: model,
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log(error);
  }
}
