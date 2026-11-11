"use client";
import { useMemo, useState } from "react";
import TaskList from "@/components/TaskList";
import { useTasks } from "@/hooks/useTasks";
import { addDays, prettyDay, today } from "@/lib/types";
import { errBox } from "@/lib/ui";

const FILTERS = [["all", "Барлығы"], ["open", "Орындалмаған"], ["done", "Орындалған"], ["shared", "👥 Ортақ"]] as const;

export default function TasksPage() {
  const d = today();
  const { tasks, loading, error, toggle, remove } = useTasks(addDays(d, -30), addDays(d, 30));
  const [f, setF] = useState<(typeof FILTERS)[number][0]>("all");

  const groups = useMemo(() => {
    const list = tasks.filter((t) => f === "all" || (f === "open" && !t.done) || (f === "done" && t.done) || (f === "shared" && t.room_id));
    const map = new Map<string, typeof list>();
    list.forEach((t) => map.set(t.day, [...(map.get(t.day) ?? []), t]));
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [tasks, f]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Тапсырмалар</h1>
      <p className="text-sm text-violet-400">Жаңа тапсырманы Басты беттен қосасың. Мұнда соңғы 30 күн мен келесі 30 күн көрінеді.</p>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(([k, label]) => (
          <button key={k} onClick={() => setF(k)}
            className={`rounded-full px-4 py-2 text-sm transition ${f === k ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-600 hover:bg-violet-100"}`}>{label}</button>
        ))}
      </div>
      {error && <p className={errBox}>{error}</p>}
      {loading ? <p className="text-violet-300">Жүктелуде…</p> : groups.length === 0 ? (
        <TaskList tasks={[]} empty="Бұл сүзгі бойынша тапсырма жоқ" onToggle={toggle} onRemove={remove} />
      ) : groups.map(([day, list]) => (
        <section key={day} className="space-y-2">
          <h2 className="font-semibold text-violet-700">{day === d ? "Бүгін" : prettyDay(day)}</h2>
          <TaskList tasks={list} onToggle={toggle} onRemove={remove} />
        </section>
      ))}
    </div>
  );
}
