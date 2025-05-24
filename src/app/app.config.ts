import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig } from '@angular/material/snack-bar';
import { JwtModule } from '@auth0/angular-jwt';

export const STORAGE_TOKEN_KEY = 'todo-socket';
export function tokenGetter() {
  return localStorage.getItem(STORAGE_TOKEN_KEY);
}
export const snackBarConfig: MatSnackBarConfig = {
  duration: 2500,
  horizontalPosition: 'right',
  verticalPosition: 'top'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: snackBarConfig
    },
    importProvidersFrom(JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:3000']
      }
    }))
  ]
};
