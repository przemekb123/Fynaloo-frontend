import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MobileBottomNavbarComponent } from '../../components/shared/mobile-bottom-navbar.component';
import { Router } from '@angular/router';
import { ExpenseService } from '../../core/services/expense.service';
import { MobileHeaderComponent } from '../../components/shared/mobile-header.component';
import { CurrencyService } from '../../core/services/currency.service';
import { FormsModule } from '@angular/forms';
import {MobileExpenseDetailsComponent} from '../../components/mobile/expense/mobile-expense-details.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, MobileBottomNavbarComponent, MobileHeaderComponent, FormsModule, MobileExpenseDetailsComponent],
  template: `
    <!-- Header -->
    <app-mobile-header />
    <div class="min-h-screen bg-gradient-to-b from-[#f3f1ff] via-[#f9f8ff] to-white p-4 pt-10">

      <section class="pt-16 pb-24 px-4">
        <div class="text-center mb-6">
          <h2 class="text-xl mb-4 font-bold text-[var(--color-mobile-add-button)]">Twoje zobowiązania:</h2>
          <p class="text-gray-600 text-sm">Zobowiązania wobec ciebie:</p>
        </div>

        <!-- Lista rozwijana -->
        <div class="mt-2 mb-10">
          <select
            [(ngModel)]="selectedOption"
            class="w-full py-2 px-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-mobile-add-button)] text-sm text-gray-700"
          >
            <option value="all">Twoje długi</option>
            <option value="yourDue">Twoje należności</option>
            <option value="manual">Archiwum</option>
          </select>
        </div>

        <div class="flex flex-col gap-4">
          <div *ngIf="filteredDebts().length === 0" class="text-center text-gray-500 mt-12 flex flex-col items-center gap-4">
              <span class="material-symbols-outlined text-6xl text-gray-300">
                {{ getEmptyStateIcon() }}
              </span>
            <p class="text-sm mt-2">{{ getEmptyStateText() }}</p>
          </div>
          <div *ngFor="let debt of filteredDebts()"
               [ngClass]="{
                 'bg-white': selectedOption !== 'manual',
                 'bg-gray-100': selectedOption === 'manual'
               }"
               class="rounded-2xl shadow-md px-4 py-3">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-[13px] font-bold text-[var(--color-mobile-add-button)]">
                  Zapłacone przez: <span class="font-medium">{{ debt.type === 'group' ? debt.paidBy : debt.creditor }}</span>
                </p>
                <p class="text-sm" [ngClass]="selectedOption === 'manual' ? 'text-gray-500' : 'text-gray-700'">
                  Opis: {{ debt.description }}
                </p>
                <p class="text-sm mt-1">
                    <span class="text-[var(--color-mobile-add-button)] font-semibold">
                      {{ debt.type === 'group' ? 'Twój udział:' : 'Do zapłaty:' }}
                      <span class="ml-1 font-bold">
                    <ng-container *ngIf="debt.currency !== 'PLN'; else onlyPln">
                      {{ getDisplayAmount(debt) | currency:debt.currency }}
                      ({{ getAmountInPln(debt) | number:'1.2-2' }} PLN)
                    </ng-container>
                    <ng-template #onlyPln>
                      {{ getDisplayAmount(debt) | currency:'PLN' }}
                    </ng-template>
                  </span>
                    </span>
                </p>

              </div>

              <div class="flex flex-col items-center gap-2">
                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-mobile-add-button)]">
                  <span
                    class="material-symbols-outlined text-white translate-y-[-1px]"
                    style="font-variation-settings: 'wght' 250, 'opsz' 24;">
                    {{ debt.type === 'group' ? 'groups' : 'person' }}
                  </span>
                </div>

                <!-- Przycisk spłaty dla długu, jeśli nie w archiwum -->
                <button *ngIf="!debt.settled && selectedOption !== 'manual'"
                        (click)="settleDebt(debt)"
                        class="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
                  <span class="material-icons-outlined text-white text-sm">check</span>
                </button>

                <!-- Archiwum - ikona ✓ -->
                <div *ngIf="debt.settled && selectedOption === 'manual'"
                     class="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
                  <span class="material-icons-outlined text-white text-sm">done</span>
                </div>
              </div>
            </div>

            <div class="h-1 bg-gray-200 rounded-full mt-3 overflow-hidden">
              <div
                [ngClass]="{
                  'bg-[var(--color-mobile-add-button)]': selectedOption !== 'manual',
                  'bg-gray-400': selectedOption === 'manual'
                }"
                class="h-full"
                [style.width.%]="(debt.paidCount / debt.countAllParticipant) * 100">
              </div>
            </div>

            <!-- Details + licznik -->
            <div class="mt-3 flex justify-between items-center text-xs text-gray-500">
                <span class="font-medium cursor-pointer text-[var(--color-mobile-add-button)]"
                    (click)="openDetails(debt)">
                        details
                </span>
              <span *ngIf="debt.type === 'group'" class="text-[11px]">
                Spłacono: {{ debt.paidCount }}/{{ debt.countAllParticipant }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <app-bottom-navbar></app-bottom-navbar>
    </div>

    <app-mobile-expense-details-popup *ngIf="showExpenseDetails"  [expense]="selectedExpense"  (closed)="closeDetails()"/>

  `
})
export class DashboardPage implements OnInit {
  username = '';
  debts: any[] = [];
  exchangeRates: { [currency: string]: number } = {};
  selectedCurrency: string = 'PLN';
  selectedOption: string = 'all';
  showExpenseDetails = false;
  selectedExpense: any | null = null;


  constructor(private authService: AuthService, private expenseService: ExpenseService, private router: Router, private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.username = this.authService.getCurrentUsername();
    this.loadDebts();
  }

  loadDebts() {
    const userId = this.authService.getCurrentUserId();

    this.expenseService.getExpensesForUser(userId).subscribe(expenses => {
      this.expenseService.getManualDebtsForUser(userId).subscribe(debts => {
        this.debts = [...expenses, ...debts];

        const uniqueCurrencies = new Set(this.debts.map(d => d.currency));
        uniqueCurrencies.forEach(currency => {
          this.currencyService.getExchangeRate(currency).subscribe(rate => {
            this.exchangeRates[currency] = rate;
          });
        });
      });
    });
  }

  settleDebt(debt: any): void {
    if (debt.type === 'group') {
      this.expenseService.settleExpense(debt.id).subscribe({
        next: () => this.loadDebts(),
        error: err => console.error('Błąd przy spłacie grupowego długu', err)
      });
    } else {
      this.expenseService.settleManualDebt(debt.id).subscribe({
        next: () => this.loadDebts(),
        error: err => console.error('Błąd przy spłacie manualnego długu', err)
      });
    }
  }

  getAmountInPln(debt: any): number {
    const amount = debt.type === 'group' ? debt.yourDebt : debt.amount;
    const rate = this.exchangeRates[debt.currency];
    return rate ? amount / rate : amount;
  }



  filteredDebts(): any[] {
    if (this.selectedOption === 'all') {
      // Twoje niespłacone długi
      return this.debts.filter(d =>
        (d.type === 'group' || d.type === 'personal') &&
        !d.settled &&
        !d.isCreditor
      );
    } else if (this.selectedOption === 'yourDue') {
      // Twoje należności
      return this.debts.filter(d =>
        (d.type === 'group' || d.type === 'personal') &&
        !d.settled &&
        d.isCreditor
      );
    } else if (this.selectedOption === 'manual') {
      // Wszystko co spłacone
      return this.debts.filter(d => d.settled);
    } else {
      return [];
    }
  }


  getDisplayAmount(debt: any): number {
    if (this.selectedOption === 'manual' && debt.amountPaid !== undefined) {
      return debt.amountPaid;
    }
    return debt.type === 'group' ? debt.yourDebt : debt.amount;
  }

  getEmptyStateText(): string {
    if (this.selectedOption === 'all') {
      return 'Nie masz żadnych długów.';
    } else if (this.selectedOption === 'yourDue') {
      return 'Nie masz żadnych należności.';
    } else if (this.selectedOption === 'manual') {
      return 'Archiwum jest puste.';
    } else {
      return '';
    }
  }

  getEmptyStateIcon(): string {
    if (this.selectedOption === 'all') {
      return 'credit_card_off'; // brak długów
    } else if (this.selectedOption === 'yourDue') {
      return 'account_balance_wallet'; // brak należności
    } else if (this.selectedOption === 'manual') {
      return 'folder_off'; // puste archiwum
    } else {
      return 'info';
    }
  }


  openDetails(debt: any) {
    this.selectedExpense = debt;
    this.showExpenseDetails = true;
  }

  closeDetails() {
    this.showExpenseDetails = false;
    this.selectedExpense = null;
  }
}
