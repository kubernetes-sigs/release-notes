import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { NgxPaginationModule } from 'ngx-pagination';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { State } from '@app/app.reducer';

import { NotesComponent } from './notes.component';
import { notesReducer } from './notes.reducer';
import { DoFilter } from './notes.actions';
import { Filter } from '@app/shared/model/options.model';

describe('NotesComponent', () => {
  const filter = new Filter();

  let fixture: ComponentFixture<NotesComponent>;
  let component: NotesComponent;
  let store: Store<State>;

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
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should succeed to update', () => {
    // Given
    const action = new DoFilter(undefined, filter);

    // When
    component.update(filter);

    // Then
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should succeed to toggle filter', () => {
    // Given
    const action = new DoFilter(undefined, undefined);

    // When
    component.toggleFilter('key', 'value');

    // Then
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
