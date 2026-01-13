import { TimerDisplay } from "./components/TimerDisplay";
import { Controls } from "./components/Controls";
import { HistoryList } from "./components/HistoryList";
import { useSprints } from "./hooks/useSprints";
import { useTimer } from "./hooks/useTimer";

const SPRINT_SECONDS = 25 * 60;

export default function App() {
  const { sprints, addSprint, clear } = useSprints();

  const { secondsLeft, isRunning, start, pause, reset } = useTimer(
    SPRINT_SECONDS,
    () => addSprint(25)
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">Focus Sprints</h1>
        <p className="mt-1 text-sm text-gray-500">
          Short focused work sessions with sprint history.
        </p>

        <TimerDisplay secondsLeft={secondsLeft} />

        <Controls
          isRunning={isRunning}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onAddTestSprint={() => addSprint(25)}
          onClearHistory={clear}
        />

        <HistoryList sprints={sprints} />
      </div>
    </div>
  );
}
