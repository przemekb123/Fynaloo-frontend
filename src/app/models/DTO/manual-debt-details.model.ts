import { UserDetailsModel } from './user-details.model'; // albo tylko ID jeśli uprościmy

export interface ManualDebtDetailsModel {
  id: number;
  debtor: string;     // lub tylko debtorId: number, jeśli backend zwraca ID
  creditor: string;   // lub creditorId: number
  amount: number;
  currency: string;
  settled: boolean;
  createdAt: string;    // LocalDateTime -> string ISO (np. "2025-04-22T13:00:00Z")
  description: string;
}
