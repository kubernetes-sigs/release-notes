import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { FormsModule } from '@angular/forms';
import { StoreModule, combineReducers } from '@ngrx/store';
import { NgxPaginationModule } from 'ngx-pagination';
import { MainComponent } from './main.component';
import { NotesComponent } from '@app/notes/notes.component';
import { FilterComponent } from '@app/filter/filter.component';
import { ModalComponent } from '@app/modal/modal.component';
import { SettingsComponent } from '@app/settings/settings.component';
import { filterReducer } from '@app/filter/filter.reducer';
import { notesReducer } from '@app/notes/notes.reducer';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { settingsReducer } from '@app/settings/settings.reducer';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterComponent,
        MainComponent,
        ModalComponent,
        NotesComponent,
        SettingsComponent,
      ],
      imports: [
        FontAwesomeModule,
        FormsModule,
        MarkdownModule.forRoot({
          markedOptions: {
            provide: MarkedOptions,
            useValue: {
              gfm: true,
              tables: true,
              breaks: false,
              pedantic: false,
              sanitize: false,
              smartLists: true,
              smartypants: false,
            },
          },
        }),
        NgxPaginationModule,
        NgbModule,
        RouterTestingModule,
        StoreModule.forRoot({
          filter: combineReducers(filterReducer),
          notes: combineReducers(notesReducer),
          settings: combineReducers(settingsReducer),
        }),
      ],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [ModalComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }));

  const areas = 'areas';
  const b = 'b';

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should succeed to update filter string', () => {
    component.updateFilterString(areas, b);
    expect(component.filter.areas).toEqual(b);
  });

  it('should succeed to delete filter string', () => {
    component.updateFilterString(areas, '');
    expect(component.filter.areas).toBe('');
  });

  it('should succeed to open the modal view', () => {
    component.openModal();
  });
});
