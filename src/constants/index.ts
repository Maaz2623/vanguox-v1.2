import { Model } from "@/modules/chat/hooks/types";

export const models: Model[] = [
  // Anthropic
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude 4 Sonnet",
    icon: "/model-logos/anthropic.avif",
  },
  {
    id: "anthropic/claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet",
    icon: "/model-logos/anthropic.avif",
  },
  {
    id: "anthropic/claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    icon: "/model-logos/anthropic.avif",
  },
  {
    id: "anthropic/claude-opus-4-1",
    name: "Claude 4.1 Opus",
    icon: "/model-logos/anthropic.avif",
  },
  {
    id: "anthropic/claude-opus-4",
    name: "Claude 4 Opus",
    icon: "/model-logos/anthropic.avif",
  },
  {
    id: "anthropic/claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    icon: "/model-logos/anthropic.avif",
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    icon: "/model-logos/anthropic.avif",
  },
  {
    id: "anthropic/claude-3-opus",
    name: "Claude 3 Opus",
    icon: "/model-logos/anthropic.avif",
  },

  // OpenAI
  {
    id: "openai/gpt-5-nano",
    name: "GPT-5 Nano",
    icon: "/model-logos/openai.avif",
  },
  {
    id: "openai/gpt-5-mini",
    name: "GPT-5 Mini",
    icon: "/model-logos/openai.avif",
  },
  { id: "openai/gpt-5", name: "GPT-5", icon: "/model-logos/openai.avif" },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    icon: "/model-logos/openai.avif",
  },
  { id: "openai/gpt-4o", name: "GPT-4o", icon: "/model-logos/openai.avif" },
  {
    id: "openai/gpt-4-1-mini",
    name: "GPT-4.1 Mini",
    icon: "/model-logos/openai.avif",
  },
  { id: "openai/gpt-4-1", name: "GPT-4.1", icon: "/model-logos/openai.avif" },
  {
    id: "openai/gpt-4-1-nano",
    name: "GPT-4.1 Nano",
    icon: "/model-logos/openai.avif",
  },
  {
    id: "openai/gpt-oss-120b",
    name: "GPT-OSS 120B",
    icon: "/model-logos/openai.avif",
  },
  {
    id: "openai/gpt-oss-20b",
    name: "GPT-OSS 20B",
    icon: "/model-logos/openai.avif",
  },
  { id: "openai/o3", name: "O3", icon: "/model-logos/openai.avif" },
  { id: "openai/o4-mini", name: "O4 Mini", icon: "/model-logos/openai.avif" },
  {
    id: "openai/gpt-3-5-turbo",
    name: "GPT-3.5 Turbo",
    icon: "/model-logos/openai.avif",
  },
  { id: "openai/o3-mini", name: "O3 Mini", icon: "/model-logos/openai.avif" },
  {
    id: "openai/gpt-4-turbo",
    name: "GPT-4 Turbo",
    icon: "/model-logos/openai.avif",
  },
  { id: "openai/o1", name: "O1", icon: "/model-logos/openai.avif" },

  // Google
  {
    id: "google/gemini-2-0-flash",
    name: "Gemini 2.0 Flash",
    icon: "/model-logos/google.avif",
  },
  {
    id: "google/gemini-2-5-flash",
    name: "Gemini 2.5 Flash",
    icon: "/model-logos/google.avif",
  },
  {
    id: "google/gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    icon: "/model-logos/google.avif",
  },
  {
    id: "google/gemini-2-5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    icon: "/model-logos/google.avif",
  },
  {
    id: "google/gemini-2-0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    icon: "/model-logos/google.avif",
  },
  {
    id: "google/gemma-2-9b-it",
    name: "Gemma 2 9B IT",
    icon: "/model-logos/google.avif",
  },

  // DeepSeek
  {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek R1",
    icon: "/model-logos/deepseek.avif",
  },
  {
    id: "deepseek/deepseek-v3-1",
    name: "DeepSeek V3.1",
    icon: "/model-logos/deepseek.avif",
  },
  {
    id: "deepseek/deepseek-v3-0324",
    name: "DeepSeek V3 0324",
    icon: "/model-logos/deepseek.avif",
  },
  {
    id: "deepseek/deepseek-v3-1-thinking",
    name: "DeepSeek V3.1 Thinking",
    icon: "/model-logos/deepseek.avif",
  },
  {
    id: "deepseek/deepseek-v3-1-base",
    name: "DeepSeek V3.1 Base",
    icon: "/model-logos/deepseek.avif",
  },
  {
    id: "deepseek/deepseek-r1-distill-llama-70b",
    name: "DeepSeek R1 Distill LLaMA 70B",
    icon: "/model-logos/deepseek.avif",
  },

  // Alibaba (chat-capable only)
  {
    id: "alibaba/qwen3-32b",
    name: "Qwen3 32B",
    icon: "/model-logos/alibaba.avif",
  },
  {
    id: "alibaba/qwen3-235b-a22b-instruct-2507",
    name: "Qwen3 235B A22B Instruct 2507",
    icon: "/model-logos/alibaba.avif",
  },
  {
    id: "alibaba/qwen3-30b-a3b",
    name: "Qwen3 30B A3B",
    icon: "/model-logos/alibaba.avif",
  },
  {
    id: "alibaba/qwen3-14b",
    name: "Qwen3 14B",
    icon: "/model-logos/alibaba.avif",
  },

  // Moonshot
  {
    id: "moonshot/kimi-k2",
    name: "Kimi K2",
    icon: "/model-logos/moonshotai.avif",
  },

  // ZhipuAI
  { id: "zai/glm-4-5", name: "GLM 4.5", icon: "/model-logos/zai.avif" },
  { id: "zai/glm-4-5-air", name: "GLM 4.5 Air", icon: "/model-logos/zai.avif" },

  // Meta (chat-capable only)
  {
    id: "meta/llama-3-2-3b-instruct",
    name: "LLaMA 3.2 3B Instruct",
    icon: "/model-logos/meta.avif",
  },
  {
    id: "meta/llama-3-2-1b-instruct",
    name: "LLaMA 3.2 1B Instruct",
    icon: "/model-logos/meta.avif",
  },
  {
    id: "meta/llama-3-1-70b-instruct",
    name: "LLaMA 3.1 70B Instruct",
    icon: "/model-logos/meta.avif",
  },
  {
    id: "meta/llama-3-3-70b",
    name: "LLaMA 3.3 70B",
    icon: "/model-logos/meta.avif",
  },
  {
    id: "meta/llama-4-scout",
    name: "LLaMA 4 Scout",
    icon: "/model-logos/meta.avif",
  },
  {
    id: "meta/llama-4-maverick-17b-128e-instruct",
    name: "LLaMA 4 Maverick 17B 128E Instruct",
    icon: "/model-logos/meta.avif",
  },

  // xAI (exclude vision)
  { id: "xai/grok-4", name: "Grok 4", icon: "/model-logos/xai.avif" },
  {
    id: "xai/grok-3-mini-beta",
    name: "Grok 3 Mini Beta",
    icon: "/model-logos/xai.avif",
  },
  { id: "xai/grok-3-beta", name: "Grok 3 Beta", icon: "/model-logos/xai.avif" },
  {
    id: "xai/grok-3-fast-beta",
    name: "Grok 3 Fast Beta",
    icon: "/model-logos/xai.avif",
  },
  { id: "xai/grok-2", name: "Grok 2", icon: "/model-logos/xai.avif" },

  // Mistral (exclude coder/vision)
  {
    id: "mistral/mistral-small",
    name: "Mistral Small",
    icon: "/model-logos/mistral.avif",
  },
  {
    id: "mistral/mistral-large",
    name: "Mistral Large",
    icon: "/model-logos/mistral.avif",
  },
  {
    id: "mistral/magistral-small-2506",
    name: "Magistral Small 2506",
    icon: "/model-logos/mistral.avif",
  },
  {
    id: "mistral/magistral-medium-2506",
    name: "Magistral Medium 2506",
    icon: "/model-logos/mistral.avif",
  },
  {
    id: "mistral/mixtral-moe-8x22b-instruct",
    name: "Mixtral MoE 8x22B Instruct",
    icon: "/model-logos/mistral.avif",
  },
  {
    id: "mistral/devstral-small",
    name: "Devstral Small",
    icon: "/model-logos/mistral.avif",
  },
  {
    id: "mistral/ministral-8b",
    name: "Ministral 8B",
    icon: "/model-logos/mistral.avif",
  },
  {
    id: "mistral/mistral-saba-24b",
    name: "Mistral Saba 24B",
    icon: "/model-logos/mistral.avif",
  },

  // Perplexity
  {
    id: "perplexity/sonar",
    name: "Sonar",
    icon: "/model-logos/perplexity.avif",
  },
  {
    id: "perplexity/sonar-pro",
    name: "Sonar Pro",
    icon: "/model-logos/perplexity.avif",
  },
  {
    id: "perplexity/sonar-reasoning-pro",
    name: "Sonar Reasoning Pro",
    icon: "/model-logos/perplexity.avif",
  },
  {
    id: "perplexity/sonar-reasoning",
    name: "Sonar Reasoning",
    icon: "/model-logos/perplexity.avif",
  },

  // Bedrock
  {
    id: "bedrock/nova-pro",
    name: "Nova Pro",
    icon: "/model-logos/bedrock.avif",
  },
  {
    id: "bedrock/nova-lite",
    name: "Nova Lite",
    icon: "/model-logos/bedrock.avif",
  },
  {
    id: "bedrock/nova-micro",
    name: "Nova Micro",
    icon: "/model-logos/bedrock.avif",
  },

  // Cohere
  {
    id: "cohere/command-a",
    name: "Command A",
    icon: "/model-logos/cohere.avif",
  },
  {
    id: "cohere/command-r-plus",
    name: "Command R+",
    icon: "/model-logos/cohere.avif",
  },
  {
    id: "cohere/command-r",
    name: "Command R",
    icon: "/model-logos/cohere.avif",
  },

  // Vercel
  {
    id: "vercel/v0-1-5-md",
    name: "Vercel v0.1.5 MD",
    icon: "/model-logos/vercel.avif",
  },
  {
    id: "vercel/v0-1-0-md",
    name: "Vercel v0.1.0 MD",
    icon: "/model-logos/vercel.avif",
  },

  // Morph
  {
    id: "morph/morph-v3-fast",
    name: "Morph V3 Fast",
    icon: "/model-logos/morph.avif",
  },
  {
    id: "morph/morph-v3-large",
    name: "Morph V3 Large",
    icon: "/model-logos/morph.avif",
  },
];
