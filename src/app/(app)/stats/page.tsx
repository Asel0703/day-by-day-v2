"use client";
import { useEffect, useMemo, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { supabase } from "@/lib/supabase";
import { MOODS, WEEKDAYS, addDays, today } from "@/lib/types";
import { card } from "@/lib/ui";

export default function StatsPage() {
  const d = today();
  const { tasks, loading } = useTasks(addDays(d, -59), d);
  const [moods, setMoods] = useState<string[]>([]);

  useEffect(() => {
    supabase.from("moods").select("mood").gte("day", addDays(d, -29)).then(({ data }) => setMoods((data ?? []).map((x) => x.mood)));
  }, [d]);

  const s = useMemo(() => {
    const doneDays = new Set(tasks.filter((t) => t.done).map((t) => t.day));
    let streak = 0, cur = doneDays.has(d) ? d : addDays(d, -1);
    while (doneDays.has(cur)) { streak++; cur = addDays(cur, -1); }
    const week = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(d, i - 6);
      const l = tasks.filter((t) => t.day === day);
      return { day, label: WEEKDAYS[(new Date(day + "T00:00:00").getDay() + 6) % 7], pct: l.length ? Math.round((l.filter((t) => t.done).length / l.length) * 100) : 0, n: l.length };
    });
    return { streak, week, total: tasks.filter((t) => t.done).length };
  }, [tasks, d]);

  if (loading) return <p className="text-violet-300">Жүктелуде…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Статистика</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={card}><p className="text-sm text-violet-500">Қатарынан белсенді күн</p><p className="text-4xl font-bold text-violet-700">🔥 {s.streak}</p></div>
        <div className={card}><p className="text-sm text-violet-500">Соңғы 60 күнде орындалған</p><p className="text-4xl font-bold text-violet-700">{s.total}</p></div>
      </div>

      <section className={card}>
        <h2 className="mb-4 font-semibold text-violet-800">Соңғы 7 күн (орындалу %)</h2>
        <div className="flex h-40 items-end gap-2">
          {s.week.map((w) => (
            <div key={w.day} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs text-violet-400">{w.n ? w.pct + "%" : "–"}</span>
              <div className="flex w-full flex-1 items-end rounded-xl bg-white">
                <div className="w-full rounded-xl bg-gradient-to-t from-violet-600 to-fuchsia-400 transition-all" style={{ height: `${w.pct}%` }} />
              </div>
              <span className="text-xs text-violet-500">{w.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={card}>
        <h2 className="mb-3 font-semibold text-violet-800">Көңіл күй (30 күн)</h2>
        <div className="flex flex-wrap gap-4">
          {MOODS.map((m) => <div key={m.key} className="text-center"><div className="text-3xl">{m.emoji}</div><div className="text-sm text-violet-600">{moods.filter((x) => x === m.key).length}</div></div>)}
        </div>
      </section>
    </div>
  );
}
