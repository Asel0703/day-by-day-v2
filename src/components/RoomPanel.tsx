"use client";
import { useState } from "react";
import { useRooms } from "@/hooks/useRooms";
import { btn, btn2, card, errBox, field } from "@/lib/ui";

export default function RoomPanel({ api }: { api: ReturnType<typeof useRooms> }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  return (
    <div className={`${card} space-y-4`}>
      <h3 className="font-semibold text-violet-900">👥 Достармен бөлмелер</h3>
      {api.rooms.map((r) => (
        <div key={r.id} className="flex flex-wrap items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm">
          <b>{r.name}</b>
          <span className="rounded-lg bg-violet-100 px-2 py-1 tracking-widest text-violet-700">{r.code}</span>
          <button onClick={() => navigator.clipboard?.writeText(r.code)} className="text-violet-500 underline">көшіру</button>
          <button onClick={() => confirm("Бөлмеден шығасың ба?") && api.leave(r.id)} className="ml-auto text-violet-300 hover:text-red-500">шығу</button>
        </div>
      ))}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input className={field} placeholder="Жаңа бөлме атауы" value={name} onChange={(e) => setName(e.target.value)} />
        <button className={btn} onClick={() => { api.create(name); setName(""); }}>Құру</button>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input className={field} placeholder="Досыңның коды" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        <button className={btn2} disabled={!code.trim()} onClick={() => { api.join(code); setCode(""); }}>Қосылу</button>
      </div>
      {api.error && <p className={errBox}>{api.error}</p>}
    </div>
  );
}
