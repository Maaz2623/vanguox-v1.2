import { systemPrompt, webSearcherPrompt } from "@/prompt";
import {
  convertToModelMessages,
  generateText,
  streamText,
  tool,
  UIMessage,
} from "ai";
import z from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "openai/gpt-4.1",
    system: `
  You are a helpful assistant.
  - If a tool is called, wait for its result.
  - Then, always write a final assistant message in natural language using the tool output.
`,
    messages: convertToModelMessages(messages),
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
    originalMessages: messages,
    onFinish: async ({ messages: updatedMessages }) => {
      console.log(
        "🔍 Final assistant messages:",
        JSON.stringify(updatedMessages, null, 2)
      );
    },
  });
}
