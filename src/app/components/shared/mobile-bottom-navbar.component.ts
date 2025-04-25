import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MobileAddFriendComponent } from '../mobile/friend/mobile-add-friend.component';
import {MobileCreateGroupComponent} from '../mobile/group/mobile-create-group.component';
import {MobileAddExpenseComponent} from '../mobile/expense/mobile-add-expense.component';
import {MobileManualDebtComponent} from '../mobile/manualDebt/mobile-manual-debt.component';
import {AuthService} from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-bottom-navbar',
  imports: [CommonModule, RouterLink, MobileAddFriendComponent, MobileCreateGroupComponent, MobileAddExpenseComponent, MobileManualDebtComponent],
  template: `
    <nav class="fixed  bottom-0 rounded-t-3xl left-0 right-0 bg-[var(--color-mobile-navbar)] h-16 flex items-center justify-around z-50 shadow-inner px-4 sm:px-6">

      <!-- Nawigacja -->
      <ng-container *ngFor="let item of navItems">
        <a
          [routerLink]="item.link"
          class="relative flex flex-col items-center justify-center w-12 h-12"
        >
    <span
      class="material-symbols-outlined text-[16px]"
      [ngStyle]="{
        'font-variation-settings': isActive(item.link)
            ? '\\'FILL\\' 1, \\'wght\\' 400, \\'GRAD\\' 0, \\'opsz\\' 40'
            : '\\'FILL\\' 0, \\'wght\\' 300, \\'GRAD\\' 100, \\'opsz\\' 40'
        }"
      [ngClass]="{
        'text-white': isActive(item.link),
        'text-white/70': !isActive(item.link)
      }"
    >
      {{ item.icon }}
    </span>
          <span class="text-[10px] text-white mt-1">{{ item.label }}</span>
        </a>
      </ng-container>


      <!-- Przycisk "+" -->
      <div class="absolute -top-9 left-1/2 transform -translate-x-1/2 z-20">
        <button (click)="openMenu()" class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--color-mobile-add-button)] from-[#F50800] to-[#F200D1] flex items-center justify-center shadow-lg">
          <span class="material-icons text-white text-3xl sm:text-4xl">add</span>
        </button>
      </div>

      <!-- Popup menu -->
      <div *ngIf="showMenu" class="fixed inset-0 bg-black bg-opacity-40 flex items-end z-50" (click)="closeMenu()">
        <div class="bg-white w-full rounded-t-3xl p-6 pt-12 flex flex-col gap-4 relative" (click)="$event.stopPropagation()">

          <button (click)="closeMenu()" class="absolute top-4 right-4">
            <span class="material-icons text-gray-400 hover:text-gray-600 text-3xl">close</span>
          </button>

          <button (click)="toggleAddManualDebtPopup()" class="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition">
            <span class="text-2xl">💳</span>
            <span class="text-lg font-semibold text-gray-700">Dodaj dług</span>
          </button>

          <button (click)="toggleAddExpensePopup()" class="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition">
            <span class="material-icons text-pink-500">add_shopping_cart</span>
            <span class="text-lg font-semibold text-gray-700">Dodaj wydatek</span>
          </button>

          <button (click)="navigateTo('/add-settlement')" class="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition">
            <span class="material-icons text-2xl text-pink-500">sync_alt</span>
            <span class="text-lg font-semibold text-gray-700">Dodaj wyrównanie</span>
          </button>

          <button (click)="toggleGroupPopup()" class="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition">
            <span class="material-icons text-2xl text-pink-500">group_add</span>
            <span class="text-lg font-semibold text-gray-700">Utwórz grupę</span>
          </button>

          <button (click)="toggleFriendPopup()" class="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition">
            <span class="material-icons text-pink-500">person_add</span>
            <span class="text-lg font-semibold text-gray-700">Dodaj znajomego</span>
          </button>
        </div>
      </div>

      <!-- Popup dodawania znajomego -->
      <app-mobile-add-friend
        *ngIf="showAddFriendPopup"
        [currentUsername]="authService.getCurrentUsername()"
        (closed)="showAddFriendPopup = false"
      />
      <!-- Popup tworzenia grupy -->
      <app-mobile-create-group *ngIf="showCreateGroupPopup" (closed)="toggleGroupPopup()" />

      <!-- Popup tworzenie wydatku -->
      <app-mobile-add-expense *ngIf="showAddExpensePopup" (closed)="toggleAddExpensePopup()" />

      <!-- Popup tworzenie manual debt -->
      <app-mobile-manual-debt *ngIf="showManualDebtPopup" (closed)="toggleAddManualDebtPopup()" />

    </nav>
  `,
  styles: [`
    .material-icons {
      font-size: 28px;
    }
  `]
})
export class MobileBottomNavbarComponent {
  showMenu = false;
  showAddFriendPopup = false;
  showCreateGroupPopup = false;
  showAddExpensePopup = false;
  showManualDebtPopup = false;


  constructor(private router: Router,public authService : AuthService) {}

  navItems = [
    { link: '/dashboard', icon: 'home', label: 'Home' },
    { link: '/groups', icon: 'groups', label: 'Grupy' },
    { link: '/friends', icon: 'group', label: 'Znajomi' },
    { link: '/profile', icon: 'person', label: 'Profil' }
  ];

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  openMenu() {
    this.showMenu = true;
  }

  closeMenu() {
    this.showMenu = false;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.closeMenu();
  }

  toggleFriendPopup() {
    this.showAddFriendPopup = !this.showAddFriendPopup;
    this.closeMenu();
  }

  toggleGroupPopup() {
    this.showCreateGroupPopup = !this.showCreateGroupPopup;
    this.closeMenu();
  }

  toggleAddExpensePopup() {
    this.showAddExpensePopup = !this.showAddExpensePopup;
    this.closeMenu();
  }

  toggleAddManualDebtPopup() {
    this.showManualDebtPopup = !this.showManualDebtPopup;
    this.closeMenu();
  }
}
