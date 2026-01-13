type Props = {
  isRunning: boolean;
  onStart(): void;
  onPause(): void;
  onReset(): void;
  onAddTestSprint(): void;
  onClearHistory(): void;
};

export function Controls({
  isRunning,
  onStart,
  onPause,
  onReset,
  onAddTestSprint,
  onClearHistory,
}: Props) {
  return (
    <>
      <div className="mt-6 flex justify-center gap-3">
        <button
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          onClick={onStart}
          disabled={isRunning}
        >
          Start
        </button>

        <button
          className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          onClick={onPause}
          disabled={!isRunning}
        >
          Pause
        </button>

        <button
          className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800"
          onClick={onReset}
        >
          Reset
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button
          className="rounded-xl border px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
          onClick={onAddTestSprint}
        >
          + Add test sprint
        </button>

        <button
          className="rounded-xl border px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
          onClick={onClearHistory}
        >
          Clear history
        </button>
      </div>

      <div className="mt-8 rounded-xl border bg-gray-50 px-4 py-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Status</span>
          <span className={`font-medium ${isRunning ? "text-green-600" : "text-gray-600"}`}>
            {isRunning ? "Running" : "Paused"}
          </span>
        </div>
      </div>
    </>
  );
}
