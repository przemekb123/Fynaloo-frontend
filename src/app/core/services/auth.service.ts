import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import {UserDetailsModel} from '../../models/DTO/user-details.model';
import {LoginRequestModel} from '../../models/Requests/login-request.model';
import {RegistrationRequestModel} from '../../models/Requests/registration-request.model';
import {environment} from '../../../enviroments/enviroment';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserDetailsModel | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = environment.api.server;

  constructor(private http: HttpClient) {}


  login(request: LoginRequestModel): Observable<UserDetailsModel> {
    return this.http.post<UserDetailsModel>(this.apiUrl + 'api/users/login', request, { withCredentials: true }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  register(request: RegistrationRequestModel): Observable<UserDetailsModel> {
    return this.http.post<UserDetailsModel>(this.apiUrl + 'api/users/register', request, { withCredentials: true }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.apiUrl + 'api/users/logout', {}, { withCredentials: true }).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }

  checkAuth(): Observable<UserDetailsModel> {
    return this.http.get<UserDetailsModel>(this.apiUrl +  'api/users/me', { withCredentials: true }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUsername(): string {
    return this.currentUserSubject.value?.username ?? '';
  }

  getCurrentUserId(): number {
    return this.currentUserSubject.value?.id ?? 0;
  }
}
