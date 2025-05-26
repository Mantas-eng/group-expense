export interface Member {
  id: number;
  name: string;
  balance: number;
}

export interface Group {
  id: number;
  title: string;
  balance: number;
  members: Member[];
  transactions: Transaction[];  
}

export interface TransactionSplit {
  memberId: number;
  amount: number;
  percentage?: number;
}

export interface Transaction {
  id: number;
  payerId: number;
  amount: number;
  splitMethod: "equally" | "percentage" | "dynamic";
  splits: TransactionSplit[];
}

export type SplitDetail = TransactionSplit;

export interface NewTransactionPayload {
  payerId: number;
  amount: number;
  description?: string;
  splitType: "equally" | "percentage" | "dynamic";
  splitDetails?: SplitDetail[];
}
