import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {GroupService} from '../../../core/services/group.service';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-mobile-create-group',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-end z-50" (click)="closePopup()">
      <div class="bg-white w-full rounded-t-3xl p-6 pt-12 flex flex-col gap-4 relative" (click)="$event.stopPropagation()">
        <button (click)="closePopup()" class="absolute top-4 right-4">
          <span class="material-icons text-gray-400 hover:text-gray-600 text-3xl">close</span>
        </button>

        <h2 class="text-lg font-bold text-center text-pink-500">Utwórz nową grupę</h2>

        <form [formGroup]="form" (ngSubmit)="createGroup()" class="flex flex-col gap-4">
          <input
            type="text"
            formControlName="groupName"
            placeholder="Nazwa grupy"
            class="p-3 border rounded-lg focus:ring-2 focus:ring-pink-400"
          />

          <button
            type="submit"
            [disabled]="form.invalid"
            class="bg-pink-500 text-white font-semibold py-3 rounded-lg hover:bg-pink-600 transition disabled:opacity-50"
          >
            Utwórz grupę
          </button>
        </form>

        <p *ngIf="successMessage" class="text-green-500 text-sm text-center">{{ successMessage }}</p>
        <p *ngIf="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>
      </div>
    </div>
  `
})
export class MobileCreateGroupComponent {
  @Output() closed = new EventEmitter<void>();

  form: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      groupName: ['', Validators.required]
    });
  }

  createGroup() {
    if (this.form.invalid) return;

    const request = {
      creatorId: this.authService.getCurrentUserId(),
      groupName: this.form.value.groupName
    };

    this.groupService.createGroup(request).subscribe({
      next: () => {
        this.successMessage = 'Grupa została utworzona!';
        this.form.reset();
        setTimeout(() => this.closePopup(), 1000);
      },
      error: err => {
        console.error('Błąd tworzenia grupy', err);
        this.errorMessage = 'Nie udało się utworzyć grupy.';
      }
    });
  }

  closePopup() {
    this.closed.emit();
  }
}
