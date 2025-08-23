export type Model = {
  id: // Anthropic
  | "anthropic/claude-sonnet-4"
    | "anthropic/claude-3-7-sonnet"
    | "anthropic/claude-3-5-sonnet"
    | "anthropic/claude-opus-4-1"
    | "anthropic/claude-opus-4"
    | "anthropic/claude-3-5-haiku"
    | "anthropic/claude-3-haiku"
    | "anthropic/claude-3-opus"

    // OpenAI
    | "openai/gpt-5-nano"
    | "openai/gpt-5-mini"
    | "openai/gpt-5"
    | "openai/gpt-4o-mini"
    | "openai/gpt-4o"
    | "openai/gpt-4-1-mini"
    | "openai/gpt-4-1"
    | "openai/gpt-4-1-nano"
    | "openai/gpt-oss-120b"
    | "openai/gpt-oss-20b"
    | "openai/o3"
    | "openai/o4-mini"
    | "openai/gpt-3-5-turbo"
    | "openai/o3-mini"
    | "openai/gpt-4-turbo"
    | "openai/o1"

    // Google
    | "google/gemini-2-0-flash"
    | "google/gemini-2-5-flash"
    | "google/gemini-2-5-pro"
    | "google/gemini-2-5-flash-lite"
    | "google/gemini-2-0-flash-lite"
    | "google/gemma-2-9b-it"

    // DeepSeek
    | "deepseek/deepseek-r1"
    | "deepseek/deepseek-v3-1"
    | "deepseek/deepseek-v3-0324"
    | "deepseek/deepseek-v3-1-thinking"
    | "deepseek/deepseek-v3-1-base"
    | "deepseek/deepseek-r1-distill-llama-70b"

    // Alibaba
    | "alibaba/qwen3-coder"
    | "alibaba/qwen3-32b"
    | "alibaba/qwen3-235b-a22b-instruct-2507"
    | "alibaba/qwen3-30b-a3b"
    | "alibaba/qwen3-14b"

    // Moonshot
    | "moonshot/kimi-k2"

    // ZhipuAI
    | "zai/glm-4-5"
    | "zai/glm-4-5-air"
    | "zai/glm-4-5v"

    // Meta
    | "meta/llama-3-3-70b"
    | "meta/llama-3-2-90b-vision-instruct"
    | "meta/llama-3-2-3b-instruct"
    | "meta/llama-3-2-1b-instruct"
    | "meta/llama-3-1-70b-instruct"
    | "meta/llama-4-scout"
    | "meta/llama-4-maverick-17b-128e-instruct"

    // xAI
    | "xai/grok-4"
    | "xai/grok-3-mini-beta"
    | "xai/grok-3-beta"
    | "xai/grok-3-fast-beta"
    | "xai/grok-2"
    | "xai/grok-2-vision"

    // Mistral
    | "mistral/mistral-codestral-25-01"
    | "mistral/mistral-small"
    | "mistral/mistral-large"
    | "mistral/magistral-small-2506"
    | "mistral/magistral-medium-2506"
    | "mistral/pixtral-12b-2409"
    | "mistral/pixtral-large"
    | "mistral/mixtral-moe-8x22b-instruct"
    | "mistral/devstral-small"
    | "mistral/ministral-8b"
    | "mistral/mistral-saba-24b"

    // Perplexity
    | "perplexity/sonar"
    | "perplexity/sonar-pro"
    | "perplexity/sonar-reasoning-pro"
    | "perplexity/sonar-reasoning"

    // Bedrock
    | "bedrock/nova-pro"
    | "bedrock/nova-lite"
    | "bedrock/nova-micro"

    // Cohere
    | "cohere/command-a"
    | "cohere/command-r-plus"
    | "cohere/command-r"

    // Vercel
    | "vercel/v0-1-5-md"
    | "vercel/v0-1-0-md"

    // Inception
    | "inception/mercury-coder-small-beta"

    // Morph
    | "morph/morph-v3-fast"
    | "morph/morph-v3-large";

  name: // Anthropic
  | "Claude 4 Sonnet"
    | "Claude 3.7 Sonnet"
    | "Claude 3.5 Sonnet"
    | "Claude 4.1 Opus"
    | "Claude 4 Opus"
    | "Claude 3.5 Haiku"
    | "Claude 3 Haiku"
    | "Claude 3 Opus"

    // OpenAI
    | "GPT-5 Nano"
    | "GPT-5 Mini"
    | "GPT-5"
    | "GPT-4o Mini"
    | "GPT-4o"
    | "GPT-4.1 Mini"
    | "GPT-4.1"
    | "GPT-4.1 Nano"
    | "GPT-OSS 120B"
    | "GPT-OSS 20B"
    | "O3"
    | "O4 Mini"
    | "GPT-3.5 Turbo"
    | "O3 Mini"
    | "GPT-4 Turbo"
    | "O1"

    // Google
    | "Gemini 2.0 Flash"
    | "Gemini 2.5 Flash"
    | "Gemini 2.5 Pro"
    | "Gemini 2.5 Flash Lite"
    | "Gemini 2.0 Flash Lite"
    | "Gemma 2 9B IT"

    // DeepSeek
    | "DeepSeek R1"
    | "DeepSeek V3.1"
    | "DeepSeek V3 0324"
    | "DeepSeek V3.1 Thinking"
    | "DeepSeek V3.1 Base"
    | "DeepSeek R1 Distill LLaMA 70B"

    // Alibaba
    | "Qwen3 Coder"
    | "Qwen3 32B"
    | "Qwen3 235B A22B Instruct 2507"
    | "Qwen3 30B A3B"
    | "Qwen3 14B"

    // Moonshot
    | "Kimi K2"

    // ZhipuAI
    | "GLM 4.5"
    | "GLM 4.5 Air"
    | "GLM 4.5V"

    // Meta
    | "LLaMA 3.3 70B"
    | "LLaMA 3.2 90B Vision Instruct"
    | "LLaMA 3.2 3B Instruct"
    | "LLaMA 3.2 1B Instruct"
    | "LLaMA 3.1 70B Instruct"
    | "LLaMA 4 Scout"
    | "LLaMA 4 Maverick 17B 128E Instruct"

    // xAI
    | "Grok 4"
    | "Grok 3 Mini Beta"
    | "Grok 3 Beta"
    | "Grok 3 Fast Beta"
    | "Grok 2"
    | "Grok 2 Vision"

    // Mistral
    | "Mistral Codestral 25.01"
    | "Mistral Small"
    | "Mistral Large"
    | "Magistral Small 2506"
    | "Magistral Medium 2506"
    | "Pixtral 12B 2409"
    | "Pixtral Large"
    | "Mixtral MoE 8x22B Instruct"
    | "Devstral Small"
    | "Ministral 8B"
    | "Mistral Saba 24B"

    // Perplexity
    | "Sonar"
    | "Sonar Pro"
    | "Sonar Reasoning Pro"
    | "Sonar Reasoning"

    // Bedrock
    | "Nova Pro"
    | "Nova Lite"
    | "Nova Micro"

    // Cohere
    | "Command A"
    | "Command R+"
    | "Command R"

    // Vercel
    | "Vercel v0.1.5 MD"
    | "Vercel v0.1.0 MD"

    // Inception
    | "Mercury Coder Small Beta"

    // Morph
    | "Morph V3 Fast"
    | "Morph V3 Large";

  icon:
    | "/model-logos/anthropic.avif"
    | "/model-logos/openai.avif"
    | "/model-logos/google.avif"
    | "/model-logos/deepseek.avif"
    | "/model-logos/alibaba.avif"
    | "/model-logos/moonshotai.avif"
    | "/model-logos/zai.avif"
    | "/model-logos/meta.avif"
    | "/model-logos/xai.avif"
    | "/model-logos/mistral.avif"
    | "/model-logos/perplexity.avif"
    | "/model-logos/bedrock.avif"
    | "/model-logos/cohere.avif"
    | "/model-logos/vercel.avif"
    | "/model-logos/inception.avif"
    | "/model-logos/morph.avif";
};
