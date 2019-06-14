import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { FormsModule } from '@angular/forms';
import { StoreModule, combineReducers } from '@ngrx/store';
import { NgxPaginationModule } from 'ngx-pagination';
import { OptionsComponent } from './options.component';
import { NotesComponent } from '@app/notes/notes.component';
import { ModalComponent } from '@app/modal/modal.component';
import { notesMock } from '@app/notes/notes.model.mock';
import { Note } from '@app/notes/notes.model';
import { notesReducer } from '@app/notes/notes.reducer';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('OptionsComponent', () => {
  let component: OptionsComponent;
  let fixture: ComponentFixture<OptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotesComponent, ModalComponent, OptionsComponent],
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
        NgbModule,
        RouterTestingModule,
        StoreModule.forRoot({
          notes: combineReducers(notesReducer),
        }),
      ],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [ModalComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(OptionsComponent);
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

  it('should succeed to update filter object', () => {
    const obj = { key: 'value' };
    component.updateFilterObject(areas, b, obj);
    expect(component.filter[areas][b]).toEqual(obj);
  });

  it('should succeed to delete filter object', () => {
    component.updateFilterObject(areas, b, undefined);
  });

  it('should succeed to toggle filter to true', () => {
    const event = { key: areas, value: b };
    component.toggleFilter(event);
    expect(component.filter[areas][b]).toBeTruthy();
  });

  it('should succeed to toggle filter to false', () => {
    const event = { key: areas, value: b };
    component.toggleFilter(event);
    expect(component.filter[areas][b]).toBeTruthy();

    component.toggleFilter(event);
    expect(component.filter[areas][b]).toBeFalsy();
  });

  it('should succeed to update options on gotNotes', () => {
    component.gotNotes(notesMock);
    expect(component.options.areas.length).toEqual(1);
    expect(component.options.kinds.length).toEqual(1);
    expect(component.options.sigs.length).toEqual(1);
    expect(component.options.releaseVersions.length).toEqual(1);
  });

  it('should succeed to update options on empty/invalid notes', () => {
    component.gotNotes([{} as Note]);
    expect(component.options.areas.length).toEqual(0);
    expect(component.options.kinds.length).toEqual(0);
    expect(component.options.sigs.length).toEqual(0);
    expect(component.options.releaseVersions.length).toEqual(1);
  });

  it('should succeed to open the modal view', () => {
    component.openModal();
  });
});
