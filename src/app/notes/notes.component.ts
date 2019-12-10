import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Note, Documentation } from '@app/shared/model/notes.model';
import { DoFilter, GetNotes } from './notes.actions';
import { State } from '@app/app.reducer';
import { getErrorSelector, getAllNotesSelector, getFilteredNotesSelector } from './notes.reducer';
import { Filter } from '@app/shared/model/filter.model';
import { OptionType } from '@app/shared/model/options.model';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { UpdateFilter } from '@app/filter/filter.actions';
import { getFilterSelector } from '@app/filter/filter.reducer';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  providers: [],
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  filter: Filter = new Filter();
  allNotes: Note[] = [];
  filteredNotes: Note[] = [];
  p = 1;
  faBook = faBook;
  errorMessage = '';
  OptionType = OptionType;

  readonly kep = 'KEP';

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.store.dispatch(new GetNotes());

    this.store.pipe(select(getAllNotesSelector)).subscribe(notes => {
      if (notes) {
        // Initial retrieval of the notes
        this.allNotes = notes;
        this.filteredNotes = notes;

        this.store.dispatch(new DoFilter(this.allNotes, this.filter));
      }
    });

    this.store.pipe(select(getErrorSelector, getAllNotesSelector)).subscribe(err => {
      if (err) {
        this.errorMessage = `Unable to display notes: ${err}`;
      }
    });

    this.store.pipe(select(getFilteredNotesSelector)).subscribe(notes => {
      if (notes) {
        // Filter update of the notes
        this.filteredNotes = notes;
      }
    });

    this.store.pipe(select(getFilterSelector)).subscribe(filter => {
      if (filter) {
        this.filter = filter;
        this.store.dispatch(new DoFilter(this.allNotes, filter));
      }
    });
  }

  /**
   * Add or remove a filter element based on its state
   */
  public toggleFilter(optionType: OptionType, value: string): void {
    if (this.filter.has(optionType, value)) {
      this.filter.del(optionType, value);
    } else {
      this.filter.set(optionType, value);
    }
    this.store.dispatch(new UpdateFilter(this.filter));
    this.store.dispatch(new DoFilter(this.allNotes, this.filter));
  }

  /**
   * Retrieve the badge css class for a given documentation string
   *
   * @returns The resulting class as string
   */
  public badgeClass(t: string): string {
    if (t === this.kep) {
      return 'badge-primary';
    } else if (t === 'official') {
      return 'badge-success';
    }
    return 'badge-secondary';
  }

  /**
   * Sanitize the documentation description
   *
   * @param doc The documentation to be processed
   *
   * @returns The resulting description as string
   */
  public saneKEPDescription(doc: Documentation): string {
    const stripped = doc.description
      .replace(/[\[\]]/g, '') // remove brackets
      .replace(this.kep, '') // remove 'KEP'
      .trim();

    if (stripped === '') {
      // write out KEP
      return 'Kubernetes Enhancement Proposal';
    }

    // all other sort of descriptions
    return stripped;
  }

  /**
   * Retrieve the collapse css class based on the current filter
   *
   * @returns The resulting class as string
   */
  public collapseClass(): string {
    if (!this.filter.optionIsEmpty(OptionType.documentation)) {
      return 'show';
    }
    return '';
  }
}
