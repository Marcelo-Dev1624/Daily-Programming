import type { Sprint } from "../types";


const KEY = "focus_sprints_v1";

export function loadSprints(): Sprint[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    // Filtrado defensivo (muy buena práctica)
    return parsed.filter(
      (s): s is Sprint =>
        typeof s === "object" &&
        typeof s.id === "string" &&
        typeof s.finishedAtISO === "string" &&
        typeof s.durationMin === "number"
    );
  } catch {
    // Si el JSON está corrupto, no rompemos la app
    return [];
  }
}

export function saveSprints(sprints: Sprint[]): void {
  localStorage.setItem(KEY, JSON.stringify(sprints));
}
