import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {environment} from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private cache: { [currency: string]: number } = {};
  private ratesLoaded = false;

  constructor(private http: HttpClient) {}

  getExchangeRate(currency: string): Observable<number> {
    if (currency.toUpperCase() === 'PLN') {
      return of(1);
    }

    if (this.cache[currency]) {
      return of(this.cache[currency]);
    }

    if (this.ratesLoaded) {
      return of(1);
    }

    // Jeśli jeszcze nie ładowaliśmy kursów, pobierz wszystkie
    return this.http.get<any>(environment.api.currencyApi + '?base=PLN').pipe(
      tap(response => {
        this.cache = response.rates;
        this.ratesLoaded = true;
      }),
      map(response => {
        const rate = response.rates[currency] ?? 1;
        this.cache[currency] = rate;
        return rate;
      }),
      catchError(() => of(1)) // Jeśli błąd — zwróć kurs 1
    );
  }
}
