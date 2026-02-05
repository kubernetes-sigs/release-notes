import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, provideStore } from '@ngrx/store';
import { provideMarkdown, MARKED_OPTIONS } from 'ngx-markdown';
import { State } from '@app/app.reducer';
import { jest } from '@jest/globals';

import { NotesComponent } from './notes.component';
import { notesReducer } from './notes.reducer';
import { filterReducer } from '@app/filter/filter.reducer';
import { OptionType } from '@app/shared/model/options.model';
import { documentationMock } from '@app/shared/model/notes.model.mock';

describe('NotesComponent', () => {
  let fixture: ComponentFixture<NotesComponent>;
  let component: NotesComponent;
  let store: Store<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesComponent],
      providers: [
        provideStore({
          filter: filterReducer as any,
          notes: notesReducer as any,
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

    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');
  });

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
