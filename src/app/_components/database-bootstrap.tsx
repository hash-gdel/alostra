"use client";

import { useEffect, useState } from "react";
import { seedIfEmpty } from "@/lib/db/seed";

/**
 * Opens IndexedDB and seeds sample data when the library is completely empty.
 * Children wait until that first pass finishes so Home/Library do not flash empty.
 */
export function DatabaseBootstrap({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    seedIfEmpty()
      .catch(() => {
        /* Seed failures should not block the shell; pages handle empty states. */
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-gutter">
        <p className="text-sm text-muted-foreground">Opening your library…</p>
      </div>
    );
  }

  return children;
}
