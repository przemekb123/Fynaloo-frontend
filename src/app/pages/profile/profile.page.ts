import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import { MobileBottomNavbarComponent } from '../../components/shared/mobile-bottom-navbar.component';
import { AuthService } from '../../core/services/auth.service';
import {MobileHeaderComponent} from '../../components/shared/mobile-header.component';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, MobileBottomNavbarComponent, MobileHeaderComponent],
  template: `
    <app-mobile-header />
        <div class="min-h-screen bg-gradient-to-b from-[#f3f1ff] via-[#f9f8ff] to-white pt-24 pb-32 px-4">



        </div>
    <!-- Bottom navbar -->
    <app-bottom-navbar/>
  `
})
export class ProfilePage implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
  }
}
