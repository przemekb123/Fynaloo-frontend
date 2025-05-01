import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../core/services/group.service';
import {NgIf} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-join-group',
  imports: [
    NgIf
  ],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Dołączanie do grupy...</h2>
      <p *ngIf="errorMessage" class="text-red-500">{{ errorMessage }}</p>
      <p *ngIf="successMessage" class="text-green-500">{{ successMessage }}</p>
    </div>
  `
})
export class JoinGroupPage implements OnInit {
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    const groupUrl = this.route.snapshot.paramMap.get('groupUrl');
    if (groupUrl) {
      this.groupService.joinGroupViaLink(groupUrl).subscribe({
        next: () => {
          this.successMessage = 'Pomyślnie dołączono do grupy!';
          setTimeout(() => {
            this.router.navigate(['/groups']);
          }, 2000);
        },
        error: () => {
          this.errorMessage = 'Nie udało się dołączyć do grupy. Link może być nieprawidłowy lub wygasł.';
        }
      });
    }
  }
}
