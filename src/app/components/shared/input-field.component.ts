import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-input-field',
  imports: [CommonModule, ReactiveFormsModule, FormControl],
  template: `
    <div class="flex flex-col gap-1">
      <label *ngIf="label" class="text-sm font-semibold text-gray-700">{{ label }}</label>
      <input
        [type]="type"
        [placeholder]="placeholder"
        [formControl]="control"
        class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200"
      />
      <div *ngIf="shouldShowError" class="text-red-500 text-xs mt-1">
        {{ errorMessage }}
      </div>
    </div>
  `
})
export class InputFieldComponent {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() control!: FormControl;

  get shouldShowError(): boolean {
    return this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }

  get errorMessage(): string {
    if (!this.control || !this.control.errors) return '';

    if (this.control.errors['required']) {
      return 'To pole jest wymagane.';
    }
    if (this.control.errors['email']) {
      return 'Wprowadź poprawny adres email.';
    }
    return 'Nieprawidłowa wartość.';
  }
}
