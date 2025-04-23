import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FriendModel } from '../../models/DTO/friend.model';
import {FriendRequest} from '../../models/Requests/friend-request';
import {environment} from '../../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class FriendService {
  private apiUrl = `${environment.api.server}api/friends`;

  constructor(private http: HttpClient) {}

  listFriends(): Observable<FriendModel[]> {
    return this.http.get<FriendModel[]>(`${this.apiUrl}`, { withCredentials: true });
  }

  listPendingRequests(): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/requests`, { withCredentials: true });
  }

  sendFriendRequest(username: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/request`, { username }, { withCredentials: true });
  }

  acceptFriendRequest(userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/accept`, { userId }, { withCredentials: true });
  }

  rejectFriendRequest(userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reject`, { userId }, { withCredentials: true });
  }
}
