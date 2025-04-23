import { UserFinancialSummaryModel } from './user-financial-summary.model';
import { GroupDetailsModel } from './group-details.model';

export interface UserDetailsModel {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  debts: UserFinancialSummaryModel[];
  groups: GroupDetailsModel[];
}
