import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Id } from "../convex/_generated/dataModel";

import { getAuthUserId } from "@convex-dev/auth/server";

import { internal } from "../convex/_generated/api";
import { send } from "../convex/chat";
import { history, insert, list } from "../convex/messages";
import { chatCompletion } from "../convex/lib/openrouter";
import { invokeConvex } from "./helpers/invoke-convex";

vi.mock("@convex-dev/auth/server", () => ({
  getAuthUserId: vi.fn(),
}));

vi.mock("../convex/lib/openrouter", () => ({
  chatCompletion: vi.fn(),
  getExtractionModel: vi.fn(() => "mock-extraction-model"),
  getResponseModel: vi.fn(() => "mock-response-model"),
}));

const mockedGetAuthUserId = vi.mocked(getAuthUserId);
const mockedChatCompletion = vi.mocked(chatCompletion);

const USER_ID = "user1" as unknown as Id<"users">;
const CHAT_ID = "chat1" as unknown as Id<"chats">;

type MessageRow = {
  _id: string;
  chatId: string;
  userId: string;
  role: string;
  content: string;
  _creationTime: number;
};

type ChatRow = {
  _id: string;
  userId: string;
  title: string;
};

function makeDb(rows: MessageRow[], chat: ChatRow) {
  const take = vi.fn().mockResolvedValue(rows);
  const insert = vi.fn();
  const get = vi.fn().mockResolvedValue(chat);
  const query = vi.fn().mockReturnValue({
    withIndex: vi.fn().mockReturnValue({
      order: vi.fn().mockReturnValue({ take }),
    }),
  });
  return { db: { query, insert, get }, query, insert, take, get };
}

function makeCtx(db: ReturnType<typeof makeDb>["db"]) {
  return { db, auth: { tokenIdentifier: "test|user1" } };
}

beforeEach(() => {
  mockedGetAuthUserId.mockReset();
  mockedChatCompletion.mockReset();
});

describe("chatMessages.history", () => {
  it("throws when unauthenticated", async () => {
    mockedGetAuthUserId.mockResolvedValue(null);
    const { db } = makeDb([], { _id: "chat1", userId: "user1", title: "A chat" });
    await expect(
      invokeConvex<{ chatId: string }, MessageRow[]>(history, makeCtx(db), { chatId: CHAT_ID }),
    ).rejects.toThrow(/Not authenticated/);
  });

  it("throws when the chat does not belong to the user", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { db } = makeDb([], { _id: "chat1", userId: "someone-else", title: "A chat" });
    await expect(
      invokeConvex<{ chatId: string }, MessageRow[]>(history, makeCtx(db), { chatId: CHAT_ID }),
    ).rejects.toThrow(/Chat not found/);
  });

  it("returns the chat's recent messages oldest-first", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const rows: MessageRow[] = [
      {
        _id: "m2",
        chatId: "chat1",
        userId: "user1",
        role: "assistant",
        content: "hello",
        _creationTime: 2,
      },
      {
        _id: "m1",
        chatId: "chat1",
        userId: "user1",
        role: "user",
        content: "hi",
        _creationTime: 1,
      },
    ];
    const { db } = makeDb(rows, { _id: "chat1", userId: "user1", title: "A chat" });

    const result = await invokeConvex<{ chatId: string }, MessageRow[]>(history, makeCtx(db), {
      chatId: CHAT_ID,
    });

    expect(result.map((r) => r._id)).toEqual(["m1", "m2"]);
  });
});

describe("chatMessages.insert", () => {
  it("throws when unauthenticated", async () => {
    mockedGetAuthUserId.mockResolvedValue(null);
    const { db } = makeDb([], { _id: "chat1", userId: "user1", title: "A chat" });
    await expect(
      invokeConvex(insert, makeCtx(db), { chatId: CHAT_ID, role: "user", content: "hi" }),
    ).rejects.toThrow(/Not authenticated/);
  });

  it("throws when the chat does not belong to the user", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { db } = makeDb([], { _id: "chat1", userId: "someone-else", title: "A chat" });
    await expect(
      invokeConvex(insert, makeCtx(db), { chatId: CHAT_ID, role: "user", content: "hi" }),
    ).rejects.toThrow(/Chat not found/);
  });

  it("stores a message for the current user in the chat", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { db, insert: dbInsert } = makeDb([], {
      _id: "chat1",
      userId: "user1",
      title: "A chat",
    });
    dbInsert.mockResolvedValue("m1");

    const result = await invokeConvex(insert, makeCtx(db), {
      chatId: CHAT_ID,
      role: "user",
      content: "hi",
    });

    expect(result).toBe("m1");
    expect(dbInsert).toHaveBeenCalledWith("chatMessages", {
      chatId: "chat1",
      userId: "user1",
      role: "user",
      content: "hi",
    });
  });
});

describe("chatMessages.list", () => {
  it("returns an empty list when unauthenticated", async () => {
    mockedGetAuthUserId.mockResolvedValue(null);
    const { db } = makeDb([], { _id: "chat1", userId: "user1", title: "A chat" });
    const result = await invokeConvex<{ chatId: string }, unknown[]>(list, makeCtx(db), {
      chatId: CHAT_ID,
    });
    expect(result).toEqual([]);
  });

  it("returns an empty list when the chat is not the user's", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { db } = makeDb([], { _id: "chat1", userId: "someone-else", title: "A chat" });
    const result = await invokeConvex<{ chatId: string }, unknown[]>(list, makeCtx(db), {
      chatId: CHAT_ID,
    });
    expect(result).toEqual([]);
  });

  it("returns messages oldest-first without exposing userId", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const rows: MessageRow[] = [
      {
        _id: "m2",
        chatId: "chat1",
        userId: "user1",
        role: "assistant",
        content: "reply",
        _creationTime: 2,
      },
      {
        _id: "m1",
        chatId: "chat1",
        userId: "user1",
        role: "user",
        content: "hello",
        _creationTime: 1,
      },
    ];
    const { db } = makeDb(rows, { _id: "chat1", userId: "user1", title: "A chat" });

    const result = await invokeConvex<
      { chatId: string },
      Array<{ _id: string; role: string; content: string; _creationTime: number }>
    >(list, makeCtx(db), { chatId: CHAT_ID });

    expect(result).toEqual([
      { _id: "m1", role: "user", content: "hello", _creationTime: 1 },
      { _id: "m2", role: "assistant", content: "reply", _creationTime: 2 },
    ]);
  });
});

describe("chat.send", () => {
  function makeActionCtx() {
    const runQuery = vi.fn().mockResolvedValue([]);
    const runMutation = vi.fn().mockResolvedValue("m1");
    return {
      ctx: { db: null, runQuery, runMutation, auth: { tokenIdentifier: "test|user1" } },
      runQuery,
      runMutation,
    };
  }

  type ChatReply = { id: string; userMessageId: string; content: string };

  it("throws when unauthenticated", async () => {
    mockedGetAuthUserId.mockResolvedValue(null);
    const { ctx } = makeActionCtx();
    await expect(invokeConvex(send, ctx, { chatId: CHAT_ID, message: "hi" })).rejects.toThrow(
      /Not authenticated/,
    );
  });

  it("throws on an empty message", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { ctx } = makeActionCtx();
    await expect(invokeConvex(send, ctx, { chatId: CHAT_ID, message: "   " })).rejects.toThrow(
      /Message cannot be empty/,
    );
  });

  it("persists both messages and returns the model reply", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    mockedChatCompletion.mockResolvedValue("Set aside 10 dollars before lunch.");

    const { ctx, runQuery, runMutation } = makeActionCtx();
    runMutation.mockResolvedValue("m2");

    const result = await invokeConvex<{ chatId: string; message: string }, ChatReply>(send, ctx, {
      chatId: CHAT_ID,
      message: "I overspent this week.",
    });

    expect(result.content).toBe("Set aside 10 dollars before lunch.");
    expect(runQuery).toHaveBeenCalledTimes(1);
    expect(runQuery).toHaveBeenCalledWith(internal.messages.history, { chatId: "chat1" });
    expect(runMutation).toHaveBeenCalledTimes(2);
    expect(runMutation).toHaveBeenNthCalledWith(1, internal.messages.insert, {
      chatId: "chat1",
      role: "user",
      content: "I overspent this week.",
    });
    expect(runMutation).toHaveBeenNthCalledWith(2, internal.messages.insert, {
      chatId: "chat1",
      role: "assistant",
      content: "Set aside 10 dollars before lunch.",
    });

    expect(mockedChatCompletion).toHaveBeenCalledTimes(1);
    const args = mockedChatCompletion.mock.calls[0]?.[0];
    expect(args?.model).toBe("mock-response-model");
    expect(args?.messages[0]?.role).toBe("system");
    expect(args?.messages[args.messages.length - 1]).toEqual({
      role: "user",
      content: "I overspent this week.",
    });
  });

  it("includes recent history in the model context", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    mockedChatCompletion.mockResolvedValue("reply");

    const { ctx, runQuery } = makeActionCtx();
    runQuery.mockResolvedValue([
      {
        _id: "m1",
        userId: "user1",
        role: "user",
        content: "earlier",
        _creationTime: 1,
      } as MessageRow,
    ]);

    await invokeConvex<{ chatId: string; message: string }, ChatReply>(send, ctx, {
      chatId: CHAT_ID,
      message: "now",
    });

    const args = mockedChatCompletion.mock.calls[0]?.[0];
    expect(args?.messages[1]).toEqual({ role: "user", content: "earlier" });
    expect(args?.messages[2]).toEqual({ role: "user", content: "now" });
  });

  it("short-circuits on crisis keywords without calling the model", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { ctx, runMutation } = makeActionCtx();

    const result = await invokeConvex<{ chatId: string; message: string }, ChatReply>(send, ctx, {
      chatId: CHAT_ID,
      message: "I keep thinking about suicide.",
    });

    expect(mockedChatCompletion).not.toHaveBeenCalled();
    expect(result.content).toContain("988");
    expect(runMutation).toHaveBeenCalledWith(internal.messages.insert, {
      chatId: "chat1",
      role: "assistant",
      content: result.content,
    });
  });

  it("persists a graceful fallback when the model call fails", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    mockedChatCompletion.mockRejectedValue(new Error("upstream down"));
    const { ctx, runMutation } = makeActionCtx();
    runMutation.mockResolvedValue("m3");

    const result = await invokeConvex<{ chatId: string; message: string }, ChatReply>(send, ctx, {
      chatId: CHAT_ID,
      message: "hello",
    });

    expect(result.content).toContain("connection hiccuped");
    expect(runMutation).toHaveBeenNthCalledWith(2, internal.messages.insert, {
      chatId: "chat1",
      role: "assistant",
      content: result.content,
    });
  });
});
