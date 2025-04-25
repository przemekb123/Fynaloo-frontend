import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FriendService } from '../../../core/services/friend.service';

@Component({
  standalone: true,
  selector: 'app-mobile-add-friend',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-end z-50" (click)="closePopup()">
      <div class="bg-white w-full rounded-t-3xl p-6 pt-12 flex flex-col gap-4 relative" (click)="$event.stopPropagation()">

        <button (click)="closePopup()" class="absolute top-4 right-4">
          <span class="material-icons text-gray-400 hover:text-gray-600 text-3xl">close</span>
        </button>

        <h2 class="text-lg font-bold text-center text-[var(--color-mobile-add-button)]">Dodaj znajomego</h2>

        <form [formGroup]="form" (ngSubmit)="addFriend()" class="flex flex-col gap-4">
          <input
            type="text"
            formControlName="username"
            placeholder="Nazwa użytkownika"
            class="p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-mobile-add-button)]"
          />

          <div *ngIf="form.get('username')?.invalid && form.get('username')?.touched" class="text-xs text-red-500">
            Pole wymagane
          </div>

          <div *ngIf="selfInviteError" class="text-xs text-red-500">
            Nie możesz zaprosić samego siebie.
          </div>

          <button
            type="submit"
            [disabled]="form.invalid"
            class="bg-[var(--color-mobile-add-button)] text-white font-semibold py-3 rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
          >
            Wyślij zaproszenie
          </button>
        </form>

        <p *ngIf="successMessage" class="text-green-500 text-sm text-center">{{ successMessage }}</p>
        <p *ngIf="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>
      </div>
    </div>
  `
})
export class MobileAddFriendComponent {
  @Input() currentUsername = ''; // ← aktualny użytkownik
  @Output() closed = new EventEmitter<void>();

  form: FormGroup;
  successMessage = '';
  errorMessage = '';
  selfInviteError = false;

  constructor(private fb: FormBuilder, private friendService: FriendService) {
    this.form = this.fb.group({
      username: ['', Validators.required]
    });
  }

  addFriend() {
    if (this.form.invalid) return;

    const username = this.form.value.username.trim();

    if (username === this.currentUsername) {
      this.selfInviteError = true;
      this.successMessage = '';
      this.errorMessage = '';
      return;
    }

    this.selfInviteError = false;

    this.friendService.sendFriendRequest(username).subscribe({
      next: () => {
        this.successMessage = 'Zaproszenie wysłane!';
        this.errorMessage = '';
        this.form.reset();
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = 'Nie udało się wysłać zaproszenia.';
      }
    });
  }

  closePopup() {
    this.closed.emit();
  }
}
