import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { GroupService } from '../../core/services/group.service';
import { MobileBottomNavbarComponent } from '../../components/shared/mobile-bottom-navbar.component';
import { AuthService } from '../../core/services/auth.service';
import {GroupDetailsModel} from '../../models/DTO/group-details.model';

@Component({
  standalone: true,
  selector: 'app-groups',
  imports: [CommonModule, RouterLink, MobileBottomNavbarComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-white-100">

      <!-- Główna zawartość -->
      <div class="flex-1 p-4 pb-32"> <!-- DODANY padding-bottom: pb-32 -->

        <header class="bg-pink-400 py-6 flex items-center justify-center rounded-b-3xl shadow-md mb-6">
          <h1 class="text-2xl font-bold text-white">FYNALOO</h1>
        </header>

        <div class="mb-4 text-center">
          <h2 class="text-lg font-semibold">Twoje grupy:</h2>
        </div>

        <hr class="border-gray-300 mb-6" />

        <!-- Lista grup -->
        <div class="flex flex-col gap-6">
          <div *ngFor="let group of groups" class="border rounded-xl bg-white shadow-sm p-4 flex justify-between items-center">
            <div>
              <h3 class="text-lg font-bold text-gray-700">{{ group.groupName }}</h3>
              <p class="text-sm text-gray-500">{{ group.members.length }} członków</p>
            </div>

            <button
              [routerLink]="['/groups', group.groupId]"
              class="bg-pink-500 hover:bg-pink-600 text-white text-sm py-2 px-4 rounded-lg transition"
            >
              Wejdź
            </button>
          </div>
        </div>

        <!-- Przycisk dodawania grupy -->
        <div class="flex justify-center mt-6">
          <button
            routerLink="/groups/create"
            class="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition shadow-md"
          >
            + Utwórz nową grupę
          </button>
        </div>

      </div>

      <!-- Bottom navbar -->
      <app-bottom-navbar></app-bottom-navbar>

    </div>

  `
})
export class GroupsPage implements OnInit {
  groups: GroupDetailsModel[] = [];

  constructor(private groupService: GroupService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    this.groupService.getGroupsForUser(userId).subscribe(groups => {
      this.groups = groups;
    });
  }
}
