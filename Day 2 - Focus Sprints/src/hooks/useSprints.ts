import { useState } from "react";
import type { Sprint } from "../domain/sprint";
import { clearSprints,loadSprints,saveSprints } from "../lib/storage";

const MAX_SPRINTS = 10;

export function useSprints() {
    const [sprints, setSprints] = useState<Sprint[]>(() => loadSprints());

    function addSprint(durationMin: number) {
    const newSprint: Sprint = {
      id: crypto.randomUUID(),
      finishedAtISO: new Date().toISOString(),
      durationMin,
    };

    setSprints((prev) => {
      const updated = [newSprint, ...prev].slice(0, MAX_SPRINTS);
      saveSprints(updated);
      return updated;
    });
  }

  function clear(){
    clearSprints();
    setSprints([]);
  }

  return { sprints, addSprint, clear };

  }