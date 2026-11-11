"use client";
import { Task } from "@/lib/types";
import { useAuth } from "./AuthProvider";

type P = { t: Task; onToggle: (t: Task) => void; onRemove: (id: string) => void };

export default function TaskItem({ t, onToggle, onRemove }: P) {
  const { user } = useAuth();
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <input type="checkbox" checked={t.done} onChange={() => onToggle(t)} className="h-5 w-5 shrink-0 accent-violet-600" aria-label="Орындалды" />
      <span className={`min-w-0 flex-1 break-words ${t.done ? "text-violet-300 line-through" : ""}`}>{t.title}</span>
      {t.room_id && <span className="shrink-0 rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs text-fuchsia-700">👥 ортақ</span>}
      {t.owner_id === user?.id && (
        <button onClick={() => onRemove(t.id)} className="shrink-0 text-violet-300 hover:text-red-500" aria-label="Жою">✕</button>
      )}
    </li>
  );
}
