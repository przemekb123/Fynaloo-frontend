import { ExpenseDetailsModel } from './expense-details.model';
import { ManualDebtDetailsModel } from './manual-debt-details.model';

export interface UserFinancialSummaryModel {
  expenses: ExpenseDetailsModel[];
  manualDebts: ManualDebtDetailsModel[];
}
