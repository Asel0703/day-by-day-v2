"use client";
import { useCallback, useEffect, useState } from "react";
import MoodPicker from "@/components/MoodPicker";
import { supabase } from "@/lib/supabase";
import { MOODS, addDays, prettyDay, today } from "@/lib/types";

export default function MoodPage() {
  const [rows, setRows] = useState<{ day: string; mood: string }[]>([]);

  const load = useCallback(async () => {
    const { data } = await supabase.from("moods").select("day,mood").gte("day", addDays(today(), -13)).order("day", { ascending: false });
    setRows(data ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Көңіл күй</h1>
      <MoodPicker onChange={load} />
      <section className="space-y-2">
        <h2 className="font-semibold text-violet-700">Соңғы 14 күн</h2>
        {rows.length === 0 && <p className="text-violet-400">Әзірге жазба жоқ.</p>}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {rows.map((r) => {
            const m = MOODS.find((x) => x.key === r.mood);
            return (
              <div key={r.day} className="rounded-2xl bg-violet-50 p-3 text-center">
                <div className="text-3xl">{m?.emoji}</div>
                <div className="text-sm text-violet-500">{prettyDay(r.day)}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
