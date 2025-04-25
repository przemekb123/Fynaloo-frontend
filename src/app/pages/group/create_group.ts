import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupService } from '../../core/services/group.service';
import { AuthService } from '../../core/services/auth.service';
import {MobileBottomNavbarComponent} from '../../components/shared/mobile-bottom-navbar.component';

@Component({
  standalone: true,
  selector: 'app-create-group',
  imports: [CommonModule, ReactiveFormsModule, MobileBottomNavbarComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-start items-center bg-gradient-to-b from-[#f3f1ff] via-[#f9f8ff] to-white pt-24 px-4 pb-32">
      <div class="bg-white px-6 py-8 rounded-3xl shadow-lg w-full max-w-md">
        <h1 class="text-2xl font-bold text-center text-[var(--color-mobile-add-button)] mb-6 tracking-wide">Utwórz nową grupę</h1>

        <form [formGroup]="form" (ngSubmit)="createGroup()" class="flex flex-col gap-5">
          <div class="flex flex-col">
            <label class="mb-1 text-sm font-semibold text-gray-700">Nazwa grupy</label>
            <input
              type="text"
              formControlName="groupName"
              placeholder="Wpisz nazwę grupy"
              class="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-mobile-add-button)] focus:border-transparent text-sm"
            />
            <div *ngIf="form.get('groupName')?.invalid && form.get('groupName')?.touched" class="text-xs text-red-500 mt-1">
              Pole wymagane
            </div>
          </div>

          <button
            type="submit"
            [disabled]="form.invalid"
            class="bg-[var(--color-mobile-add-button)] hover:bg-indigo-600 transition text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
          >
            Utwórz grupę
          </button>
        </form>
      </div>

      <app-bottom-navbar />
    </div>

  `
})
export class CreateGroupPage {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      groupName: ['', Validators.required]
    });
  }

  createGroup() {
    if (this.form.invalid) return;

    const request = {
      creatorId: this.authService.getCurrentUserId(), // <- pobieramy aktualnego usera
      groupName: this.form.value.groupName
    };

    this.groupService.createGroup(request).subscribe({
      next: () => this.router.navigate(['/groups']),
      error: err => console.error('Błąd tworzenia grupy', err)
    });
  }
}
