import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideServiceWorker } from '@angular/service-worker';

import { AppComponent } from './app/app.component';
import { environment } from '@env/environment';
import { LoggerService } from '@shared/services/logger.service';
import { filterReducer } from './app/filter/filter.reducer';
import { notesReducer } from './app/notes/notes.reducer';
import { settingsReducer } from './app/settings/settings.reducer';
import { FilterEffects } from './app/filter/filter.effects';
import { NotesEffects } from './app/notes/notes.effects';
import { SettingsEffects } from './app/settings/settings.effects';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([]),
    provideHttpClient(),
    provideStore(
      {
        filter: filterReducer,
        notes: notesReducer,
        settings: settingsReducer,
      },
      {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
        },
      },
    ),
    provideEffects([FilterEffects, NotesEffects, SettingsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
    LoggerService,
  ],
}).catch(err => {
  // Fatal bootstrap error - use console.error as LoggerService is not available yet
  console.error('Application bootstrap failed:', err);
});
