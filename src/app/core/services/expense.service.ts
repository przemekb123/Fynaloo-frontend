import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map} from 'rxjs';
import {environment} from '../../../enviroments/enviroment';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly apiUrl = `${environment.api.server}api/expenses`;
  private readonly manualDebtUrl = `${environment.api.server}api/manual-debts`;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getExpensesForUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).pipe(
      map(expenses =>
        expenses.map(expense => {
          const currentUserPaidDebt = expense.paidDebts.find((pd: any) => pd.paidToUserId === userId);
          const isCreditor = expense.paidBy === this.authService.getCurrentUsername();

          return {
            type: 'group',
            id: expense.id,
            paidBy: expense.paidBy,
            firstName: expense.firstName,
            lastName: expense.lastName,
            yourDebt: this.calculateYourDebt(expense),
            paidCount: this.calculatePaidCount(expense),
            countAllParticipant: this.countAllParticipant(expense),
            description: expense.description,
            amount: expense.amount,
            currency: expense.currency,
            settled: this.isExpenseSettledForUser(expense),
            amountPaid: currentUserPaidDebt ? currentUserPaidDebt.amountPaid : undefined,
            isCreditor: isCreditor,
            participants: expense.participants,
            paidDebts: expense.paidDebts
          };
        })
      )
    );
  }

  getManualDebtsForUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.manualDebtUrl}/user/${userId}`).pipe(
      map(debts =>
        debts.map(debt => ({
          type: 'personal',
          id: debt.id,
          debtor: debt.debtor,
          creditor: debt.creditor,
          creditorFirstName: debt.creditorFirstName,
          creditorLastName: debt.creditorLastName,
          description: debt.description,
          amount: debt.amount,
          settled: debt.settled,
          currency: 'PLN',
          isCreditor: debt.creditor === this.authService.getCurrentUsername()
        }))
      )
    );
  }


  private calculateYourDebt(expense: any): number {
    const currentUserId = this.authService.getCurrentUserId();

    const currentUser = expense.participants.find((p: any) => p.userId === currentUserId);
    if (!currentUser) return 0;

    return !currentUser.settled ? currentUser.shareAmount : 0;
  }

  private calculatePaidCount(expense: any): number {
    return expense.paidDebts.length;
  }

  private countAllParticipant(expense: any) {
    return expense.participants.length + expense.paidDebts.length;
  }

  createExpense(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }

  settleExpense(expenseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${expenseId}/settle`, {});
  }

  private isExpenseSettledForUser(expense: any): boolean {
    const currentUserId = this.authService.getCurrentUserId();

    const participant = expense.participants.find((p: any) => p.userId === currentUserId);
    if (participant && participant.settled) {
      return true;
    }

    const paidDebt = expense.paidDebts.find((pd: any) => pd.paidToUserId === currentUserId && pd.amountPaid > 0);

    return !!paidDebt;
  }

  settleManualDebt(debtId: number): Observable<any> {
    return this.http.post(`${this.manualDebtUrl}/${debtId}/settle`, {});
  }
}
