import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GroupService} from '../../core/services/group.service';
import {AuthService} from '../../core/services/auth.service';
import {GroupDetailsModel} from '../../models/DTO/group-details.model';
import {MobileBottomNavbarComponent} from '../../components/shared/mobile-bottom-navbar.component';
import {MobileHeaderComponent} from '../../components/shared/mobile-header.component';

@Component({
  standalone: true,
  selector: 'app-group-details',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MobileBottomNavbarComponent, MobileHeaderComponent],
  template: `

    <app-mobile-header/>
    <div class="min-h-screen bg-gradient-to-b from-[#f3f1ff] via-[#f9f8ff] to-white pt-24 pb-32 px-4">

      <!-- Nagłówek -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-indigo-700">{{ group?.groupName }}</h1>
        <p class="text-sm text-gray-500">Zarządzaj członkami grupy</p>
      </div>

      <!-- Lista członków -->
      <div class="bg-white rounded-2xl shadow-md p-4 mb-6">
        <h2 class="text-md font-semibold text-gray-800 mb-3">Członkowie grupy:</h2>
        <ul class="flex flex-col gap-2">
          <li *ngFor="let member of group?.members" class="flex justify-between items-center text-sm">
            <span class="text-gray-700">{{ member.username }} <span class="text-gray-400">({{ member.role }}
              )</span></span>
            <button
              *ngIf="canRemoveMember(member.userId)"
              (click)="openRemoveConfirmPopup(member.userId)"
              class="text-red-500 hover:text-red-600 font-semibold text-xs"
            >
              Usuń
            </button>
            <div *ngIf="showConfirmRemoveUserId !== null" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div class="bg-white p-6 rounded-lg shadow-md w-80 relative">
                <h2 class="text-lg font-semibold text-center text-gray-800 mb-4">Na pewno usunąć użytkownika?</h2>
                <div class="flex justify-between">
                  <button (click)="showConfirmRemoveUserId = null" class="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 font-semibold">Anuluj</button>
                  <button (click)="confirmRemoveUser()" class="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold">Usuń</button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Przycisk zaproszenia -->
      <div class="flex justify-center gap-4 mb-6">

        <!-- Zaproś członka -->
        <button
          (click)="openInvitePopup()"
          class="flex items-center gap-2 bg-[var(--color-mobile-add-button)] hover:bg-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded-full shadow transition"
        >
    <span class="material-symbols-outlined text-white text-base"
          style="font-variation-settings: 'wght' 300, 'opsz' 24;">
      person_add
    </span>
          Zaproś członka
        </button>

        <!-- Wygeneruj link -->
        <button
          (click)="generateInviteLink()"
          class="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-semibold py-2 px-4 rounded-full shadow transition"
        >
    <span class="material-symbols-outlined text-indigo-700 text-base"
          style="font-variation-settings: 'wght' 300, 'opsz' 24;">
      link
    </span>
          Wygeneruj link
        </button>

      </div>


      <!-- Popup zaproszenia -->
      <div *ngIf="showInvitePopup" class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div class="bg-white rounded-xl shadow-lg w-[90%] max-w-sm p-6 relative">
          <button (click)="closeInvitePopup()" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
            <span class="material-icons">close</span>
          </button>
          <h3 class="text-center text-lg font-semibold text-gray-800 mb-4">Zaproś do grupy</h3>
          <input
            type="text"
            [(ngModel)]="inviteUsername"
            placeholder="Wpisz nazwę użytkownika"
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-mobile-add-button)] outline-none mb-4 text-sm"
          />
          <button
            (click)="sendInvitation()"
            class="w-full py-2 text-sm font-semibold text-white rounded-lg bg-[var(--color-mobile-add-button)] hover:bg-indigo-600"
          >
            Wyślij zaproszenie
          </button>
          <div *ngIf="inviteSuccessMessage" class="text-green-600 text-sm mt-2 text-center font-semibold">
            {{ inviteSuccessMessage }}
          </div>

          <div *ngIf="inviteErrorMessage" class="text-red-500 text-sm mt-2 text-center font-semibold">
            {{ inviteErrorMessage }}
          </div>
        </div>
      </div>

      <!-- Usuń grupę -->
      <div *ngIf="isOwner" class="flex justify-center mt-10">
        <button
          (click)="openDeleteConfirmPopup()"
          class="bg-red-500 hover:bg-red-600 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md"
        >
          Usuń grupę
        </button>
      </div>

      <!-- Potwierdzenie usunięcia grupy -->
      <div *ngIf="showConfirmDelete" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-md w-80 relative">
          <h2 class="text-lg font-semibold text-center text-gray-800 mb-4">Czy na pewno chcesz usunąć grupę?</h2>
          <div class="flex justify-between">
            <button (click)="showConfirmDelete = false" class="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 font-semibold">Anuluj</button>
            <button (click)="confirmDeleteGroup()" class="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold">Usuń</button>
          </div>
        </div>
      </div>

      <app-bottom-navbar/>
    </div>
  `
})
export class GroupDetailsPage implements OnInit {
  group!: GroupDetailsModel | null;
  isOwner = false;
  groupId!: number;
  inviteSuccessMessage = '';
  inviteErrorMessage = '';
  showConfirmDelete = false;
  showConfirmRemoveUserId: number | null = null;
  deleteSuccessMessage = '';
  deleteErrorMessage = '';
  removeSuccessMessage = '';
  removeErrorMessage = '';

  showInvitePopup = false;
  inviteUsername = '';

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));
    this.loadGroup();
  }

  loadGroup() {
    this.groupService.getGroupDetails(this.groupId).subscribe(group => {
      this.group = group;
      this.isOwner = group.members.some(
        member => member.userId === this.authService.getCurrentUserId() && member.role === 'ADMIN'
      );
    });
  }

  openDeleteConfirmPopup() {
    this.showConfirmDelete = true;
    this.deleteSuccessMessage = '';
    this.deleteErrorMessage = '';
  }

  openRemoveConfirmPopup(userId: number) {
    this.showConfirmRemoveUserId = userId;
    this.removeSuccessMessage = '';
    this.removeErrorMessage = '';
  }



  confirmRemoveUser() {
    if (this.showConfirmRemoveUserId === null) return;

    this.groupService.removeMemberFromGroup(this.groupId, this.showConfirmRemoveUserId).subscribe({
      next: () => {
        this.removeSuccessMessage = 'Użytkownik został usunięty.';
        this.loadGroup();
      },
      error: err => {
        console.error('Błąd usuwania użytkownika', err);
        this.removeErrorMessage = 'Nie udało się usunąć użytkownika.';
      }
    });

    this.showConfirmRemoveUserId = null;
  }



  canRemoveMember(userId: number): boolean {
    return this.isOwner && userId !== this.authService.getCurrentUserId();
  }

  confirmDeleteGroup() {
    this.groupService.deleteGroup(this.groupId).subscribe({
      next: () => {
        this.deleteSuccessMessage = 'Grupa została usunięta.';
        this.router.navigate(['/groups']);
      },
      error: err => {
        console.error('Błąd usuwania grupy', err);
        this.deleteErrorMessage = 'Nie udało się usunąć grupy.';
      }
    });
    this.showConfirmDelete = false;
  }

  openInvitePopup() {
    this.showInvitePopup = true;
  }

  closeInvitePopup() {
    this.showInvitePopup = false;
  }

  sendInvitation() {
    const trimmedUsername = this.inviteUsername.trim();
    const currentUsername = this.authService.getCurrentUsername();

    this.inviteSuccessMessage = '';
    this.inviteErrorMessage = '';

    if (!trimmedUsername) {
      this.inviteErrorMessage = 'Wpisz nazwę użytkownika.';
      return;
    }

    if (trimmedUsername === currentUsername) {
      this.inviteErrorMessage = 'Nie możesz zaprosić samego siebie.';
      return;
    }

    this.groupService.sendInvitation(this.groupId, trimmedUsername).subscribe({
      next: () => {
        this.inviteSuccessMessage = 'Zaproszenie wysłane!';
        this.inviteErrorMessage = '';
        this.inviteUsername = '';
      },
      error: (err) => {
        console.error('Błąd zapraszania użytkownika', err);
        this.inviteErrorMessage = 'Nie udało się wysłać zaproszenia. Sprawdź wprowadzone dane.';
        this.inviteSuccessMessage = '';
      }
    });
  }


  generateInviteLink() {

  }
}
