import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideMarkdown, MARKED_OPTIONS } from 'ngx-markdown';
import { AppComponent } from './app.component';
import { filterReducer } from './filter/filter.reducer';
import { notesReducer } from './notes/notes.reducer';
import { settingsReducer } from './settings/settings.reducer';
import { FilterEffects } from './filter/filter.effects';
import { NotesEffects } from './notes/notes.effects';
import { SettingsEffects } from './settings/settings.effects';
import { LoggerService } from '@shared/services/logger.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let instance: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideStore({
          filter: filterReducer as any,
          notes: notesReducer as any,
          settings: settingsReducer as any,
        }),
        provideEffects([FilterEffects, NotesEffects, SettingsEffects]),
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
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    instance = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(instance).toBeTruthy();
  });

  it(`should have as title 'Kubernetes Release Notes'`, () => {
    expect(instance.title).toEqual('Kubernetes Release Notes');
  });
});
