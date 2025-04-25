import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ManualDebtService {
  private readonly baseUrl = `${environment.api.server}api/manual-debts`;

  constructor(private http: HttpClient) {}

  getDebtsForUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`);
  }

  addManualDebt(request: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, request, { withCredentials: true });
  }

  settleDebt(debtId: number): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/${debtId}/settle`, {});
  }

  recalculateDebt(request: any): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/recalculate`, request);
  }

  adjustPriceDifference(request: any): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/adjust-price-difference`, request);
  }
}
