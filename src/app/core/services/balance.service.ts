import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BalanceSummaryDTO } from '../../models/DTO/balance-summary.model';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private readonly apiUrl = '/api/balances';

  constructor(private http: HttpClient) {}

  getMyBalances(): Observable<BalanceSummaryDTO[]> {
    return this.http.get<BalanceSummaryDTO[]>(`${this.apiUrl}/me`);
  }
}
