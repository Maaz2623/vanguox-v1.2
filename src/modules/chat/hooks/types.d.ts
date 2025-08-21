export type Model = {
  id:
    | "openai/gpt-4o"
    | "anthropic/claude-opus-4-20250514"
    | "anthropic/claude-4-sonnet"
    | "google/gemini-2.5-flash"
    | "moonshotai/kimi-k2"
    | "openai/gpt-4o-mini"
    | "xai/grok-4"
    | "deepseek/deepseek-r1"
    | "perplexity/perplexity-sonar"
    | "vercel/vercel-v0-1.5-md"
    | "deepseek/deepseek-r1-distill-llama-70b"
    | "deepseek/deepseek-v3"
    | "meta/llama-3.3-70b";
  name:
    | "GPT-4o"
    | "Claude 4 Opus"
    | "Claude 4 Sonnet"
    | "Gemini 2.5 Flash"
    | "Kimi K2"
    | "GPT-4o Mini"
    | "Grok 4"
    | "DeepSeek R1"
    | "Perplexity Sonar"
    | "Vercel v0.1.5 MD"
    | "DeepSeek R1 Distill LLaMA 70B"
    | "DeepSeek V3"
    | "LLaMA 3.3 70B";
  icon:
    | "/model-logos/openai.avif"
    | "/model-logos/anthropic.avif"
    | "/model-logos/google.avif"
    | "/model-logos/moonshotai.avif"
    | "/model-logos/xai.avif"
    | "/model-logos/deepseek.avif"
    | "/model-logos/perplexity.avif"
    | "/model-logos/vercel.avif"
    | "/model-logos/meta.avif";
};
