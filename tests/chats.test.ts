import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Id } from "../convex/_generated/dataModel";

import { getAuthUserId } from "@convex-dev/auth/server";

import { create, list, remove, rename } from "../convex/chats";
import { invokeConvex } from "./helpers/invoke-convex";

vi.mock("@convex-dev/auth/server", () => ({
  getAuthUserId: vi.fn(),
}));

const mockedGetAuthUserId = vi.mocked(getAuthUserId);

const USER_ID = "user1" as unknown as Id<"users">;
const OTHER_USER_ID = "user2" as unknown as Id<"users">;
const CHAT_ID = "chat1" as unknown as Id<"chats">;

type ChatRow = { _id: string; userId: string; title: string };
type MessageRow = { _id: string; chatId: string; userId: string; role: string; content: string };

function makeDb(chat: ChatRow | null, messages: MessageRow[] = []) {
  const insert = vi.fn();
  const get = vi.fn().mockResolvedValue(chat);
  const deleteFn = vi.fn();

  const query = vi.fn().mockImplementation((table: string) => {
    const collect = vi
      .fn()
      .mockResolvedValue(
        table === "chatMessages" ? messages : chat ? [{ ...chat, _creationTime: 1 }] : [],
      );
    return {
      withIndex: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({ collect }),
        collect,
      }),
      collect,
    };
  });

  return { db: { query, insert, get, delete: deleteFn }, query, insert, get, deleteFn };
}

function makeCtx(db: ReturnType<typeof makeDb>["db"]) {
  return { db, auth: { tokenIdentifier: "test|user1" } };
}

function ownedChat(): ChatRow {
  return { _id: "chat1", userId: "user1", title: "Morning chat" };
}

beforeEach(() => {
  mockedGetAuthUserId.mockReset();
});

describe("chats.list", () => {
  it("returns an empty list when unauthenticated", async () => {
    mockedGetAuthUserId.mockResolvedValue(null);
    const { db } = makeDb(ownedChat());
    const result = await invokeConvex<Record<string, never>, unknown[]>(list, makeCtx(db), {});
    expect(result).toEqual([]);
  });

  it("returns only the user's chats with title and creation time", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { db } = makeDb(ownedChat());
    const result = await invokeConvex<Record<string, never>, Array<{ title: string }>>(
      list,
      makeCtx(db),
      {},
    );
    expect(result).toEqual([{ _id: "chat1", title: "Morning chat", _creationTime: 1 }]);
  });
});

describe("chats.create", () => {
  it("throws when unauthenticated", async () => {
    mockedGetAuthUserId.mockResolvedValue(null);
    const { db } = makeDb(null);
    await expect(invokeConvex(create, makeCtx(db), {})).rejects.toThrow(/Not authenticated/);
  });

  it("creates a chat with a default title", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { db, insert } = makeDb(null);
    insert.mockResolvedValue("chat1");

    const id = await invokeConvex(create, makeCtx(db), {});

    expect(id).toBe("chat1");
    expect(insert).toHaveBeenCalledWith("chats", { userId: "user1", title: "New chat" });
  });

  it("uses a trimmed provided title and falls back when blank", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { db, insert } = makeDb(null);
    insert.mockResolvedValue("chat1");

    await invokeConvex(create, makeCtx(db), { title: "  Groceries  " });
    expect(insert).toHaveBeenCalledWith("chats", { userId: "user1", title: "Groceries" });

    await invokeConvex(create, makeCtx(db), { title: "   " });
    expect(insert).toHaveBeenLastCalledWith("chats", { userId: "user1", title: "New chat" });
  });
});

describe("chats.rename", () => {
  it("throws when unauthenticated", async () => {
    mockedGetAuthUserId.mockResolvedValue(null);
    const { db } = makeDb(null);
    await expect(
      invokeConvex(rename, makeCtx(db), { chatId: CHAT_ID, title: "New name" }),
    ).rejects.toThrow(/Not authenticated/);
  });

  it("throws when the chat does not belong to the user", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { db } = makeDb({ _id: "chat1", userId: "user2", title: "Their chat" });
    await expect(
      invokeConvex(rename, makeCtx(db), { chatId: CHAT_ID, title: "New name" }),
    ).rejects.toThrow(/Chat not found/);
  });

  it("renames the user's chat", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { db } = makeDb(ownedChat());
    const patch = vi.fn().mockResolvedValue(null);
    const ctx = { ...makeCtx(db), db: { ...db, patch } };

    await invokeConvex(rename, ctx, { chatId: CHAT_ID, title: "  Budget day  " });

    expect(patch).toHaveBeenCalledWith("chat1", { title: "Budget day" });
  });
});

describe("chats.remove", () => {
  it("throws when unauthenticated", async () => {
    mockedGetAuthUserId.mockResolvedValue(null);
    const { db } = makeDb(null);
    await expect(invokeConvex(remove, makeCtx(db), { chatId: CHAT_ID })).rejects.toThrow(
      /Not authenticated/,
    );
  });

  it("throws when the chat does not belong to the user", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { db } = makeDb({ _id: "chat1", userId: "user2", title: "Their chat" });
    await expect(invokeConvex(remove, makeCtx(db), { chatId: CHAT_ID })).rejects.toThrow(
      /Chat not found/,
    );
  });

  it("deletes the chat and all its messages", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const messages: MessageRow[] = [
      { _id: "m1", chatId: "chat1", userId: "user1", role: "user", content: "hi" },
      { _id: "m2", chatId: "chat1", userId: "user1", role: "assistant", content: "hello" },
    ];
    const { db, deleteFn, query } = makeDb(ownedChat(), messages);

    const ctx = makeCtx(db);
    await invokeConvex(remove, ctx, { chatId: CHAT_ID });

    expect(query).toHaveBeenCalledWith("chatMessages");
    expect(deleteFn).toHaveBeenCalledTimes(3);
    expect(deleteFn).toHaveBeenCalledWith("chat1");
  });
});
