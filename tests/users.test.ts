import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Id } from "../convex/_generated/dataModel";

import { getAuthUserId } from "@convex-dev/auth/server";

import { completeOnboarding, current, ensureProfile } from "../convex/users";
import { invokeConvex } from "./helpers/invoke-convex";

vi.mock("@convex-dev/auth/server", () => ({
  getAuthUserId: vi.fn(),
}));

const mockedGetAuthUserId = vi.mocked(getAuthUserId);

const USER_ID = "user1" as unknown as Id<"users">;

type Row = {
  _id: string;
  userId: string;
  firstName?: string;
  onboardingComplete?: boolean;
};

function makeDb(profile: Row | null) {
  const query = vi.fn().mockReturnValue({
    withIndex: vi.fn().mockReturnValue({
      unique: vi.fn().mockResolvedValue(profile),
    }),
  });
  const insert = vi.fn();
  const patch = vi.fn();
  return {
    db: { query, insert, patch },
    query,
    insert,
    patch,
  };
}

function makeCtx(db: ReturnType<typeof makeDb>["db"]) {
  return { db, auth: { tokenIdentifier: "test|user1" } };
}

beforeEach(() => {
  mockedGetAuthUserId.mockReset();
});

describe("users.current", () => {
  it("returns null when unauthenticated", async () => {
    mockedGetAuthUserId.mockResolvedValue(null);
    const { db } = makeDb(null);
    const result = await invokeConvex<Record<string, never>, unknown>(current, makeCtx(db), {});
    expect(result).toBeNull();
  });

  it("returns the user id and profile when signed in", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const profile = {
      _id: "profile1",
      userId: "user1",
      firstName: "Ada",
      onboardingComplete: true,
    };
    const { db, query } = makeDb(profile);
    const result = await invokeConvex<Record<string, never>, unknown>(current, makeCtx(db), {});
    expect(result).toEqual({ userId: "user1", profile });
    expect(query).toHaveBeenCalledWith("profiles");
  });
});

describe("users.ensureProfile", () => {
  it("throws when unauthenticated", async () => {
    mockedGetAuthUserId.mockResolvedValue(null);
    const { db } = makeDb(null);
    await expect(invokeConvex(ensureProfile, makeCtx(db), {})).rejects.toThrow(/Not authenticated/);
  });

  it("inserts a profile when none exists", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { db, insert } = makeDb(null);
    insert.mockResolvedValue("profile2");

    const result = await invokeConvex(ensureProfile, makeCtx(db), { firstName: "Ada" });

    expect(result).toBe("profile2");
    expect(insert).toHaveBeenCalledWith("profiles", {
      userId: "user1",
      firstName: "Ada",
      onboardingComplete: false,
    });
  });

  it("backfills firstName on an existing profile lacking it", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const existing = {
      _id: "profile1",
      userId: "user1",
      onboardingComplete: false,
    };
    const { db, insert, patch } = makeDb(existing);

    const result = await invokeConvex(ensureProfile, makeCtx(db), {
      firstName: "Ada",
    });

    expect(result).toBe("profile1");
    expect(patch).toHaveBeenCalledWith("profile1", { firstName: "Ada" });
    expect(insert).not.toHaveBeenCalled();
  });

  it("does not touch an existing profile that already has a firstName", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const existing = {
      _id: "profile1",
      userId: "user1",
      firstName: "Ada",
      onboardingComplete: true,
    };
    const { db, insert, patch } = makeDb(existing);

    const result = await invokeConvex(ensureProfile, makeCtx(db), {
      firstName: "Grace",
    });

    expect(result).toBe("profile1");
    expect(patch).not.toHaveBeenCalled();
    expect(insert).not.toHaveBeenCalled();
  });
});

describe("users.completeOnboarding", () => {
  it("throws when unauthenticated", async () => {
    mockedGetAuthUserId.mockResolvedValue(null);
    const { db } = makeDb(null);
    await expect(invokeConvex(completeOnboarding, makeCtx(db), {})).rejects.toThrow(
      /Not authenticated/,
    );
  });

  it("throws when the profile is missing", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const { db } = makeDb(null);
    await expect(invokeConvex(completeOnboarding, makeCtx(db), {})).rejects.toThrow(
      /Profile not found/,
    );
  });

  it("marks the profile as onboarded", async () => {
    mockedGetAuthUserId.mockResolvedValue(USER_ID);
    const existing = {
      _id: "profile1",
      userId: "user1",
      onboardingComplete: false,
    };
    const { db, patch } = makeDb(existing);

    await invokeConvex(completeOnboarding, makeCtx(db), {});

    expect(patch).toHaveBeenCalledWith("profile1", { onboardingComplete: true });
  });
});
