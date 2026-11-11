"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MOODS, today } from "@/lib/types";
import { card } from "@/lib/ui";
import { useAuth } from "./AuthProvider";

export default function MoodPicker({ onChange }: { onChange?: () => void }) {
  const { user } = useAuth();
  const [mood, setMood] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("moods").select("mood").eq("day", today()).maybeSingle().then(({ data }) => setMood(data?.mood ?? null));
  }, [user]);

  const pick = async (key: string) => {
    setMood(key);
    await supabase.from("moods").upsert({ user_id: user!.id, day: today(), mood: key });
    onChange?.();
  };

  return (
    <div className={card}>
      <p className="text-sm text-violet-500">Бүгінгі көңіл күй</p>
      <div className="mt-3 flex gap-2">
        {MOODS.map((m) => (
          <button key={m.key} onClick={() => pick(m.key)} title={m.label} aria-label={m.label}
            className={`rounded-xl px-3 py-2 text-2xl transition active:scale-90 ${mood === m.key ? "bg-violet-600 shadow" : "bg-white hover:bg-violet-100"}`}>
            {m.emoji}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm font-medium text-violet-800">{MOODS.find((m) => m.key === mood)?.label ?? "Қалай сезінесің?"}</p>
    </div>
  );
}
