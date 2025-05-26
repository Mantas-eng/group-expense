import { useState, useEffect, useCallback } from "react";
import { fetchGroups } from "../services/api";
import { Group } from "../types";

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchGroups();
      setGroups(res.data);
      console.log("Groups loaded:", res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Error loading groups:", err.message);
      } else {
        setError("Could not load groups");
        console.error("Unknown error loading groups:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { groups, loading, error, reload };
}
