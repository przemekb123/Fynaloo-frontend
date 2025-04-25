import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendService } from '../../core/services/friend.service';
import { FriendModel } from '../../models/DTO/friend.model';
import { MobileBottomNavbarComponent } from '../../components/shared/mobile-bottom-navbar.component';
import {MobileHeaderComponent} from '../../components/shared/mobile-header.component';
import {MobileAddFriendComponent} from '../../components/mobile/friend/mobile-add-friend.component';
import {AuthService} from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-friends',
  imports: [CommonModule, MobileBottomNavbarComponent, MobileHeaderComponent, MobileAddFriendComponent],
  template: `
    <app-mobile-header />

    <div class="min-h-screen bg-gradient-to-b from-[#f3f1ff] via-[#f9f8ff] to-white pt-24 pb-32 px-4">

      <div class="flex flex-col gap-4">

        <!-- Lista znajomych -->
        <div *ngFor="let friend of friends" class="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-gray-700">{{ friend.firstName }} {{ friend.lastName }}</h2>
            <p class="text-sm text-gray-500">{{ friend.username }}</p>
          </div>
        </div>

        <!-- Brak znajomych -->
        <div *ngIf="friends.length === 0" class="text-center text-gray-500 mt-12">
          <span class="material-symbols-outlined text-6xl text-gray-300">group_off</span>
          <p class="text-sm mt-2">Nie masz jeszcze żadnych znajomych.</p>
        </div>

        <!-- Przycisk dodawania znajomego -->
        <div class="mt-6 flex justify-center">
          <button
            class="bg-[var(--color-mobile-add-button)] hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded-full shadow transition"
            (click)="showAddFriendPopup = true"
          >
            Dodaj znajomego
          </button>
        </div>

      </div>

    </div>

    <!--  Popup powinien być tu — POZA layoutem -->
    <app-mobile-add-friend
      *ngIf="showAddFriendPopup"
      [currentUsername]="currentUsername"
      (closed)="showAddFriendPopup = false"
    />

    <app-bottom-navbar />

  `
})
export class FriendsPage implements OnInit {
  friends: FriendModel[] = [];
  showAddFriendPopup = false;
  currentUsername = '';



  constructor(private friendService: FriendService, public authService : AuthService) {}

  ngOnInit(): void {
    this.currentUsername = this.authService.getCurrentUsername();
    this.loadFriends();
  }

  loadFriends() {
    this.friendService.listFriends().subscribe({
      next: (friends) => this.friends = friends,
      error: (err) => console.error('Błąd ładowania znajomych', err)
    });
  }
}
