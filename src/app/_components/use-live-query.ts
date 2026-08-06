"use client";

import { useEffect, useState } from "react";

/**
 * Load IndexedDB (or any async source) into React state.
 * State updates happen only after the promise settles, which keeps the
 * react-hooks/set-state-in-effect rule happy while still refreshing on deps.
 */
export function useLiveQuery<T>(
  load: () => Promise<T>,
  deps: React.DependencyList,
  initial: T,
): { data: T; loading: boolean; reload: () => void } {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void load().then((next) => {
      if (!cancelled) {
        setData(next);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
    // Caller owns the dependency list; load closes over the values it needs.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps provided by caller
  }, [...deps, tick]);

  return {
    data,
    loading,
    reload: () => {
      setLoading(true);
      setTick((n) => n + 1);
    },
  };
}
