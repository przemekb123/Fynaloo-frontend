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
    return this.http.get<FriendModel[]>(`${this.apiUrl}`);
  }

  listPendingRequests(): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/requests`);
  }

  sendFriendRequest(username: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/request`, { username });
  }

  acceptFriendRequest(userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/accept`, { userId } );
  }

  rejectFriendRequest(userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reject`, { userId });
  }
}
