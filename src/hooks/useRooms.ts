"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Room } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";

export function useRooms() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.from("room_members").select("rooms(id,name,code)");
    if (error) return setError(error.message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setRooms((data ?? []).map((r: any) => r.rooms).filter(Boolean));
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const create = async (name: string) => {
    setError(null);
    const { error } = await supabase.rpc("create_room", { room_name: name.trim() || "Біздің бөлме" });
    if (error) setError(error.message); else load();
  };
  const join = async (code: string) => {
    setError(null);
    const { error } = await supabase.rpc("join_room", { room_code: code });
    if (error) setError(error.message); else load();
  };
  const leave = async (roomId: string) => {
    await supabase.from("room_members").delete().eq("room_id", roomId).eq("user_id", user!.id);
    load();
  };

  return { rooms, error, create, join, leave };
}
