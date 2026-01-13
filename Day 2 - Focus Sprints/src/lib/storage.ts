import { SprintsSchema, type Sprint } from "../domain/sprint";


const STORAGE_KEY = "focus_sprints_v1";

export function loadSprints(): Sprint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    const res = SprintsSchema.safeParse(parsed);

    if (res.success) return res.data;

    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function saveSprints(sprints: Sprint[]) {
  const res = SprintsSchema.safeParse(sprints);

  if (!res.success) throw new Error("Attempted to save invalid sprints");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
  }


export function clearSprints() {
  localStorage.removeItem(STORAGE_KEY);
}