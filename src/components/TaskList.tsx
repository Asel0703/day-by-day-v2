import { Task } from "@/lib/types";
import TaskItem from "./TaskItem";

type P = { tasks: Task[]; loading?: boolean; empty?: string; onToggle: (t: Task) => void; onRemove: (id: string) => void };

export default function TaskList({ tasks, loading, empty = "Әзірге тапсырма жоқ", onToggle, onRemove }: P) {
  if (loading) return <p className="p-4 text-violet-300">Жүктелуде…</p>;
  if (!tasks.length) return <p className="rounded-2xl border border-dashed border-violet-200 p-6 text-center text-violet-400">{empty}</p>;
  return (
    <ul className="divide-y divide-violet-100 overflow-hidden rounded-2xl border border-violet-100">
      {tasks.map((t) => <TaskItem key={t.id} t={t} onToggle={onToggle} onRemove={onRemove} />)}
    </ul>
  );
}
