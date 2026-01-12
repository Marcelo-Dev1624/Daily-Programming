import { useEffect, useState } from "react";
import { formatMMSS } from "./lib/time";
import type { Sprint } from "./types";
import { loadSprints, saveSprints } from "./lib/storage";

const SPRINT_SECONDS = 25 * 60;

export default function App() {
  const [secondsLeft, setSecondsLeft] = useState<number>(SPRINT_SECONDS);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sprints, setSprints] = useState<Sprint[]>([]);

  useEffect(() => {
    const stored = loadSprints();
    setSprints(stored);
  }, []);

  // Efecto para manejar el temporizador del sprint
  useEffect(() => {
    if (!isRunning) return;

    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        // Si ya no queda tiempo, paramos el sprint

        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    // Cleanup function para limpiar el intervalo cuando el sprint se detiene o el componente se desmonta
    return () => window.clearInterval(id);
  }, [isRunning]);

  // 2) Reaccion al llegar a 0
  useEffect(() => {
    if (secondsLeft !== 0) return;

    setIsRunning(false);
    onSprintFinished();
  }, [secondsLeft]);

  function onSprintFinished() {
    // Aquí iría la lógica para manejar el fin del sprint,
    // como guardar el sprint en el almacenamiento local
    const newSprint: Sprint = {
      id: crypto.randomUUID(),
      finishedAtISO: new Date().toISOString(),
      durationMin: 25,
    };

    setSprints((prev) => {
      const updated = [newSprint, ...prev].slice(0, 10); // Guardar solo los últimos 10 sprints
      saveSprints(updated);
      return updated;
    });
    setSecondsLeft(SPRINT_SECONDS);
  }
  

  function startSprint() {
    setIsRunning(true);
  }

  function stopSprint() {
    setIsRunning(false);
  }

  function resetSprint() {
    setIsRunning(false);
    setSecondsLeft(SPRINT_SECONDS);
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-md">
      
      {/* HEADER */}
      <h1 className="text-2xl font-bold tracking-tight">Focus Sprints</h1>
      <p className="mt-1 text-sm text-gray-500">
        Short focused work sessions with sprint history.
      </p>

      {/* TIMER */}
      <div className="mt-10 text-center">
        <div className="text-6xl font-bold tabular-nums tracking-tight text-gray-900">
          {formatMMSS(secondsLeft)}
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            onClick={startSprint}
            disabled={isRunning}
          >
            Start
          </button>

          <button
            className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            onClick={stopSprint}
            disabled={!isRunning}
          >
            Pause
          </button>

          <button
            className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800"
            onClick={resetSprint}
          >
            Reset
          </button>
        </div>

        

          
        </div>
      </div>

      {/* STATUS */}
      <div className="mt-8 rounded-xl border bg-gray-50 px-4 py-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Status</span>
          <span
            className={`font-medium ${
              isRunning ? "text-green-600" : "text-gray-600"
            }`}
          >
            {isRunning ? "Running" : "Paused"}
          </span>
        </div>
      </div>

      {/* HISTORY */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-gray-700">Sprint history</h2>

        {sprints.length === 0 ? (
          <p className="mt-2 text-sm text-gray-400">
            No sprints recorded yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {sprints.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-xl border bg-white px-4 py-2 text-sm shadow-sm"
              >
                <span className="text-gray-600">
                  {new Date(s.finishedAtISO).toLocaleString()}
                </span>
                <span className="font-medium text-gray-800">
                  {s.durationMin} min
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
);


}
