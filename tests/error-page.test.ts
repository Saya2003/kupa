import { describe, expect, it } from "vitest";

import { renderErrorPage } from "../src/lib/error-page";

describe("renderErrorPage", () => {
  it("returns a complete HTML document", () => {
    const page = renderErrorPage();
    expect(page.startsWith("<!doctype html>")).toBe(true);
    expect(page).toContain("<html");
    expect(page).toContain("</html>");
  });

  it("communicates the failure to the user", () => {
    const page = renderErrorPage();
    expect(page).toContain("This page didn't load");
    expect(page).toContain("Something went wrong on our end");
  });

  it("offers recovery actions", () => {
    const page = renderErrorPage();
    expect(page).toContain("Try again");
    expect(page).toContain("Go home");
    expect(page).toContain('href="/"');
  });
});
