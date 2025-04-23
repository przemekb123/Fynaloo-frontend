import {ExpenseParticipantModel} from '../DTO/expense-participant.model';


export interface ExpanseRequest {
  groupId: number;                       // ID grupy
  paidBy: string;                      // ID użytkownika płacącego
  amount: number;                        // Kwota (BigDecimal → number)
  currency: string;
  description: string;                   // Opis
  participants: ExpenseParticipantModel[]; // Lista uczestników wydatku
}
