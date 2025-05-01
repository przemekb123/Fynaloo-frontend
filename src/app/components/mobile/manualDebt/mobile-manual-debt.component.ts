import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ManualDebtService } from '../../../core/services/manualDebt.service';
import { AuthService } from '../../../core/services/auth.service';
import { FriendService } from '../../../core/services/friend.service';
import { ManualDebtRequest } from '../../../models/Requests/manual-debt-request';
import { FriendModel } from '../../../models/DTO/friend.model';
import { CurrencyModel } from '../../../models/Enums/currency.model';

@Component({
  standalone: true,
  selector: 'app-mobile-manual-debt',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-end z-50" (click)="closePopup()">
      <div class="bg-white w-full rounded-t-3xl p-6 pt-12 flex flex-col gap-4 relative" (click)="$event.stopPropagation()">
        <button (click)="closePopup()" class="absolute top-4 right-4">
          <span class="material-icons text-gray-400 hover:text-gray-600 text-3xl">close</span>
        </button>

        <h2 class="text-lg font-bold text-center text-pink-500">Dodaj ręczny dług</h2>

        <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
          <label class="text-sm font-medium">Wybierz dłużnika</label>
          <select formControlName="debtor" class="p-3 border rounded-lg">
            <option value="">Wybierz znajomego</option>
            <option *ngFor="let friend of friends" [value]="friend.username">{{ friend.username }}</option>
          </select>

          <label class="text-sm font-medium">Kwota</label>
          <input type="number" formControlName="amount" placeholder="Np. 50.00" class="p-3 border rounded-lg" />

          <label class="text-sm font-medium">Waluta</label>
          <select formControlName="currency" class="p-3 border rounded-lg">
            <option value="">Wybierz walutę</option>
            <option *ngFor="let cur of currencyValues" [value]="cur">{{ cur }}</option>
          </select>

          <label class="text-sm font-medium">Opis</label>
          <input type="text" formControlName="description" placeholder="Np. zwrot za obiad" class="p-3 border rounded-lg" />

          <button type="submit" [disabled]="form.invalid"
                  class="bg-pink-500 text-white font-semibold py-3 rounded-lg hover:bg-pink-600 transition disabled:opacity-50">
            Dodaj dług
          </button>
        </form>
      </div>
    </div>
  `
})
export class MobileManualDebtComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();

  form: FormGroup;
  friends: FriendModel[] = [];
  readonly currencyValues = Object.values(CurrencyModel); // ← dodane!

  constructor(
    private fb: FormBuilder,
    private manualDebtService: ManualDebtService,
    private authService: AuthService,
    private friendService: FriendService
  ) {
    this.form = this.fb.group({
      debtor: ['', Validators.required],
      amount: [0, Validators.required],
      currency: ['', Validators.required], // ← nowy walidator!
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.friendService.listFriends().subscribe({
      next: (friends) => {
        const currentUser = this.authService.getCurrentUsername();
        this.friends = friends.filter(f => f.username !== currentUser);
      }
    });
  }

  submit() {
    const request: ManualDebtRequest = {
      debtor: this.form.value.debtor,
      creditor: this.authService.getCurrentUsername(),
      amount: this.form.value.amount,
      currency: this.form.value.currency, // ← dodane!
      description: this.form.value.description,
    };

    this.manualDebtService.addManualDebt(request).subscribe({
      next: () => this.closePopup(),
      error: err => console.error('Błąd dodawania długu', err)
    });
  }

  closePopup() {
    this.closed.emit();
  }
}
