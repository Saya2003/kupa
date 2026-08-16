"use node";

import { v } from "convex/values";

import { action } from "./_generated/server";
import { chatCompletion, getExtractionModel, getResponseModel } from "./lib/openrouter";

export const extractCheckInInsights = action({
  args: {
    mood: v.string(),
    spentNote: v.optional(v.string()),
    worry: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const model = getExtractionModel();
    const content = await chatCompletion({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Extract structured money wellness signals from a daily check-in. Reply with JSON only: {\"themes\": string[], \"urgency\": \"low\"|\"medium\"|\"high\"}.",
        },
        {
          role: "user",
          content: JSON.stringify({
            mood: args.mood,
            spentNote: args.spentNote ?? "",
            worry: args.worry ?? "",
          }),
        },
      ],
    });

    try {
      return JSON.parse(content) as {
        themes: string[];
        urgency: "low" | "medium" | "high";
      };
    } catch {
      return {
        themes: ["general money stress"],
        urgency: "low" as const,
      };
    }
  },
});

export const generateNudge = action({
  args: {
    mood: v.string(),
    spentNote: v.optional(v.string()),
    worry: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const model = getResponseModel();
    return await chatCompletion({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are Kupa, a gentle financial wellness companion for students and gig workers. Write one short, kind, practical nudge (max 2 sentences). No shame, no jargon.",
        },
        {
          role: "user",
          content: [
            `Mood: ${args.mood}`,
            args.spentNote ? `Spending note: ${args.spentNote}` : null,
            args.worry ? `Worry: ${args.worry}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
    });
  },
});
