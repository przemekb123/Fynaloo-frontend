import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendService } from '../../core/services/friend.service';
import { GroupService } from '../../core/services/group.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-mobile-header',
  imports: [CommonModule],
  template: `
    <header class="bg-pink-400 py-4 px-6 flex items-center justify-between shadow-md relative">

      <!-- Lewa strona: dzwonek -->
      <div class="relative">
        <button (click)="toggleNotifications()" class="relative">
          <span class="material-icons text-white text-3xl">notifications</span>
          <span *ngIf="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ unreadCount }}
          </span>
        </button>

        <!-- Popup powiadomień -->
        <div *ngIf="showNotifications" class="fixed inset-0  bg-opacity-40 z-40" (click)="closeNotifications()">
          <div class="absolute left-4 top-16 w-[18rem] bg-white rounded-lg shadow-lg p-4 z-50" (click)="$event.stopPropagation()">
            <h3 class="font-semibold mb-2">Zaproszenia znajomych</h3>
            <div *ngIf="friendRequests.length === 0" class="text-gray-500 text-sm mb-4">Brak nowych zaproszeń.</div>
            <div *ngFor="let request of friendRequests" class="flex justify-between items-center mb-2">
              <span>{{ request.senderUsername }}</span>
              <div class="flex gap-2">
                <button (click)="acceptFriend(request.senderId)" class="text-green-500 font-bold">✓</button>
                <button (click)="rejectFriend(request.senderId)" class="text-red-500 font-bold">×</button>
              </div>
            </div>

            <h3 class="font-semibold mt-4 mb-2">Zaproszenia do grup</h3>
            <div *ngIf="groupInvitations.length === 0" class="text-gray-500 text-sm">Brak zaproszeń.</div>
            <div *ngFor="let invite of groupInvitations" class="flex justify-between items-center mb-2">
              <span>{{ invite.groupName }}</span>
              <div class="flex gap-2">
                <button (click)="acceptGroup(invite.id)" class="text-green-500 font-bold">✓</button>
                <button (click)="rejectGroup(invite.id)" class="text-red-500 font-bold">×</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Środek: nazwa aplikacji -->
      <h1 class="text-2xl font-bold text-white absolute left-1/2 transform -translate-x-1/2">FYNALOO</h1>

      <!-- Prawa strona: logout -->
      <button (click)="logout()" class="text-white font-semibold">
        <span class="material-icons text-2xl">logout</span>
      </button>

    </header>
  `
})
export class MobileHeaderComponent implements OnInit {
  showNotifications = false;
  friendRequests: any[] = [];
  groupInvitations: any[] = [];

  constructor(
    private friendService: FriendService,
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router
  ) {}

  get unreadCount(): number {
    return this.friendRequests.length + this.groupInvitations.length;
  }

  closeNotifications() {
    this.showNotifications = false;
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  loadNotifications() {
    this.friendService.listPendingRequests().subscribe(reqs => this.friendRequests = reqs);
    this.groupService.listInvitations().subscribe(invites => this.groupInvitations = invites);
  }

  acceptFriend(userId: number) {
    this.friendService.acceptFriendRequest(userId).subscribe(() => this.loadNotifications());
  }

  rejectFriend(userId: number) {
    this.friendService.rejectFriendRequest(userId).subscribe(() => this.loadNotifications());
  }

  acceptGroup(invitationId: number) {
    this.groupService.acceptInvitation(invitationId).subscribe(() => this.loadNotifications());
  }

  rejectGroup(invitationId: number) {
    this.groupService.rejectInvitation(invitationId).subscribe(() => this.loadNotifications());
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
