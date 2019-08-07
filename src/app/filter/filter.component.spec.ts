import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { StoreModule, combineReducers } from '@ngrx/store';

import { FilterComponent } from '@app/filter/filter.component';
import { notesReducer } from '@app/notes/notes.reducer';
import { Note } from '@app/notes/notes.model';
import { notesMock } from '@app/notes/notes.model.mock';
import { filterReducer } from '@app/filter/filter.reducer';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterComponent],
      imports: [
        FormsModule,
        StoreModule.forRoot({
          filter: combineReducers(filterReducer),
          notes: combineReducers(notesReducer),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should succeed to retrieve the options header ID', () => {
    expect(component.optionsHeaderID('value')).toEqual('options-value');
  });

  it('should succeed to retrieve the options checkbox ID', () => {
    expect(component.optionCheckboxID('value')).toEqual('option-value');
    expect(component.optionCheckboxID('1.2.3')).toEqual('option-1-2-3');
  });

  it('should succeed to update options', () => {
    component.updateOptions(notesMock);
    expect(component.options.areas.length).toEqual(1);
    expect(component.options.kinds.length).toEqual(1);
    expect(component.options.sigs.length).toEqual(1);
    expect(component.options.releaseVersions.length).toEqual(1);
  });

  it('should succeed to update options on empty/invalid notes', () => {
    component.updateOptions([{} as Note]);
    expect(component.options.areas.length).toEqual(0);
    expect(component.options.kinds.length).toEqual(0);
    expect(component.options.sigs.length).toEqual(0);
    expect(component.options.releaseVersions.length).toEqual(1);
  });
});
