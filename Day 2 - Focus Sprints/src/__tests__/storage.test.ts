import { describe, expect, it, beforeEach } from "vitest";
import { loadSprints, saveSprints, clearSprints } from "../lib/storage";
import type { Sprint } from "../domain/sprint";

const KEY = "focus_sprints_v1";

describe("storage (sprints)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns [] when nothing saved", () => {
    expect(loadSprints()).toEqual([]);
  });

  it("saves and loads valid sprints", () => {
    const sprints: Sprint[] = [
      {
        id: "abc",
        durationMin: 25,
        finishedAtISO: new Date("2026-01-01T10:00:00.000Z").toISOString(),
      },
    ];

    saveSprints(sprints);
    expect(loadSprints()).toEqual(sprints);
  });

  it("cleans up invalid JSON and returns []", () => {
    localStorage.setItem(KEY, "{not valid json");
    expect(loadSprints()).toEqual([]);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("cleans up invalid shape and returns []", () => {
    localStorage.setItem(KEY, JSON.stringify([{ id: 123, durationMin: "25" }]));
    expect(loadSprints()).toEqual([]);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("saveSprints throws if trying to save invalid data", () => {
    // @ts-expect-error intentionally invalid
    expect(() =>
      saveSprints([{ id: "", durationMin: 0, finishedAtISO: "x" }])
    ).toThrow();
  });

  it("clearSprints removes key", () => {
    localStorage.setItem(KEY, JSON.stringify([]));
    clearSprints();
    expect(localStorage.getItem(KEY)).toBeNull();
  });
});
