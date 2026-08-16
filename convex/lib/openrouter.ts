"use node";

const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

function getOpenRouterConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.OPENROUTER_BASE_URL ?? DEFAULT_BASE_URL;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured in Convex environment variables.");
  }

  return { apiKey, baseUrl };
}

export async function chatCompletion(args: {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
}): Promise<string> {
  const { apiKey, baseUrl } = getOpenRouterConfig();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: args.model,
      messages: args.messages,
      temperature: args.temperature ?? 0.4,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter request failed (${response.status}): ${errorText}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return content;
}

export function getResponseModel() {
  return process.env.RESPONSE_MODEL ?? "deepseek/deepseek-v4-flash";
}

export function getExtractionModel() {
  return process.env.EXTRACTION_MODEL ?? "deepseek/deepseek-v4-flash";
}
