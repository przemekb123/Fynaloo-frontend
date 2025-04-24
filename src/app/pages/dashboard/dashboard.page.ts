import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { MobileBottomNavbarComponent } from '../../components/shared/bottom-navbar/bottom-navbar.component';
import { AuthService } from '../../core/services/auth.service';
import {MobileBottomNavbarComponent} from '../../components/shared/mobile-bottom-navbar.component';
import {Router} from '@angular/router';
import {ExpenseService} from '../../core/services/expense.service';
import {MobileHeaderComponent} from '../../components/shared/mobile-header.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, MobileBottomNavbarComponent, MobileHeaderComponent],
  template: `
    <div class="min-h-screen bg-white-100 p-4">

      <!-- Header -->
      <app-mobile-header />

      <!-- Section Title -->
      <div class="mb-4 text-center">
        <h2 class="text-lg font-semibold">Twoje zobowiązania:</h2>
        <h3 class="text-md text-gray-600">Zobowiązania wobec ciebie:</h3>
      </div>

      <hr class="border-gray-300 mb-6" />

      <!-- Lista długów -->
      <div class="flex flex-col gap-6">

        <div *ngFor="let debt of debts" class="border rounded-xl bg-white shadow-sm p-4 flex flex-col gap-2">

          <div class="flex justify-between items-center">
            <div>
              <div *ngIf="debt.type === 'group'" class="font-semibold text-gray-700">
                Zapłacone przez: <span class="font-normal">{{ debt.paidBy }}</span>
              </div>
              <div *ngIf="debt.type === 'group'" class="font-semibold text-gray-700">
                Opis: <span class="font-normal">{{ debt.description }}</span>
              </div>
              <div *ngIf="debt.type === 'personal'" class="font-semibold text-gray-700">
                Zapłacone przez: <span class="font-normal">{{ debt.creditor }}</span>
              </div>
              <div *ngIf="debt.type === 'personal'" class="font-semibold text-gray-700">
                Opis: <span class="font-normal">{{ debt.description }}</span>
              </div>
            </div>

            <span class="material-icons text-3xl text-gray-700">
              {{ debt.type === 'group' ? 'groups' : 'person' }}
            </span>
          </div>


          <div *ngIf="debt.type === 'group'" class="text-sm text-gray-700">
            Twój udział: <span class="font-bold">{{ debt.yourDebt | currency:'PLN' }}</span>
          </div>
          <div *ngIf="debt.type === 'personal'" class="text-sm text-gray-700">
            Do zapłaty: <span class="font-bold">{{ debt.amount | currency:'PLN' }}</span>
          </div>

          <!-- Licznik dla grupowego długu -->
          <div *ngIf="debt.type === 'group'" class="text-xs text-gray-500">
            {{ debt.paidCount }}/{{ debt.countAllParticipant}}
          </div>



          <!-- Przycisk "details" -->
          <div class="flex justify-between items-center mt-2">
            <span class="text-sm font-semibold text-gray-700">details</span>

            <button class="flex items-center gap-1 text-green-500" *ngIf="debt.type === 'group'" (click)="settleGroupDebt(debt.id)">
              <span class="material-icons text-2xl">check_circle</span>
            </button>
          </div>

        </div>

      </div>
        <app-bottom-navbar></app-bottom-navbar>
    </div>
  `
})
export class DashboardPage implements OnInit {
  username = '';
  debts: any[] = [];


  constructor(private authService: AuthService, private expenseService: ExpenseService, private router: Router) {}

  ngOnInit(): void {
    // Jeśli użytkownik już zalogowany — pobierz dane
    this.username = this.authService.getCurrentUsername();
    this.loadDebts();
  }

  loadDebts() {
    const userId = this.authService.getCurrentUserId();

    this.expenseService.getExpensesForUser(userId).subscribe(expenses => {
      this.expenseService.getManualDebtsForUser(userId).subscribe(debts => {
        this.debts = [...expenses, ...debts];
      });
    });
  }

  settleGroupDebt(expenseId: number): void {
    this.expenseService.settleExpense(expenseId).subscribe({
      next: () => this.loadDebts(),
      error: err => console.error('Błąd przy spłacie długu', err)
    });
  }
}
