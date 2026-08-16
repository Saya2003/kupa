import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { FunctionReference } from "convex/server";

import { internal } from "./_generated/api";
import { action } from "./_generated/server";
import { chatCompletion, getResponseModel } from "./lib/openrouter";

type HistoryItem = { _id: string; role: string; content: string; _creationTime: number };

const historyRef = internal.messages.history as unknown as FunctionReference<
  "query",
  "internal",
  { chatId: string },
  HistoryItem[]
>;

const insertRef = internal.messages.insert as unknown as FunctionReference<
  "mutation",
  "internal",
  { chatId: string; role: string; content: string },
  string
>;

const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end my life",
  "don't want to live",
  "no reason to live",
  "self-harm",
  "self harm",
  "hurt myself",
];

const CRISIS_RESPONSE =
  "I'm really glad you told me, and I want you to know you're not alone. I'm not a crisis service, so please reach out to someone who can truly be there right now — a trusted person, or a local helpline (in the US, call or text 988; in the UK, the Samaritans are at 116 123). You matter, and you don't have to sit with this alone.";

const SYSTEM_PROMPT = `You are Kupa, a warm, practical financial wellness companion for students and gig workers.
- Be kind, calm and short: reply in at most 3 sentences unless the user asks for detail.
- Never shame, blame or use jargon. Money is hard; you're here to make it feel lighter.
- Give practical, everyday money nudges (budgeting, tracking spending, small wins), but never present them as professional financial or medical advice.
- If the user sounds like they may be in crisis or thinking of self-harm, respond with care, don't give financial advice, and gently encourage them to reach out to a support line or trusted person.
- Keep your tone human and conversational, like a supportive friend.`;

function isCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => lower.includes(keyword));
}

export const send = action({
  args: {
    chatId: v.id("chats"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const message = args.message.trim();
    if (!message) {
      throw new Error("Message cannot be empty");
    }

    const history = await ctx.runQuery(historyRef, { chatId: args.chatId });

    let reply: string;
    try {
      reply = isCrisis(message)
        ? CRISIS_RESPONSE
        : await chatCompletion({
            model: getResponseModel(),
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...history.map((m) => ({
                role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
                content: m.content,
              })),
              { role: "user", content: message },
            ],
          });
    } catch (error) {
      console.error("Kupa conversation failed:", error);
      reply = "My connection hiccuped just then. Send that again and I'll be right with you.";
    }

    const userMessageId = await ctx.runMutation(insertRef, {
      chatId: args.chatId,
      role: "user",
      content: message,
    });
    const assistantMessageId = await ctx.runMutation(insertRef, {
      chatId: args.chatId,
      role: "assistant",
      content: reply,
    });

    return { id: assistantMessageId, userMessageId, content: reply };
  },
});
