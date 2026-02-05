import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideMarkdown, MARKED_OPTIONS } from 'ngx-markdown';

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
        filter: filterReducer as any,
        notes: notesReducer as any,
        settings: settingsReducer as any,
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
    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: {
          gfm: true,
          breaks: false,
        },
      },
    }),
    LoggerService,
  ],
}).catch(err => {
  // Fatal bootstrap error - use console.error as LoggerService is not available yet
  console.error('Application bootstrap failed:', err);
});
