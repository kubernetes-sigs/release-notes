import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { NgxPaginationModule } from 'ngx-pagination';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { State } from '@app/app.reducer';
import {jest} from '@jest/globals'

import { NotesComponent } from './notes.component';
import { notesReducer } from './notes.reducer';
import { filterReducer } from '@app/filter/filter.reducer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OptionType } from '@app/shared/model/options.model';
import { documentationMock } from '@app/shared/model/notes.model.mock';

describe('NotesComponent', () => {
  let fixture: ComponentFixture<NotesComponent>;
  let component: NotesComponent;
  let store: Store<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotesComponent],
      imports: [
        FontAwesomeModule,
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
          filter: combineReducers(filterReducer),
          notes: combineReducers(notesReducer),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should succeed to toggle filter', () => {
    // Given
    // When
    component.toggleFilter(OptionType.areas, 'value');

    // Then
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should succeed to retrieve the correct badge class', () => {
    // Given

    // When
    const kep = component.badgeClass('KEP');
    const official = component.badgeClass('official');
    const external = component.badgeClass('external');

    // Then
    expect(kep).toEqual('badge-primary');
    expect(official).toEqual('badge-success');
    expect(external).toEqual('badge-secondary');
  });

  it('should succeed sanitize the document description with [KEP]', () => {
    // Given
    const doc = documentationMock;
    doc.description = '[KEP]';

    // When
    const description = component.saneKEPDescription(doc);

    // Then
    expect(description).toEqual('Kubernetes Enhancement Proposal');
  });

  it('should succeed sanitize the document description with [KEP Some docs]', () => {
    // Given
    const doc = documentationMock;
    doc.description = '[KEP Some docs]';

    // When
    const description = component.saneKEPDescription(doc);

    // Then
    expect(description).toEqual('Some docs');
  });

  it('should succeed sanitize the document description', () => {
    // Given
    const doc = documentationMock;
    doc.description = ' some documentation ';

    // When
    const description = component.saneKEPDescription(doc);

    // Then
    expect(description).toEqual('some documentation');
  });
});
