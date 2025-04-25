import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {jwtInterceptor} from './app/core/interceptors/Jwt.Interceptor';


export function tokenGetter() {
  return localStorage.getItem('jwt');
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      JwtModule.forRoot({
        config: {
          tokenGetter,
          allowedDomains: ['localhost:8080', 'fynaloo-backend.onrender.com'],
          disallowedRoutes: []
        }
      })
    ),
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
});
