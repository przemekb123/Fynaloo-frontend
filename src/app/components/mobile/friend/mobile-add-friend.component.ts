import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {FriendService} from '../../../core/services/friend.service';


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

        <h2 class="text-lg font-bold text-center text-pink-500">Dodaj znajomego</h2>

        <form [formGroup]="form" (ngSubmit)="addFriend()" class="flex flex-col gap-4">
          <input
            type="text"
            formControlName="username"
            placeholder="Nazwa użytkownika"
            class="p-3 border rounded-lg focus:ring-2 focus:ring-pink-400"
          />
          <button type="submit" [disabled]="form.invalid"
                  class="bg-pink-500 text-white font-semibold py-3 rounded-lg hover:bg-pink-600 transition disabled:opacity-50">
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
  form: FormGroup;
  successMessage = '';
  errorMessage = '';

  @Output() closed = new EventEmitter<void>();

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
