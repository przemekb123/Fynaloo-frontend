import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupDetailsModel } from '../../models/DTO/group-details.model';
import { CreateGroupRequest } from '../../models/Requests/create-group-request';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private readonly apiUrl = `${environment.api.server}api/groups`;

  constructor(private http: HttpClient) {}

  /**
   * Pobiera wszystkie grupy danego użytkownika.
   */
  getGroupsForUser(userId: number): Observable<GroupDetailsModel[]> {
    return this.http.get<GroupDetailsModel[]>(`${this.apiUrl}/user/${userId}`, { withCredentials: true });
  }

  /**
   * Tworzy nową grupę.
   */
  createGroup(request: CreateGroupRequest): Observable<GroupDetailsModel> {
    return this.http.post<GroupDetailsModel>(`${this.apiUrl}`, request, { withCredentials: true });
  }

  /**
   * Pobiera szczegóły konkretnej grupy.
   */
  getGroupDetails(groupId: number): Observable<GroupDetailsModel> {
    return this.http.get<GroupDetailsModel>(`${this.apiUrl}/${groupId}`, { withCredentials: true });
  }

  /**
   * Usuwa użytkownika z grupy.
   */
  removeMemberFromGroup(groupId: number, userId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${groupId}/remove-member/${userId}`, {
      responseType: 'text' as 'json',
      withCredentials: true
    });
  }

  /**
   * Usuwa grupę.
   */
  deleteGroup(groupId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${groupId}`, { withCredentials: true });
  }

  /**
   * Wysyła zaproszenie do grupy na podstawie username.
   */
  sendInvitation(groupId: number, username: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${groupId}/invite`, { username }, { withCredentials: true });
  }

  /**
   * Pobiera zaproszenia do grup (dla aktualnego użytkownika).
   */
  listInvitations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/invitations`, { withCredentials: true });
  }

  /**
   * Akceptuje zaproszenie do grupy.
   */
  acceptInvitation(invitationId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/invitations/${invitationId}/accept`, {}, { withCredentials: true });
  }

  /**
   * Odrzuca zaproszenie do grupy.
   */
  rejectInvitation(invitationId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/invitations/${invitationId}/reject`, {}, { withCredentials: true });
  }
}
