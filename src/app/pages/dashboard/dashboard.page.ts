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

    <!-- Header -->
    <app-mobile-header />
    <div class="bg-gradient-to-b from-[#f3f1ff] via-[#f9f8ff] to-white p-4 pt-10">




      <section class="pt-16 pb-24 px-4 bg-gradient-to-b from-[#f3f1ff] via-[#f9f8ff] to-white">
        <div class="text-center mb-6">
          <h2 class="text-xl font-bold text-[var(--color-mobile-add-button)]">Twoje zobowiązania:</h2>
          <p class="text-gray-600 text-sm">Zobowiązania wobec ciebie:</p>
        </div>

        <div class="flex flex-col gap-4">
          <div *ngFor="let debt of debts" class="bg-white rounded-2xl shadow-md px-4 py-3">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-[13px] font-bold text-[var(--color-mobile-add-button)]">
                  Zapłacone przez: <span class="font-medium">{{ debt.type === 'group' ? debt.paidBy : debt.creditor }}</span>
                </p>
                <p class="text-sm text-gray-700">Opis: {{ debt.description }}</p>
                <p class="text-sm mt-1">
            <span class="text-[var(--color-mobile-add-button)] font-semibold">
              {{ debt.type === 'group' ? 'Twój udział:' : 'Do zapłaty:' }}
            </span>
                  <span class="ml-1 font-bold">
                    {{ debt.type === 'group' ? (debt.yourDebt | currency:debt.currency) : (debt.amount | currency:debt.currency) }}
            </span>
                </p>
              </div>

              <div class="flex flex-col items-center gap-2">
                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-mobile-add-button)]">
                    <span
                      class="material-symbols-outlined text-white translate-y-[-1px] "
                      style="font-variation-settings: 'wght' 250, 'opsz' 24;"
                    >
                        {{ debt.type === 'group' ? 'groups' : 'person' }}
                    </span>
                </div>
                <button *ngIf="debt.type === 'group'" (click)="settleGroupDebt(debt.id)" class="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
                  <span class="material-icons-outlined text-white text-sm">check</span>
                </button>
              </div>
            </div>

            <div class="h-1 bg-gray-200 rounded-full mt-3 overflow-hidden">
              <div
                class="h-full bg-[var(--color-mobile-add-button)]"
                [style.width.%]="(debt.paidCount / debt.countAllParticipant) * 100"
              ></div>
            </div>

            <!-- Details + licznik -->
            <div class="mt-3 flex justify-between items-center text-xs text-gray-500">
              <span class="font-medium">details</span>
              <span *ngIf="debt.type === 'group'" class="text-[11px]">
                 Spłacono: {{ debt.paidCount }}/{{ debt.countAllParticipant }}
                </span>
            </div>
          </div>
        </div>
      </section>

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
