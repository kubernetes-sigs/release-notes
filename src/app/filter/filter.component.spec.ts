import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';

import { FilterComponent } from '@app/filter/filter.component';
import { notesReducer } from '@app/notes/notes.reducer';
import { Note } from '@app/shared/model/notes.model';
import { OptionType } from '@app/shared/model/options.model';
import { notesMock } from '@app/shared/model/notes.model.mock';
import { filterReducer } from '@app/filter/filter.reducer';
import { settingsReducer } from '@app/settings/settings.reducer';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterComponent],
      providers: [
        provideStore({
          filter: filterReducer as any,
          notes: notesReducer as any,
          settings: settingsReducer as any,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should succeed to retrieve the options header ID', () => {
    expect(component.optionsHeaderID('value')).toEqual('options-value');
  });

  it('should succeed to retrieve the options checkbox ID', () => {
    expect(component.optionCheckboxID('value')).toEqual('option-value');
    expect(component.optionCheckboxID('1.2.3')).toEqual('option-1-2-3');
    expect(component.optionCheckboxID(undefined as any)).toEqual('');
  });

  it('should succeed to update options', () => {
    component.notes = notesMock;
    component.updateOptions();
    expect(component.options.get(OptionType.areas).size).toEqual(1);
    expect(component.options.get(OptionType.kinds).size).toEqual(1);
    expect(component.options.get(OptionType.sigs).size).toEqual(1);
    expect(component.options.get(OptionType.releaseVersions).size).toEqual(1);
  });

  it('should succeed to update options on empty/invalid notes', () => {
    component.notes = [{} as Note];
    component.updateOptions();
    expect(component.options.get(OptionType.areas).size).toEqual(0);
    expect(component.options.get(OptionType.kinds).size).toEqual(0);
    expect(component.options.get(OptionType.sigs).size).toEqual(0);
    expect(component.options.get(OptionType.releaseVersions).size).toEqual(1);
  });
});
