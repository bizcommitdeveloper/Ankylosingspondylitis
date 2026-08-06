"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { getEntries } from "@/lib/firestore";
import type { Entry } from "@/lib/types";

interface UseEntriesResult {
  entries: Entry[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/** Loads the signed-in user's entries (oldest first). */
export function useEntries(): UseEntriesResult {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      setEntries(await getEntries(user.uid));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your entries.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return { entries, loading, error, reload: load };
}
