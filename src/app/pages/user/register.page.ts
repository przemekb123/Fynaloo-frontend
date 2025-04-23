import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-3xl font-bold mb-6 text-center text-pink-500">Rejestracja</h1>

        <form [formGroup]="form" (ngSubmit)="register()" class="flex flex-col gap-6">

          <div class="flex flex-col">
            <label class="mb-1 text-sm font-semibold text-gray-700">Imię</label>
            <input
              type="text"
              formControlName="firstName"
              placeholder="Podaj imię"
              class="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200"
            />
            <div *ngIf="form.get('firstName')?.invalid && form.get('firstName')?.touched" class="text-xs text-red-500 mt-1">
              Pole wymagane
            </div>
          </div>

          <div class="flex flex-col">
            <label class="mb-1 text-sm font-semibold text-gray-700">Nazwisko</label>
            <input
              type="text"
              formControlName="lastName"
              placeholder="Podaj nazwisko"
              class="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200"
            />
            <div *ngIf="form.get('lastName')?.invalid && form.get('lastName')?.touched" class="text-xs text-red-500 mt-1">
              Pole wymagane
            </div>
          </div>

          <div class="flex flex-col">
            <label class="mb-1 text-sm font-semibold text-gray-700">Nazwa użytkownika</label>
            <input
              type="text"
              formControlName="username"
              placeholder="Podaj nazwę użytkownika"
              class="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200"
            />
            <div *ngIf="form.get('username')?.invalid && form.get('username')?.touched" class="text-xs text-red-500 mt-1">
              Pole wymagane
            </div>
          </div>

          <div class="flex flex-col">
            <label class="mb-1 text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              formControlName="email"
              placeholder="Podaj email"
              class="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200"
            />
            <div *ngIf="form.get('email')?.invalid && form.get('email')?.touched" class="text-xs text-red-500 mt-1">
              {{ getEmailError() }}
            </div>
          </div>

          <div class="flex flex-col">
            <label class="mb-1 text-sm font-semibold text-gray-700">Hasło</label>
            <input
              type="password"
              formControlName="password"
              placeholder="Podaj hasło"
              class="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200"
            />
            <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="text-xs text-red-500 mt-1">
              Pole wymagane
            </div>
          </div>

          <button
            type="submit"
            [disabled]="form.invalid"
            class="bg-pink-500 hover:bg-pink-600 transition text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            Zarejestruj się
          </button>
        </form>

        <p class="text-sm text-center mt-6">
          Masz już konto?
          <a routerLink="/login" class="text-pink-600 font-semibold hover:underline">Zaloguj się</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterPage implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  register() {
    if (this.form.invalid) return;

    this.authService.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => console.error('Błąd rejestracji', err)
    });
  }

  getEmailError(): string {
    const emailControl = this.form.get('email');
    if (emailControl?.hasError('required')) {
      return 'Pole wymagane';
    }
    if (emailControl?.hasError('email')) {
      return 'Niepoprawny adres email';
    }
    return '';
  }
}
