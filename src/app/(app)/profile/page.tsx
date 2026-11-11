"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import RoomPanel from "@/components/RoomPanel";
import { useRooms } from "@/hooks/useRooms";
import { supabase } from "@/lib/supabase";
import { btn, btn2, card, field } from "@/lib/ui";

export default function ProfilePage() {
  const { user, name } = useAuth();
  const api = useRooms();
  const [n, setN] = useState(name);
  const [msg, setMsg] = useState("");

  const save = async () => {
    const { error } = await supabase.auth.updateUser({ data: { name: n.trim() } });
    setMsg(error ? error.message : "Сақталды ✓");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-violet-100 text-2xl font-bold text-violet-700">{name.charAt(0).toUpperCase()}</div>
        <div><h1 className="text-2xl font-bold">{name}</h1><p className="text-violet-400">{user?.email}</p></div>
      </div>

      <section className={`${card} space-y-3`}>
        <h2 className="font-semibold text-violet-800">Атыңды өзгерту</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input className={field} value={n} onChange={(e) => setN(e.target.value)} />
          <button className={btn} disabled={!n.trim()} onClick={save}>Сақтау</button>
        </div>
        {msg && <p className="text-sm text-violet-500">{msg}</p>}
      </section>

      <RoomPanel api={api} />
      <button className={btn2} onClick={() => supabase.auth.signOut()}>Шығу</button>
    </div>
  );
}
