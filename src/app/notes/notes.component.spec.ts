import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, combineReducers } from '@ngrx/store';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotesComponent } from './notes.component';
import { notesReducer } from './notes.reducer';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

describe('NotesComponent', () => {
  let fixture: ComponentFixture<NotesComponent>;
  let component: NotesComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotesComponent],
      imports: [
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

    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
