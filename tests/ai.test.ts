import { beforeEach, describe, expect, it, vi } from "vitest";

import { extractCheckInInsights, generateNudge } from "../convex/ai";
import { chatCompletion } from "../convex/lib/openrouter";
import { invokeConvex } from "./helpers/invoke-convex";

vi.mock("../convex/lib/openrouter", () => ({
  chatCompletion: vi.fn(),
  getExtractionModel: vi.fn(() => "mock-extraction-model"),
  getResponseModel: vi.fn(() => "mock-response-model"),
}));

const mockedChatCompletion = vi.mocked(chatCompletion);

type CheckInArgs = { mood: string; spentNote?: string; worry?: string };

beforeEach(() => {
  mockedChatCompletion.mockReset();
});

describe("ai.extractCheckInInsights", () => {
  it("extracts structured signals from a check-in", async () => {
    mockedChatCompletion.mockResolvedValue(
      JSON.stringify({ themes: ["impulse spending", "rent"], urgency: "high" }),
    );

    const result = await invokeConvex(extractCheckInInsights, {}, {
      mood: "stressed",
      spentNote: "bought coffee",
      worry: "rent",
    } satisfies CheckInArgs);

    expect(result).toEqual({ themes: ["impulse spending", "rent"], urgency: "high" });
    expect(mockedChatCompletion).toHaveBeenCalledTimes(1);
    const args = mockedChatCompletion.mock.calls[0]?.[0];
    expect(args?.model).toBe("mock-extraction-model");
    expect(args?.temperature).toBe(0.2);
    expect(args?.messages[0]?.role).toBe("system");
    expect(args?.messages[1]?.content).toContain("stressed");
  });

  it("falls back to a safe result when the model returns invalid JSON", async () => {
    mockedChatCompletion.mockResolvedValue("definitely not json");

    const result = await invokeConvex(extractCheckInInsights, {}, {
      mood: "meh",
    } satisfies CheckInArgs);

    expect(result).toEqual({
      themes: ["general money stress"],
      urgency: "low",
    });
  });
});

describe("ai.generateNudge", () => {
  it("returns the model text and includes check-in context", async () => {
    mockedChatCompletion.mockResolvedValue("Try rounding up savings instead.");

    const result = await invokeConvex(generateNudge, {}, {
      mood: "down",
      spentNote: "big night out",
    } satisfies CheckInArgs);

    expect(result).toBe("Try rounding up savings instead.");
    const args = mockedChatCompletion.mock.calls[0]?.[0];
    expect(args?.model).toBe("mock-response-model");
    expect(args?.messages[0]?.role).toBe("system");
    const prompt = args?.messages[1]?.content as unknown as string;
    expect(prompt).toContain("Mood: down");
    expect(prompt).toContain("Spending note: big night out");
    expect(prompt).not.toContain("Worry:");
  });

  it("omits optional fields that are not provided", async () => {
    mockedChatCompletion.mockResolvedValue("nudge");

    await invokeConvex(generateNudge, {}, { mood: "good" } satisfies CheckInArgs);

    const args = mockedChatCompletion.mock.calls[0]?.[0];
    const prompt = args?.messages[1]?.content as unknown as string;
    expect(prompt).toBe("Mood: good");
  });
});
