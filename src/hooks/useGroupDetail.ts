import { useState, useEffect, useCallback } from "react";
import {
  fetchGroupById,
  addMemberToGroup,
  removeMemberFromGroup,
  settleMemberBalance,
} from "../services/api";
import { Group, Transaction } from "../types";

export function useGroupDetail(groupId?: number) {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!groupId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchGroupById(groupId);
      setGroup(response.data);
      console.log("Group details loaded", response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Error loading group details:", err.message);
      } else {
        setError("Could not load group details");
        console.error("Unknown error loading group details:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const addMember = useCallback(
    async (name: string) => {
      if (!groupId) return;
      try {
        await addMemberToGroup(groupId, name);
        await reload();
      } catch (err: unknown) {
        console.error("Error adding member:", err);
      }
    },
    [groupId, reload]
  );

  const removeMember = useCallback(
    async (memberId: number) => {
      if (!groupId) return;
      try {
        await removeMemberFromGroup(groupId, memberId);
        await reload();
      } catch (err: unknown) {
        console.error("Error removing member:", err);
      }
    },
    [groupId, reload]
  );

  const settle = useCallback(
    async (memberId: number) => {
      if (!groupId) return;
      try {
        await settleMemberBalance(groupId, memberId);
        await reload();
      } catch (err: unknown) {
        console.error("Error settling balance:", err);
      }
    },
    [groupId, reload]
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    group,
    transactions: group?.transactions || [],  
    loading,
    error,
    reload,
    addMember,
    removeMember,
    settle,
  };
}
