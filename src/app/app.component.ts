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
    this.authService.checkAuth().subscribe(response => {
      if (response.user) {
        console.log('Zalogowany jako:', response.user.username);
      } else {
        console.log('Brak aktywnej sesji');
      }
    });
  }
}
