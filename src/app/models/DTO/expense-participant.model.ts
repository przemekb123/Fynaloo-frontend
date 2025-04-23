export interface ExpenseParticipantModel {
  userId: number;     // ID uczestnika
  shareAmount: number; // Kwota, którą powinien zapłacić
  settled: boolean;    // Czy uczestnik już spłacił
}
