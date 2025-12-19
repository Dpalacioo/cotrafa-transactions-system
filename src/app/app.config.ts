import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { frontendVersionInterceptor } from './core/interceptors/frontend-version.interceptor';
import { translateConfig } from './core/config/translate.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([frontendVersionInterceptor])),
    importProvidersFrom(translateConfig),
    provideAnimations(),
  ],
};
