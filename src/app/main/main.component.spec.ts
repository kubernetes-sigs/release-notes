import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideMarkdown, MARKED_OPTIONS } from 'ngx-markdown';
import { MainComponent } from './main.component';
import { filterReducer } from '@app/filter/filter.reducer';
import { notesReducer } from '@app/notes/notes.reducer';
import { settingsReducer } from '@app/settings/settings.reducer';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideStore({
          filter: filterReducer as any,
          notes: notesReducer as any,
          settings: settingsReducer as any,
        }),
        provideMarkdown({
          markedOptions: {
            provide: MARKED_OPTIONS,
            useValue: {
              gfm: true,
              breaks: false,
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should succeed to open the modal view', () => {
    component.openModal();
  });
});
