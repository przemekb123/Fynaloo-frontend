import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendService } from '../../core/services/friend.service';
import { FriendModel } from '../../models/DTO/friend.model';
import { MobileBottomNavbarComponent } from '../../components/shared/mobile-bottom-navbar.component';

@Component({
  standalone: true,
  selector: 'app-friends',
  imports: [CommonModule, MobileBottomNavbarComponent],
  template: `
    <div class="min-h-screen bg-white-100 p-4">

      <header class="bg-pink-400 py-6 flex items-center justify-center rounded-b-3xl shadow-md mb-6">
        <h1 class="text-2xl font-bold text-white">Znajomi</h1>
      </header>

      <div class="flex flex-col gap-4">

        <div *ngFor="let friend of friends" class="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-gray-700">{{ friend.firstName }} {{ friend.lastName }}</h2>
            <p class="text-sm text-gray-500">{{ friend.username }}</p>
          </div>
        </div>

      </div>

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `
})
export class FriendsPage implements OnInit {
  friends: FriendModel[] = [];

  constructor(private friendService: FriendService) {}

  ngOnInit(): void {
    this.loadFriends();
  }

  loadFriends() {
    this.friendService.listFriends().subscribe({
      next: (friends) => this.friends = friends,
      error: (err) => console.error('Błąd ładowania znajomych', err)
    });
  }
}
