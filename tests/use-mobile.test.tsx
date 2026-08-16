// @vitest-environment jsdom

import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useIsMobile } from "../src/hooks/use-mobile";

type MediaListener = () => void;

const listeners = new Set<MediaListener>();

function setWindowWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    get: () => width,
  });
}

function installMatchMedia() {
  window.matchMedia = vi.fn((query: string) => {
    const mediaQueryList = {
      matches: window.innerWidth < 768,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (_type: string, listener: MediaListener) => {
        if (_type === "change") listeners.add(listener);
      },
      removeEventListener: (_type: string, listener: MediaListener) => {
        listeners.delete(listener);
      },
      dispatchEvent: () => false,
    };
    return mediaQueryList as unknown as MediaQueryList;
  });
}

function resizeTo(width: number) {
  act(() => {
    setWindowWidth(width);
    for (const listener of listeners) listener();
  });
}

beforeEach(() => {
  setWindowWidth(1024);
  listeners.clear();
  installMatchMedia();
});

afterEach(() => {
  cleanup();
  listeners.clear();
  vi.resetAllMocks();
});

describe("useIsMobile", () => {
  it("returns false on a desktop-width viewport", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns true on a mobile-width viewport", () => {
    setWindowWidth(500);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("reacts to a resize from desktop to mobile", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    resizeTo(500);

    expect(result.current).toBe(true);
  });

  it("reacts to a resize from mobile back to desktop", () => {
    const { result } = renderHook(() => useIsMobile());
    resizeTo(500);
    expect(result.current).toBe(true);

    resizeTo(1200);

    expect(result.current).toBe(false);
  });
});
