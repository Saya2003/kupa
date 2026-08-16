import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Id } from "../convex/_generated/dataModel";

import { getAuthUserId } from "@convex-dev/auth/server";

import { api } from "../convex/_generated/api";
import { listMine, save, submit } from "../convex/checkins";
import { invokeConvex } from "./helpers/invoke-convex";

vi.mock("@convex-dev/auth/server", () => ({
  getAuthUserId: vi.fn(),
}));

const mockedGetAuthUserId = vi.mocked(getAuthUserId);

const USER_ID = "user1" as unknown as Id<"users">;

type CheckInRow = {
  _id: string;
  userId: string;
  mood: string;
  nudge?: string;
};

function makeDb(rows: CheckInRow[]) {
  const take = vi.fn().mockResolvedValue(rows);
  const insert = vi.fn();
  const query = vi.fn().mockReturnValue({
    withIndex: vi.fn().mockReturnValue({
      order: vi.fn().mockReturnValue({ take }),
    }),
  });
  return { db: { query, insert }, query, insert, take };
}

function makeCtx(db: ReturnType<typeof makeDb>["db"]) {
  return { db, auth: { tokenIdentifier: "test|user1" } };
}

beforeEach(() => {
  mockedGetAuthUserId.mockReset();
});

describe("checkIns.listMine", () => {
  it("returns an empty list when unauthenticated", async () => {
    mockedGetAuthUserId.mockResolvedValue(null);
    const { db } = makeDb([]);
    const result = await invokeConvex<Record<string, never>, unknown>(listMine, makeCtx(db), {});
    expect(result).toEqual([]);
  });

  it("returns the current user's check-ins, newest first", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const rows: CheckInRow[] = [
      { _id: "c1", userId: "user1", mood: "ok" },
      { _id: "c2", userId: "user1", mood: "great" },
    ];
    const { db, query } = makeDb(rows);

    const result = await invokeConvex<Record<string, never>, unknown>(listMine, makeCtx(db), {});

    expect(result).toEqual(rows);
    expect(query).toHaveBeenCalledWith("checkIns");
  });
});

describe("checkIns.save", () => {
  it("throws when unauthenticated", async () => {
    mockedGetAuthUserId.mockResolvedValue(null);
    const { db } = makeDb([]);
    await expect(
      invokeConvex(save, makeCtx(db), {
        mood: "ok",
        nudge: "keep going",
      }),
    ).rejects.toThrow(/Not authenticated/);
  });

  it("stores the check-in with the nudge", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { db, insert } = makeDb([]);
    insert.mockResolvedValue("checkIn1");

    const result = await invokeConvex(save, makeCtx(db), {
      mood: "ok",
      spentAmount: 12,
      spentNote: "lunch",
      worry: "groceries",
      nudge: "You've got this",
    });

    expect(result).toBe("checkIn1");
    expect(insert).toHaveBeenCalledWith("checkIns", {
      userId: "user1",
      mood: "ok",
      spentAmount: 12,
      spentNote: "lunch",
      worry: "groceries",
      nudge: "You've got this",
    });
  });
});

describe("checkIns.submit", () => {
  it("throws when unauthenticated", async () => {
    mockedGetAuthUserId.mockResolvedValue(null);
    const ctx = {
      db: null,
      runAction: vi.fn(),
      runMutation: vi.fn(),
      auth: { tokenIdentifier: null },
    };
    await expect(invokeConvex(submit, ctx, { mood: "ok" })).rejects.toThrow(/Not authenticated/);
  });

  it("generates a nudge and persists the check-in", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const runAction = vi.fn().mockResolvedValue("Gentle nudge text");
    const runMutation = vi.fn().mockResolvedValue("checkIn1");
    const ctx = {
      db: null,
      runAction,
      runMutation,
      auth: { tokenIdentifier: "test|user1" },
    };

    const result = await invokeConvex(submit, ctx, {
      mood: "stressed",
      spentNote: "went over budget",
      worry: "rent",
    });

    expect(result).toEqual({ checkInId: "checkIn1", nudge: "Gentle nudge text" });
    expect(runAction).toHaveBeenCalledWith(api.ai.generateNudge, {
      mood: "stressed",
      spentNote: "went over budget",
      worry: "rent",
    });
    expect(runMutation).toHaveBeenCalledWith(api.checkins.save, {
      mood: "stressed",
      spentNote: "went over budget",
      worry: "rent",
      nudge: "Gentle nudge text",
    });
  });
});
