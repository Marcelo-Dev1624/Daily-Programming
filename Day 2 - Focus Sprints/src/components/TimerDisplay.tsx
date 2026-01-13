import { formatMMSS } from "../lib/time";

type Props = {
  secondsLeft: number;
};

export function TimerDisplay({ secondsLeft }: Props) {
  return (
    <div className="mt-10 text-center">
      <div className="text-6xl font-bold tabular-nums tracking-tight text-gray-900">
        {formatMMSS(secondsLeft)}
      </div>
    </div>
  );
}
