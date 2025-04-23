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
    <div class="min-h-screen flex flex-col justify-center items-center bg-white-100 p-4">
      <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-3xl font-bold mb-6 text-center text-pink-500">Utwórz grupę</h1>

        <form [formGroup]="form" (ngSubmit)="createGroup()" class="flex flex-col gap-6">

          <div class="flex flex-col">
            <label class="mb-1 text-sm font-semibold text-gray-700">Nazwa grupy</label>
            <input
              type="text"
              formControlName="groupName"
              placeholder="Wpisz nazwę grupy"
              class="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200"
            />
            <div *ngIf="form.get('groupName')?.invalid && form.get('groupName')?.touched" class="text-xs text-red-500 mt-1">
              Pole wymagane
            </div>
          </div>

          <button
            type="submit"
            [disabled]="form.invalid"
            class="bg-pink-500 hover:bg-pink-600 transition text-white py-3 rounded-lg font-semibold disabled:opacity-50"
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
