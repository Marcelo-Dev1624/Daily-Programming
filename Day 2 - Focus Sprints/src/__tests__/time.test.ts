import { describe, it, expect } from "vitest";
import { formatMMSS } from "../lib/time";

describe("formatMMSS", () => {
  it("formats 65 seconds as 01:05", () => {
    expect(formatMMSS(65)).toBe("01:05");
  });
});
