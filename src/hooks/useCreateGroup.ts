    import { useState } from "react";
    import { createGroup } from "../services/api";

  export function useCreateGroup(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (title: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createGroup(title);
      console.log("Group created successfully:", response.data);
      onSuccess?.();
    } catch (e) {
      console.error("Failed to create group", e);
      setError("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}
