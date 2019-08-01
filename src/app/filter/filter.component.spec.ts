import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { FilterComponent } from '@app/filter/filter.component';
import { notesMock } from '@app/notes/notes.model.mock';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterComponent],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }));

  const areas = 'areas';
  const b = 'b';

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should succeed to update filter object', () => {
    component.updateFilterObject(areas, b, true);
    expect(component.filter[areas][b]).toEqual(true);
  });

  it('should succeed to delete filter object', () => {
    component.updateFilterObject(areas, b, false);
  });

  it('should succeed to retrieve the options header ID', () => {
    expect(component.optionsHeaderID('value')).toEqual('options-value');
  });

  it('should succeed to retrieve the options checkbox ID', () => {
    expect(component.optionCheckboxID('value')).toEqual('option-value');
    expect(component.optionCheckboxID('1.2.3')).toEqual('option-1-2-3');
  });
});
