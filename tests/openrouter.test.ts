import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { chatCompletion, getExtractionModel, getResponseModel } from "../convex/lib/openrouter";

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  process.env["OPENROUTER_API_KEY"] = "test-key";
  process.env["OPENROUTER_BASE_URL"] = "https://example.openrouter.local";
});

afterEach(() => {
  delete process.env["OPENROUTER_API_KEY"];
  delete process.env["OPENROUTER_BASE_URL"];
  delete process.env["EXTRACTION_MODEL"];
  delete process.env["RESPONSE_MODEL"];
  vi.unstubAllGlobals();
});

function okResponse(content: string) {
  return {
    ok: true,
    status: 200,
    text: async () => "",
    json: async () => ({ choices: [{ message: { content } }] }),
  };
}

describe("chatCompletion", () => {
  it("throws when OPENROUTER_API_KEY is missing", async () => {
    delete process.env["OPENROUTER_API_KEY"];
    await expect(
      chatCompletion({ model: "m", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toThrow(/OPENROUTER_API_KEY/);
  });

  it("posts to the chat completions endpoint with auth headers", async () => {
    fetchMock.mockResolvedValue(okResponse("Hello"));
    const content = await chatCompletion({
      model: "model-x",
      messages: [{ role: "user", content: "hi" }],
    });

    expect(content).toBe("Hello");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://example.openrouter.local/chat/completions");
    expect(init.method).toBe("POST");
    expect(Object(init.headers).Authorization).toBe("Bearer test-key");
    expect(Object(init.headers)["Content-Type"]).toBe("application/json");
    const body = JSON.parse(String(init.body));
    expect(body.model).toBe("model-x");
    expect(body.messages).toEqual([{ role: "user", content: "hi" }]);
  });

  it("defaults temperature to 0.4", async () => {
    fetchMock.mockResolvedValue(okResponse("ok"));
    await chatCompletion({ model: "m", messages: [] });
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(init.body)).temperature).toBe(0.4);
  });

  it("honours a custom temperature", async () => {
    fetchMock.mockResolvedValue(okResponse("ok"));
    await chatCompletion({ model: "m", messages: [], temperature: 0.8 });
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(init.body)).temperature).toBe(0.8);
  });

  it("falls back to the default base URL when unset", async () => {
    delete process.env["OPENROUTER_BASE_URL"];
    fetchMock.mockResolvedValue(okResponse("ok"));
    await chatCompletion({ model: "m", messages: [] });
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
  });

  it("trims the returned content", async () => {
    fetchMock.mockResolvedValue(okResponse("  some nudge  \n"));
    await expect(chatCompletion({ model: "m", messages: [] })).resolves.toBe("some nudge");
  });

  it("throws when the upstream request fails", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => "rate limited",
    });
    await expect(chatCompletion({ model: "m", messages: [] })).rejects.toThrow(/429.*rate limited/);
  });

  it("throws when the response has no content", async () => {
    fetchMock.mockResolvedValue(okResponse(""));
    await expect(chatCompletion({ model: "m", messages: [] })).rejects.toThrow(/empty response/);
  });
});

describe("model getters", () => {
  it("returns the configured response model", () => {
    process.env["RESPONSE_MODEL"] = "custom/response";
    expect(getResponseModel()).toBe("custom/response");
  });

  it("defaults the response model", () => {
    expect(getResponseModel()).toBe("deepseek/deepseek-v4-flash");
  });

  it("returns the configured extraction model", () => {
    process.env["EXTRACTION_MODEL"] = "custom/extract";
    expect(getExtractionModel()).toBe("custom/extract");
  });

  it("defaults the extraction model", () => {
    expect(getExtractionModel()).toBe("deepseek/deepseek-v4-flash");
  });
});
