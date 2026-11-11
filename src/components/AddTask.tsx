"use client";
import { useState } from "react";
import { useRooms } from "@/hooks/useRooms";
import RoomPanel from "./RoomPanel";
import { btn, field } from "@/lib/ui";

export default function AddTask({ onAdd }: { onAdd: (title: string, roomId: string | null) => Promise<void> }) {
  const api = useRooms();
  const [title, setTitle] = useState("");
  const [shared, setShared] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [busy, setBusy] = useState(false);

  const targetRoom = roomId || api.rooms[0]?.id || null;
  const canSubmit = title.trim() && !busy && (!shared || targetRoom);

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    await onAdd(title, shared ? targetRoom : null);
    setTitle("");
    setBusy(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input className={field} value={title} placeholder="Жаңа тапсырма жаз…" maxLength={200}
          onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        <button className={btn} disabled={!canSubmit} onClick={submit}>+ Қосу</button>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-violet-900">
        <input type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} className="h-5 w-5 accent-violet-600" />
        👥 Досымен бірге
      </label>
      {shared && api.rooms.length > 1 && (
        <select className={field} value={targetRoom ?? ""} onChange={(e) => setRoomId(e.target.value)}>
          {api.rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      )}
      {shared && api.rooms.length === 0 && (
        <div className="space-y-2">
          <p className="text-sm text-violet-500">Ортақ тапсырма үшін алдымен бөлме керек — құр немесе досыңның кодымен қосыл:</p>
          <RoomPanel api={api} />
        </div>
      )}
    </div>
  );
}
