import { describe, expect, it } from "vitest";

import { cn } from "../src/lib/utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("handles conditional object syntax", () => {
    expect(cn({ foo: true, bar: false }, "baz")).toBe("foo baz");
  });

  it("merges tailwind conflicts so the later class wins", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("returns an empty string when nothing is passed", () => {
    expect(cn()).toBe("");
  });
});
