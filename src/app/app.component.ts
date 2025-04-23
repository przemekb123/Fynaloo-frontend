import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthService} from './core/services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})


export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.checkAuth().subscribe({
      next: (user) => console.log('Zalogowany jako:', user.username),
      error: (err) => console.log('Brak aktywnej sesji')
    });
  }
}
