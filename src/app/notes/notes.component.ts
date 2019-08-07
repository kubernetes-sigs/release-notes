import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { DocType, Note } from './notes.model';
import { DoFilter, GetNotes } from './notes.actions';
import { State } from '@app/app.reducer';
import { getAllNotesSelector, getFilteredNotesSelector } from './notes.reducer';
import { Filter } from '@app/shared/model/options.model';
import { faBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  providers: [],
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent {
  @Input() filter: Filter;
  @Output() filterUpdate = new EventEmitter<object>();
  @Output() gotNotes = new EventEmitter<Note[]>();
  allNotes: Note[];
  filteredNotes: Note[];
  p = 1;
  faBook = faBook;

  constructor(private store: Store<State>) {
    store.dispatch(new GetNotes());

    this.store.pipe(select(getAllNotesSelector)).subscribe(n => {
      // Initial retrieval of the notes
      this.allNotes = n;
      this.filteredNotes = n;
      this.gotNotes.emit(n);

      this.store.dispatch(new DoFilter(this.allNotes, this.filter));
    });

    this.store.pipe(select(getFilteredNotesSelector)).subscribe(n => {
      // Filter update of the notes
      this.filteredNotes = n;
    });
  }

  public update(filter: Filter) {
    this.filter = filter;
    this.store.dispatch(new DoFilter(this.allNotes, filter));
  }

  public toggleFilter(key, value) {
    this.filterUpdate.emit({ key, value });
    this.store.dispatch(new DoFilter(this.allNotes, this.filter));
  }

  /**
   * Retrieve the badge css class for a given documentation string
   *
   * @returns The resulting class as string
   */
  public badgeClass(t: string): string {
    if (t === 'KEP') {
      return 'badge-primary';
    } else if (t === 'official') {
      return 'badge-success';
    }
    return 'badge-secondary';
  }

  /**
   * Retrieve the collapse css class based on the current filter
   *
   * @returns The resulting class as string
   */
  public collapseClass(): string {
    if (this.filter.isset('documentation')) {
      return 'show';
    }
    return '';
  }
}
