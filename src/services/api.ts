import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchGroups = () => api.get("/groups");
export const createGroup = (title: string) => api.post("/groups", { title });

export const fetchGroupById = (groupId: number) => api.get(`/groups/${groupId}`);

export const addMemberToGroup = (groupId: number, memberName: string) =>
  api.post(`/groups/${groupId}/members`, { name: memberName });

export const removeMemberFromGroup = (groupId: number, memberId: number) =>
  api.delete(`/groups/${groupId}/members/${memberId}`);

export const settleMemberBalance = (groupId: number, memberId: number, remove = false) =>
  api.post(`/groups/${groupId}/members/${memberId}/settle${remove ? '?remove=true' : ''}`);

export const fetchTransactions = (groupId: number) =>
  api.get(`/groups/${groupId}`);  

export interface SplitDetail {
  memberId: number;
  percentage?: number;
  amount?: number;
}

export interface NewTransactionPayload {
  payerId: number;
  amount: number;
  description?: string;
  splitType: "equally" | "percentage" | "dynamic";
  splitDetails?: SplitDetail[];
}

export const createTransaction = (
  groupId: number,
  transaction: NewTransactionPayload
) => api.post(`/groups/${groupId}/transactions`, transaction);

export default api;
