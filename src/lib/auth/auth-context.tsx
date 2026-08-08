"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type AuthContextValue = {
  ready: boolean;
  configured: boolean;
  user: User | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  const [ready, setReady] = useState(!configured);
  const [user, setUser] = useState<User | null>(null);

  const applyUser = useCallback((next: User | null) => {
    setUser(next);
    setReady(true);
  }, []);

  const refreshSession = useCallback(async () => {
    if (!configured) {
      applyUser(null);
      return;
    }
    const client = createClient();
    const { data } = await client.auth.getUser();
    applyUser(data.user);
  }, [applyUser, configured]);

  useEffect(() => {
    if (!configured) return;

    let cancelled = false;
    const client = createClient();

    void client.auth.getUser().then(({ data }) => {
      if (!cancelled) applyUser(data.user);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) applyUser(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [applyUser, configured]);

  const signOut = useCallback(async () => {
    if (configured) {
      const client = createClient();
      await client.auth.signOut();
    }
    setUser(null);
  }, [configured]);

  const value = useMemo(
    () => ({
      ready,
      configured,
      user,
      signOut,
      refreshSession,
    }),
    [ready, configured, user, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
