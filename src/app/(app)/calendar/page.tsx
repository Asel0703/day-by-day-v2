"use client";
import { useMemo, useState } from "react";
import TaskList from "@/components/TaskList";
import { useTasks } from "@/hooks/useTasks";
import { MONTHS, WEEKDAYS, iso, prettyDay, today } from "@/lib/types";
import { btn2 } from "@/lib/ui";

export default function CalendarPage() {
  const now = new Date();
  const [y, setY] = useState(now.getFullYear());
  const [m, setM] = useState(now.getMonth());
  const [sel, setSel] = useState(today());

  const first = iso(new Date(y, m, 1));
  const last = iso(new Date(y, m + 1, 0));
  const { tasks, loading, toggle, remove } = useTasks(first, last);

  const cells = useMemo(() => {
    const offset = (new Date(y, m, 1).getDay() + 6) % 7; // апта Дүйсенбіден басталады
    const n = new Date(y, m + 1, 0).getDate();
    return [...Array(offset).fill(null), ...Array.from({ length: n }, (_, i) => iso(new Date(y, m, i + 1)))];
  }, [y, m]);

  const move = (delta: number) => {
    const d = new Date(y, m + delta, 1);
    setY(d.getFullYear()); setM(d.getMonth());
  };
  const dayTasks = tasks.filter((t) => t.day === sel);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Күнтізбе</h1>
        <div className="flex items-center gap-2">
          <button className={btn2} onClick={() => move(-1)} aria-label="Алдыңғы ай">‹</button>
          <span className="min-w-36 text-center font-medium">{MONTHS[m]} {y}</span>
          <button className={btn2} onClick={() => move(1)} aria-label="Келесі ай">›</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm sm:gap-2">
        {WEEKDAYS.map((w) => <div key={w} className="py-1 text-violet-400">{w}</div>)}
        {cells.map((c, i) => {
          if (!c) return <div key={i} />;
          const list = tasks.filter((t) => t.day === c);
          const all = list.length > 0 && list.every((t) => t.done);
          return (
            <button key={c} onClick={() => setSel(c)}
              className={`flex aspect-square flex-col items-center justify-center rounded-2xl transition ${sel === c ? "bg-violet-600 text-white" : c === today() ? "bg-violet-100 text-violet-700" : "bg-violet-50 hover:bg-violet-100"}`}>
              <span className="font-medium">{Number(c.slice(8))}</span>
              {list.length > 0 && <span className={`mt-1 h-1.5 w-1.5 rounded-full ${all ? "bg-green-400" : sel === c ? "bg-white" : "bg-fuchsia-400"}`} />}
            </button>
          );
        })}
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold text-violet-700">{sel === today() ? "Бүгін" : prettyDay(sel)}</h2>
        <TaskList tasks={dayTasks} loading={loading} empty="Бұл күнге тапсырма жоқ" onToggle={toggle} onRemove={remove} />
      </section>
    </div>
  );
}
