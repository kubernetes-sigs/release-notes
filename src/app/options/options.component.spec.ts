import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { StoreModule, combineReducers } from '@ngrx/store';
import { NgxPaginationModule } from 'ngx-pagination';
import { OptionsComponent } from './options.component';
import { NotesComponent } from '@app/notes/notes.component';
import { notesReducer } from '@app/notes/notes.reducer';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

describe('OptionsComponent', () => {
  let component: OptionsComponent;
  let fixture: ComponentFixture<OptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotesComponent, OptionsComponent],
      imports: [
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
        StoreModule.forRoot({
          notes: combineReducers(notesReducer),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OptionsComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
