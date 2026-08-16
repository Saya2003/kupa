import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("checkIns")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(30);
  },
});

export const submit = action({
  args: {
    mood: v.string(),
    spentAmount: v.optional(v.number()),
    spentNote: v.optional(v.string()),
    worry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const nudge = await ctx.runAction(api.ai.generateNudge, {
      mood: args.mood,
      spentNote: args.spentNote,
      worry: args.worry,
    });

    const checkInId = await ctx.runMutation(api.checkins.save, {
      mood: args.mood,
      spentAmount: args.spentAmount,
      spentNote: args.spentNote,
      worry: args.worry,
      nudge,
    });

    return { checkInId, nudge };
  },
});

export const save = mutation({
  args: {
    mood: v.string(),
    spentAmount: v.optional(v.number()),
    spentNote: v.optional(v.string()),
    worry: v.optional(v.string()),
    nudge: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("checkIns", {
      userId,
      mood: args.mood,
      spentAmount: args.spentAmount,
      spentNote: args.spentNote,
      worry: args.worry,
      nudge: args.nudge,
    });
  },
});
