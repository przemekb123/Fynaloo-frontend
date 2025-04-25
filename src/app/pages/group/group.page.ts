import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { GroupService } from '../../core/services/group.service';
import { MobileBottomNavbarComponent } from '../../components/shared/mobile-bottom-navbar.component';
import { AuthService } from '../../core/services/auth.service';
import {GroupDetailsModel} from '../../models/DTO/group-details.model';
import {MobileHeaderComponent} from '../../components/shared/mobile-header.component';

@Component({
  standalone: true,
  selector: 'app-groups',
  imports: [CommonModule, RouterLink, MobileBottomNavbarComponent, MobileHeaderComponent],
  template: `
    <app-mobile-header />
    <div class="min-h-screen bg-gradient-to-b from-[#f3f1ff] via-[#f9f8ff] to-white pt-24 pb-32 px-4">

      <!-- Nagłówek -->
      <div class="text-center mb-6">
        <h2 class="text-xl font-bold text-[var(--color-mobile-add-button)]">Twoje grupy</h2>
        <p class="text-sm text-gray-500">Wybierz lub utwórz nową grupę</p>
      </div>

      <!-- Lista grup -->
      <div class="flex flex-col gap-4">
        <div *ngFor="let group of groups"
             class="bg-white rounded-2xl shadow-md px-4 py-3 flex justify-between items-center">
          <div>
            <h3 class="text-base font-bold text-indigo-700">{{ group.groupName }}</h3>
            <p class="text-sm text-gray-500">{{ group.members.length }} członków</p>
          </div>
          <a [routerLink]="['/groups', group.groupId]"
             class="bg-[var(--color-mobile-add-button)] hover:bg-indigo-600 text-white text-xs px-4 py-2 rounded-xl font-semibold transition">
            Wejdź
          </a>
        </div>
      </div>

      <!-- Przycisk dodawania grupy -->
      <div class="mt-8 flex justify-center">
        <a
          routerLink="/groups/create"
          class="bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-lg transition"
        >
          + Utwórz nową grupę
        </a>
      </div>

      <!-- Bottom navbar -->
      <app-bottom-navbar/>
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
