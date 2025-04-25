import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {environment} from '../../../enviroments/enviroment';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly apiUrl = `${environment.api.server}api/expenses`;
  private readonly manualDebtUrl = `${environment.api.server}api/manual-debts`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getExpensesForUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).pipe(
      map(expenses =>
        expenses.map(expense => ({
          type: 'group',
          id: expense.id,
          paidBy: expense.paidBy,
          yourDebt: this.calculateYourDebt(expense),
          paidCount: this.calculatePaidCount(expense),
          countAllParticipant: this.countAllParticipant(expense),
          description: expense.description,
          currency: expense.currency
        }))
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
          description: debt.description,
          amount: debt.amount
        }))
      )
    );
  }

  private calculateYourDebt(expense: any): number {
    const currentUserId = this.authService.getCurrentUserId();

    const currentUser = expense.participants.find((p: any) => p.userId === currentUserId);
    if (!currentUser) return 0;

    const totalParticipants = expense.participants.length + expense.paidDebts.length;
    const individualShare = expense.amount / totalParticipants;

    return !currentUser.settled ? Math.round(individualShare * 100) / 100 : 0;
  }



  private calculatePaidCount(expense: any): number {
    return expense.paidDebts.length;
  }

  private countAllParticipant(expense: any){
    return expense.participants.length + expense.paidDebts.length;
  }

  createExpense(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }

  settleExpense(expenseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${expenseId}/settle`, {});
  }
}
