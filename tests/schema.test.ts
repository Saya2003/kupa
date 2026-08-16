import { describe, expect, it } from "vitest";

import schema from "../convex/schema";

type TableInfo = {
  indexes: Array<{ indexDescriptor: string; fields: string[] }>;
  validator: {
    json: {
      type: string;
      value: Record<string, { fieldType: { type: string; tableName?: string }; optional: boolean }>;
    };
  };
};

const tables = (schema as unknown as { tables: Record<string, TableInfo> }).tables;

const profiles = tables["profiles"]!;
const checkIns = tables["checkIns"]!;
const chats = tables["chats"]!;
const chatMessages = tables["chatMessages"]!;
const profileFields = profiles.validator.json.value;
const checkInFields = checkIns.validator.json.value;
const chatFields = chats.validator.json.value;
const chatMessageFields = chatMessages.validator.json.value;

describe("schema", () => {
  it("includes the Convex auth tables", () => {
    for (const table of [
      "users",
      "authAccounts",
      "authSessions",
      "authRefreshTokens",
      "authVerificationCodes",
      "authRateLimits",
      "authVerifiers",
    ]) {
      expect(tables[table]).toBeDefined();
    }
  });

  it("defines the app tables", () => {
    expect(profiles).toBeDefined();
    expect(checkIns).toBeDefined();
    expect(chats).toBeDefined();
    expect(chatMessages).toBeDefined();
  });

  it("indexes profiles by user", () => {
    expect(profiles.indexes).toContainEqual({
      indexDescriptor: "by_user",
      fields: ["userId"],
    });
  });

  it("indexes checkIns by user", () => {
    expect(checkIns.indexes).toContainEqual({
      indexDescriptor: "by_user",
      fields: ["userId"],
    });
  });

  it("indexes chatMessages by chat", () => {
    expect(chatMessages.indexes).toContainEqual({
      indexDescriptor: "by_chat",
      fields: ["chatId"],
    });
  });

  it("indexes chats by user", () => {
    expect(chats.indexes).toContainEqual({
      indexDescriptor: "by_user",
      fields: ["userId"],
    });
  });

  it("shapes the chats table", () => {
    expect(chatFields["userId"]?.fieldType).toEqual({
      type: "id",
      tableName: "users",
    });
    expect(chatFields["title"]?.fieldType.type).toBe("string");
    expect(chatFields["title"]?.optional).toBe(false);
  });

  it("shapes the profiles table", () => {
    expect(profileFields["userId"]?.fieldType).toEqual({
      type: "id",
      tableName: "users",
    });
    expect(profileFields["firstName"]?.fieldType.type).toBe("string");
    expect(profileFields["firstName"]?.optional).toBe(true);
    expect(profileFields["onboardingComplete"]?.fieldType.type).toBe("boolean");
    expect(profileFields["onboardingComplete"]?.optional).toBe(false);
  });

  it("shapes the checkIns table", () => {
    expect(checkInFields["mood"]?.fieldType.type).toBe("string");
    expect(checkInFields["spentAmount"]?.fieldType.type).toBe("number");
    expect(checkInFields["spentAmount"]?.optional).toBe(true);
    expect(checkInFields["spentNote"]?.optional).toBe(true);
    expect(checkInFields["worry"]?.optional).toBe(true);
    expect(checkInFields["nudge"]?.fieldType.type).toBe("string");
  });

  it("shapes the chatMessages table", () => {
    expect(chatMessageFields["chatId"]?.fieldType).toEqual({
      type: "id",
      tableName: "chats",
    });
    expect(chatMessageFields["userId"]?.fieldType).toEqual({
      type: "id",
      tableName: "users",
    });
    expect(chatMessageFields["role"]?.fieldType.type).toBe("string");
    expect(chatMessageFields["role"]?.optional).toBe(false);
    expect(chatMessageFields["content"]?.fieldType.type).toBe("string");
    expect(chatMessageFields["content"]?.optional).toBe(false);
  });
});
