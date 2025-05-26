import { useState } from "react";
import { createTransaction } from "../services/api";
import { NewTransactionPayload } from "../types";

export function useCreateTransaction(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (groupId: number, payload: NewTransactionPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createTransaction(groupId, payload);
      console.log("Transaction created:", response.data);
      onSuccess?.();
      return response.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Failed to create transaction:", err.message);
        setError(err.message);
      } else {
        console.error("Failed to create transaction:", err);
        setError("Failed to create transaction");
      }
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
