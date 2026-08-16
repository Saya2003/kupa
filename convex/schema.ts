import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  profiles: defineTable({
    userId: v.id("users"),
    firstName: v.optional(v.string()),
    onboardingComplete: v.boolean(),
  }).index("by_user", ["userId"]),

  checkIns: defineTable({
    userId: v.id("users"),
    mood: v.string(),
    spentAmount: v.optional(v.number()),
    spentNote: v.optional(v.string()),
    worry: v.optional(v.string()),
    nudge: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  chats: defineTable({
    userId: v.id("users"),
    title: v.string(),
  }).index("by_user", ["userId"]),

  chatMessages: defineTable({
    chatId: v.id("chats"),
    userId: v.id("users"),
    role: v.string(),
    content: v.string(),
  })
    .index("by_chat", ["chatId"])
    .index("by_user", ["userId"]),
});
