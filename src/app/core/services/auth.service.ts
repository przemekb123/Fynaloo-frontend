import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, BehaviorSubject, tap, of, map, catchError} from 'rxjs';
import { UserDetailsModel } from '../../models/DTO/user-details.model';
import { LoginRequestModel } from '../../models/Requests/login-request.model';
import { RegistrationRequestModel } from '../../models/Requests/registration-request.model';
import { environment } from '../../../enviroments/enviroment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserDetailsModel | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = environment.api.server;
  private tokenKey = 'jwt'; // tylko nazwa klucza, nie sam token

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
  }

  login(request: LoginRequestModel): Observable<{ token: string, user: UserDetailsModel }> {
    return this.http.post<{ token: string, user: UserDetailsModel }>(`${this.apiUrl}api/users/login`, request).pipe(
      tap(response => {
        if (response?.token) {
          localStorage.setItem('jwt', response.token);
          this.currentUserSubject.next(response.user);
        } else {
          console.warn('Brak tokena w odpowiedzi backendu.');
        }
      })
    );
  }

  register(request: RegistrationRequestModel): Observable<{ token: string, user: UserDetailsModel }> {
    return this.http.post<{ token: string, user: UserDetailsModel }>(`${this.apiUrl}api/users/register`, request).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  checkAuth(): Observable<{ token: string, user: UserDetailsModel | null }> {
    const token = localStorage.getItem(this.tokenKey);

    if (!token || token.trim() === '') {
      this.logout();
      return of({ token: '', user: null });
    }

    try {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.logout();
        return of({ token: '', user: null });
      }
    } catch (error) {
      // Jeśli token dziwny, np. pusty, nie-JWT
      this.logout();
      return of({ token: '', user: null });
    }

    return this.http.get<UserDetailsModel>(`${this.apiUrl}api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      map(user => ({ token, user })),
      catchError(err => {
        this.logout();
        return of({ token: '', user: null });
      })
    );
  }


  private decodeToken(token: string): UserDetailsModel {
    const decoded = this.jwtHelper.decodeToken(token);
    return {
      id: decoded.id,
      username: decoded.sub,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      groups: [],
      debts: []
    };
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  getCurrentUsername(): string {
    return this.currentUserSubject.value?.username ?? '';
  }

  getCurrentUserId(): number {
    return this.currentUserSubject.value?.id ?? 0;
  }
}
