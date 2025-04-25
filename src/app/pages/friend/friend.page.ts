import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendService } from '../../core/services/friend.service';
import { FriendModel } from '../../models/DTO/friend.model';
import { MobileBottomNavbarComponent } from '../../components/shared/mobile-bottom-navbar.component';
import {MobileHeaderComponent} from '../../components/shared/mobile-header.component';

@Component({
  standalone: true,
  selector: 'app-friends',
  imports: [CommonModule, MobileBottomNavbarComponent, MobileHeaderComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-[#f3f1ff] via-[#f9f8ff] to-white p-4 pt-20">

      <app-mobile-header />


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
