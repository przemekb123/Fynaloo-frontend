import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-mobile-expense-details-popup',
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" (click)="closePopup()">
      <div class="bg-white w-full max-w-md rounded-3xl p-6 shadow-lg relative" (click)="$event.stopPropagation()">

        <button (click)="closePopup()" class="absolute top-4 right-4">
          <span class="material-icons text-gray-400 hover:text-gray-600 text-3xl">close</span>
        </button>

        <h2 class="text-2xl font-bold text-center text-[var(--color-mobile-add-button)] mb-6">
          Szczegóły wydatku
        </h2>

        <div class="flex flex-col gap-4 text-sm text-gray-700">
          <div>
            <p class="font-semibold">Opis:</p>
            <p>{{ expense?.description }}</p>
          </div>

          <div>
            <p class="font-semibold">Kwota:</p>
            <p>{{ expense?.amount | currency:expense?.currency }}</p>
          </div>

          <div>
            <p class="font-semibold">Zapłacone przez:</p>
            <p>{{ expense?.paidBy }}</p>
          </div>

          <div>
            <p class="font-semibold">Uczestnicy:</p>
            <div *ngIf="expense?.participants?.length > 0; else noParticipants" class="flex flex-col gap-2 mt-2">
              <div *ngFor="let participant of expense.participants" class="flex justify-between items-center">
                <span>{{ participant.username }}</span>
                <div class="flex items-center gap-2">
                  <span class="font-semibold">{{ participant.shareAmount | number:'1.2-2' }} {{ expense?.currency }}</span>
                  <span
                    class="material-icons text-sm"
                    [ngClass]="participant.settled ? 'text-green-500' : 'text-red-400'">
                    {{ participant.settled ? 'check_circle' : 'pending' }}
                  </span>
                </div>
              </div>
            </div>
            <ng-template #noParticipants>
              <p class="text-gray-400 text-xs mt-2">Brak uczestników.</p>
            </ng-template>
          </div>
        </div>

      </div>
    </div>
  `
})
export class MobileExpenseDetailsComponent {
  @Input() expense: any | null = null;
  @Output() closed = new EventEmitter<void>();

  closePopup() {
    this.closed.emit();
  }
}
