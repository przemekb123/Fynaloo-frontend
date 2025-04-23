import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { GroupService } from '../../core/services/group.service';
import { AuthService } from '../../core/services/auth.service';
import { GroupDetailsModel } from '../../models/DTO/group-details.model';
import { MobileBottomNavbarComponent } from '../../components/shared/mobile-bottom-navbar.component';

@Component({
  standalone: true,
  selector: 'app-group-details',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MobileBottomNavbarComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-white-100">
      <div class="flex-1 p-4 pb-32">
        <header class="bg-pink-400 py-6 flex items-center justify-center rounded-b-3xl shadow-md mb-6">
          <h1 class="text-2xl font-bold text-white">{{ group?.groupName }}</h1>
        </header>

        <div class="flex flex-col gap-4">
          <!-- Lista członków -->
          <div class="bg-white rounded-lg shadow-md p-4">
            <h2 class="text-lg font-semibold mb-4">Członkowie grupy:</h2>
            <ul class="flex flex-col gap-2">
              <li *ngFor="let member of group?.members" class="flex justify-between items-center">
                <span>{{ member.username }} ({{ member.role }})</span>
                <button
                  *ngIf="canRemoveMember(member.userId)"
                  (click)="removeMember(member.userId)"
                  class="text-red-500 hover:text-red-600 text-sm font-semibold"
                >
                  Usuń
                </button>
              </li>
            </ul>
          </div>

          <!-- Przycisk dodawania członka -->
          <div class="bg-white rounded-lg shadow-md p-4 flex justify-center">
            <button
              (click)="openInvitePopup()"
              class="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full"
            >
              ➕ Zaproś członka
            </button>
          </div>

          <!-- Popup do zapraszania -->
          <div *ngIf="showInvitePopup" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-80 relative">
              <button (click)="closeInvitePopup()" class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                <span class="material-icons">close</span>
              </button>

              <h2 class="text-lg font-semibold mb-4 text-center">Zaproś do grupy</h2>

              <input
                type="text"
                [(ngModel)]="inviteUsername"
                placeholder="Wpisz nazwę użytkownika"
                class="w-full p-2 border rounded-lg mb-4 focus:ring-2 focus:ring-pink-400"
              />

              <button (click)="sendInvitation()" class="bg-pink-500 hover:bg-pink-600 text-white font-semibold w-full py-2 rounded-lg">
                Wyślij zaproszenie
              </button>
            </div>
          </div>

          <!-- Usuń grupę -->
          <div *ngIf="isOwner" class="bg-white rounded-lg shadow-md p-4 flex justify-center">
            <button (click)="deleteGroup()" class="bg-red-500 text-white rounded-lg px-6 py-3 font-semibold">
              Usuń grupę
            </button>
          </div>
        </div>
      </div>

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `
})
export class GroupDetailsPage implements OnInit {
  group!: GroupDetailsModel | null;
  isOwner = false;
  groupId!: number;

  showInvitePopup = false;
  inviteUsername = '';

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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

  removeMember(userId: number) {
    if (!confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return;

    this.groupService.removeMemberFromGroup(this.groupId, userId).subscribe({
      next: () => this.loadGroup(),
      error: err => console.error('Błąd usuwania użytkownika', err)
    });
  }

  deleteGroup() {
    if (!confirm('Czy na pewno chcesz usunąć grupę?')) return;

    this.groupService.deleteGroup(this.groupId).subscribe({
      next: () => this.router.navigate(['/groups']),
      error: err => console.error('Błąd usuwania grupy', err)
    });
  }

  canRemoveMember(userId: number): boolean {
    return this.isOwner && userId !== this.authService.getCurrentUserId();
  }

  openInvitePopup() {
    this.showInvitePopup = true;
  }

  closeInvitePopup() {
    this.showInvitePopup = false;
  }

  sendInvitation() {
    if (!this.inviteUsername.trim()) return;

    this.groupService.sendInvitation(this.groupId, this.inviteUsername.trim()).subscribe({
      next: () => {
        alert('Zaproszenie wysłane!');
        this.closeInvitePopup();
        this.inviteUsername = '';
      },
      error: (err) => {
        console.error('Błąd zapraszania użytkownika', err);
        alert('Nie udało się wysłać zaproszenia.');
      }
    });
  }
}
