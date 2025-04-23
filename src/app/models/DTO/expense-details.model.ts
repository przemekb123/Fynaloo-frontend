import { ParticipantInfoModel } from './participant-info.model';
import { PaidDebtInfoModel } from './paid-debt-info.model';

export interface ExpenseDetailsModel {
  id: number;
  description: string;
  amount: number;
  paidBy: string;                    // login/username osoby, która zapłaciła
  currency: string;                  // waluta np. PLN, EUR
  participants: ParticipantInfoModel[]; // uczestnicy
  paidDebts: PaidDebtInfoModel[];        // spłacone długi
}
