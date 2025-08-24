import { webSearcherPrompt } from "@/prompt";
import { generateText, tool } from "ai";
import z from "zod";
import { v0 } from "v0-sdk";

export const myToolSet = {
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
        return result.text;
      } catch (error) {
        console.log(error);
      }
    },
  }),

  appBuilder: tool({
    description: "You are an expert coder.",
    inputSchema: z.object({
      prompt: z.string().describe("The prompt to build the app from."),
    }),
    execute: async ({ prompt }) => {
      const result = await v0.chats.create({
        system: "You are an expert coder",
        message: prompt,
        modelConfiguration: {
          modelId: "v0-1.5-sm",
          imageGenerations: false,
          thinking: false,
        },
      });
      return {
        webUrl: result.demo,
        files: result.files,
      };
    },
  }),
};
