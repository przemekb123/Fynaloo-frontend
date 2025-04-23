import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-3xl font-bold mb-6 text-center text-pink-500">Logowanie</h1>

        <form [formGroup]="form" (ngSubmit)="login()" class="flex flex-col gap-6">

          <div class="flex flex-col">
            <label class="mb-1 text-sm font-semibold text-gray-700">Nazwa użytkownika</label>
            <input
              type="text"
              formControlName="username"
              placeholder="Wpisz nazwę użytkownika"
              class="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200"
            />
            <div *ngIf="form.get('username')?.invalid && form.get('username')?.touched" class="text-xs text-red-500 mt-1">
              Pole wymagane
            </div>
          </div>

          <div class="flex flex-col">
            <label class="mb-1 text-sm font-semibold text-gray-700">Hasło</label>
            <input
              type="password"
              formControlName="password"
              placeholder="Wpisz hasło"
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
            Zaloguj się
          </button>
        </form>

        <p class="text-sm text-center mt-6">
          Nie masz konta?
          <a routerLink="/register" class="text-pink-600 font-semibold hover:underline">Zarejestruj się</a>
        </p>
      </div>
    </div>
  `
})
export class LoginPage implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.form.invalid) return;

    this.authService.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => console.error('Błąd logowania', err)
    });
  }
}
