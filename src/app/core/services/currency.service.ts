import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {environment} from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private cache: { [key: string]: number } = {};

  constructor(private http: HttpClient) {}

  getExchangeRate(currency: string): Observable<number> {
    if (currency.toUpperCase() === 'PLN') {
      return of(1); //
    }
    if (this.cache[currency]) {
      return of(this.cache[currency]);
    }

    return this.http.get<any>(`${environment.api.nbpApi}${currency}/?format=json`).pipe(
      map(response => {
        const rate = response.rates[0]?.mid ?? 1;
        this.cache[currency] = rate;
        return rate;
      }),
      catchError(() => of(1)) // Jeśli nie uda się pobrać kursu, przyjmij kurs 1
    );
  }
}
