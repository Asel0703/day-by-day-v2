"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Ctx = { user: User | null; name: string; loading: boolean };
const AuthCtx = createContext<Ctx>({ user: null, name: "", loading: true });
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const name = (user?.user_metadata?.name as string) || user?.email?.split("@")[0] || "";
  return <AuthCtx.Provider value={{ user, name, loading }}>{children}</AuthCtx.Provider>;
}
