import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FriendService } from '../../core/services/friend.service';

@Component({
  standalone: true,
  selector: 'app-add-friend-popup',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-end z-50" (click)="close()">
      <div class="bg-white w-full rounded-t-3xl p-6 pt-12 flex flex-col gap-4 relative" (click)="$event.stopPropagation()">

        <!-- Przycisk zamknięcia (X) -->
        <button (click)="close()" class="absolute top-4 right-4">
          <span class="material-icons text-gray-400 hover:text-gray-600 text-3xl">
            close
          </span>
        </button>

        <!-- Nagłówek -->
        <h2 class="text-xl font-bold text-pink-500 text-center">Dodaj znajomego</h2>

        <!-- Formularz -->
        <form [formGroup]="form" (ngSubmit)="addFriend()" class="flex flex-col gap-4">
          <input
            type="text"
            formControlName="username"
            placeholder="Nazwa użytkownika"
            class="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <div *ngIf="form.get('username')?.invalid && form.get('username')?.touched" class="text-xs text-red-500">
            Pole wymagane
          </div>

          <button
            type="submit"
            [disabled]="form.invalid"
            class="bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            Wyślij zaproszenie
          </button>
        </form>

        <div *ngIf="successMessage" class="mt-2 text-green-600 font-semibold text-center">
          {{ successMessage }}
        </div>

        <div *ngIf="errorMessage" class="mt-2 text-red-500 font-semibold text-center">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `
})
export class AddFriendPopupComponent {
  form: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private friendService: FriendService) {
    this.form = this.fb.group({
      username: ['', Validators.required]
    });
  }

  addFriend() {
    if (this.form.invalid) return;

    const username = this.form.value.username;

    this.friendService.sendFriendRequest(username).subscribe({
      next: () => {
        this.successMessage = 'Zaproszenie wysłane!';
        this.errorMessage = '';
        this.form.reset();
      },
      error: (err) => {
        this.errorMessage = 'Nie udało się wysłać zaproszenia.';
        this.successMessage = '';
        console.error('Błąd wysyłania zaproszenia', err);
      }
    });
  }

  close() {
    // Do zamknięcia popupa użyj np. @Output lub serwisu do zarządzania stanem, np. BehaviorSubject
  }
}
