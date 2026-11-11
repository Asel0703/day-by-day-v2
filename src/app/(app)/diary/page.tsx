"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { prettyDay, today } from "@/lib/types";
import { field } from "@/lib/ui";

type Entry = { day: string; text: string };

export default function DiaryPage() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [past, setPast] = useState<Entry[]>([]);
  const [status, setStatus] = useState("");
  const loaded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    supabase.from("diary").select("day,text").order("day", { ascending: false }).limit(30).then(({ data }) => {
      const list = (data ?? []) as Entry[];
      setText(list.find((e) => e.day === today())?.text ?? "");
      setPast(list.filter((e) => e.day !== today() && e.text.trim()));
      loaded.current = true;
    });
  }, []);

  const onChange = (v: string) => {
    setText(v);
    setStatus("Жазылуда…");
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const { error } = await supabase.from("diary").upsert({ user_id: user!.id, day: today(), text: v });
      setStatus(error ? "Сақталмады: " + error.message : "Сақталды ✓");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">Күнделік</h1>
        <span className="text-sm text-violet-400">{status}</span>
      </div>
      <textarea className={`${field} min-h-48`} placeholder="Бүгін не болды? Не үйрендің? Не үшін алғыс айтасың?" value={text} onChange={(e) => onChange(e.target.value)} />
      <p className="text-sm text-violet-400">Автоматты түрде сақталады.</p>
      {past.map((e) => (
        <article key={e.day} className="rounded-2xl bg-violet-50 p-4">
          <h3 className="mb-1 text-sm font-semibold text-violet-600">{prettyDay(e.day)}</h3>
          <p className="whitespace-pre-wrap">{e.text}</p>
        </article>
      ))}
    </div>
  );
}
