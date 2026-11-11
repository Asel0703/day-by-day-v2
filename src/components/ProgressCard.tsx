import { card } from "@/lib/ui";

export default function ProgressCard({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className={card}>
      <p className="text-sm text-violet-500">Бүгінгі прогресс</p>
      <p className="mt-1 text-4xl font-bold text-violet-700">{pct}%</p>
      <div className="mt-3 h-2 rounded-full bg-violet-100" role="progressbar" aria-valuenow={pct}>
        <div className="h-2 rounded-full bg-violet-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-sm text-violet-400">{done} / {total} тапсырма орындалды</p>
    </div>
  );
}
