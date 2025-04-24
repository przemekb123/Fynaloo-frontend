// mobile-add-expense.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {ExpenseParticipantModel} from '../../../models/DTO/expense-participant.model';
import {GroupService} from '../../../core/services/group.service';
import {ExpenseService} from '../../../core/services/expense.service';
import {AuthService} from '../../../core/services/auth.service';
import {ExpanseRequest} from '../../../models/Requests/expense-request';
import {CurrencyModel} from '../../../models/Enums/currency.model';


@Component({
  standalone: true,
  selector: 'app-mobile-add-expense',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-end z-50" (click)="closePopup()">
      <div class="bg-white w-full rounded-t-3xl p-6 pt-10 pb-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto relative" (click)="$event.stopPropagation()">
        
        <button (click)="closePopup()" class="absolute top-4 right-4">
          <span class="material-icons text-gray-400 hover:text-gray-600 text-3xl">close</span>
        </button>

        <h2 class="text-xl font-semibold text-center text-pink-500">Nowy wydatek</h2>

        <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4 text-sm">
          <label class="text-sm font-medium">Grupa</label>
          <select formControlName="groupId" (change)="onGroupChange($event)" class="border p-3 rounded-lg">
            <option value="">Wybierz grupę</option>
            <option *ngFor="let group of groups" [value]="group.groupId">{{ group.groupName }}</option>
          </select>

          <label class="text-sm font-medium">Kwota</label>
          <input type="number" formControlName="amount" placeholder="Np. 120.00" class="p-3 border rounded-lg" />

          <label class="text-sm font-medium">Waluta</label>
          <select formControlName="currency" class="p-3 border rounded-lg">
            <option value="">Wybierz walutę</option>
            <option *ngFor="let cur of currencyValues" [value]="cur">{{ cur }}</option>
          </select>

          <label class="text-sm font-medium">Opis</label>
          <input type="text" formControlName="description" placeholder="Np. Pizza, bilety..." class="p-3 border rounded-lg" />

          <label class="text-sm font-medium">Dodaj uczestnika</label>
          <select (change)="onParticipantSelect($event)" class="border p-3 rounded-lg">
            <option value="">Wybierz uczestnika</option>
            <option *ngFor="let member of selectedGroupMembers" [value]="member.userId">
              {{ member.username }}
            </option>
          </select>

          <div class="flex flex-wrap gap-2">
            <div *ngFor="let participant of selectedParticipants"
                 class="flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-1 text-sm shadow-sm">
              <span>{{ getUsernameById(participant.userId) }}</span>
              <button type="button"
                      (click)="removeParticipant(participant.userId)"
                      class="w-5 h-5 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-full text-xs font-bold">
                &times;
              </button>
            </div>
          </div>



          <button type="submit" [disabled]="form.invalid || selectedParticipants.length === 0"
                  class="bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition disabled:opacity-50">
            Dodaj wydatek
          </button>
        </form>
      </div>
    </div>

  `
})
export class MobileAddExpenseComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();

  form: FormGroup;
  groups: any[] = [];
  selectedGroupMembers: any[] = [];
  selectedParticipants: ExpenseParticipantModel[] = [];

  readonly currencyValues = Object.values(CurrencyModel)

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private expenseService: ExpenseService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      groupId: ['', Validators.required],
      amount: [0, Validators.required],
      currency: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.groupService.getGroupsForUser(this.authService.getCurrentUserId()).subscribe(groups => {
      this.groups = groups;
    });
  }

  onGroupChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const groupId = Number(target.value);

    if (!groupId) {
      this.selectedGroupMembers = [];
      return;
    }

    const selectedGroup = this.groups.find(g => g.groupId === groupId);
    if (selectedGroup) {
      this.selectedGroupMembers = selectedGroup.members ?? [];
    } else {
      this.selectedGroupMembers = [];
    }
    this.selectedParticipants = [];
  }


  onParticipantSelect(event: Event) {
    const userId = Number((event.target as HTMLSelectElement).value);
    if (!userId || this.selectedParticipants.find(p => p.userId === userId)) return;

    this.selectedParticipants.push({
      userId: userId,
      shareAmount: 0,
      settled: false
    });
  }

  getUsernameById(userId: number): string {
    const user = this.selectedGroupMembers.find(u => u.userId === userId);
    return user?.username || 'Użytkownik';
  }

  removeParticipant(userId: number) {
    this.selectedParticipants = this.selectedParticipants.filter(p => p.userId !== userId);
  }


  submit() {
    const request: ExpanseRequest = {
      groupId: this.form.value.groupId,
      paidBy: this.authService.getCurrentUsername(),
      amount: this.form.value.amount,
      currency: this.form.value.currency,
      description: this.form.value.description,
      participants: this.selectedParticipants
    };

    this.expenseService.createExpense(request).subscribe({
      next: () => this.closePopup(),
      error: err => console.error('Błąd dodawania wydatku', err)
    });
  }

  closePopup() {
    this.closed.emit();
  }
}
