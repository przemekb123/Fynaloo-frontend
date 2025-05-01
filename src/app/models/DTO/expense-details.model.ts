import { ParticipantInfoModel } from './participant-info.model';
import { PaidDebtInfoModel } from './paid-debt-info.model';
import {CurrencyModel} from '../Enums/currency.model';

export interface ExpenseDetailsModel {
  id: number;
  description: string;
  amount: number;
  paidBy: string;
  firstName: string;
  lastName: string;
  currency: CurrencyModel;
  participants: ParticipantInfoModel[]; // uczestnicy
  paidDebts: PaidDebtInfoModel[];        // spłacone długi
}
