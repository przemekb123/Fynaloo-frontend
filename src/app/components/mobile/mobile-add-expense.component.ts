// mobile-add-expense.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {ExpenseParticipantModel} from '../../models/DTO/expense-participant.model';
import {GroupService} from '../../core/services/group.service';
import {ExpenseService} from '../../core/services/expense.service';
import {AuthService} from '../../core/services/auth.service';
import {ExpanseRequest} from '../../models/Requests/expense-request';


@Component({
  standalone: true,
  selector: 'app-mobile-add-expense',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-end z-50" (click)="closePopup()">
      <div class="bg-white w-full rounded-t-3xl p-6 pt-12 flex flex-col gap-4 relative" (click)="$event.stopPropagation()">
        <button (click)="closePopup()" class="absolute top-4 right-4">
          <span class="material-icons text-gray-400 hover:text-gray-600 text-3xl">close</span>
        </button>

        <h2 class="text-lg font-bold text-center text-pink-500">Dodaj wydatek grupowy</h2>

        <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
          <select formControlName="groupId" (change)="onGroupChange($event)" class="border p-2 rounded">
            <option value="">Wybierz grupę</option>
            <option *ngFor="let group of groups" [value]="group.groupId">{{ group.groupName }}</option>
          </select>

          <input type="number" formControlName="amount" placeholder="Kwota" class="p-3 border rounded-lg" />
          <input type="text" formControlName="currency" placeholder="Waluta" class="p-3 border rounded-lg" />
          <input type="text" formControlName="description" placeholder="Opis" class="p-3 border rounded-lg" />

          <div *ngIf="selectedGroupMembers.length > 0" class="border p-2 rounded">
            <p class="font-semibold mb-2">Uczestnicy:</p>
            <div *ngFor="let member of selectedGroupMembers" class="flex items-center gap-2">
              <input
                type="checkbox"
                [value]="member.userId"
                (change)="toggleParticipant(member)"
              />
              <label>{{ member.username }}</label>
            </div>
          </div>

          <button type="submit" [disabled]="form.invalid || selectedParticipants.length === 0"
                  class="bg-pink-500 text-white font-semibold py-3 rounded-lg hover:bg-pink-600 transition disabled:opacity-50">
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

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private expenseService: ExpenseService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      groupId: ['', Validators.required],
      amount: [0, Validators.required],
      currency: ['PLN', Validators.required],
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

    toggleParticipant(member: any) {
    const exists = this.selectedParticipants.find(p => p.userId === member.userId);
    if (exists) {
      this.selectedParticipants = this.selectedParticipants.filter(p => p.userId !== member.userId);
    } else {
      this.selectedParticipants.push({
        userId: member.userId,
        shareAmount: 0,
        settled: false
      });
    }
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
