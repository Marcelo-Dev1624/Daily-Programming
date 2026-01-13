import type { Sprint } from "../domain/sprint";

type Props = {
  sprints: Sprint[];
};

export function HistoryList({ sprints }: Props) {
  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold text-gray-700">Sprint history</h2>

      {sprints.length === 0 ? (
        <p className="mt-2 text-sm text-gray-400">No sprints recorded yet.</p>
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
              <span className="font-medium text-gray-800">{s.durationMin} min</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
