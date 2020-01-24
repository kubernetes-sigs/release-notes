import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Kep } from '@app/shared/model/notes.model';
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
export class NotesComponent {
  filter: Filter = new Filter();
  allNotes: Kep[] = [];
  filteredNotes: Kep[] = [];
  p = 1;
  faBook = faBook;
  errorMessage = '';

  readonly tocStart = '<!-- toc -->';
  readonly tocEnd = '<!-- /toc -->';

  constructor(private store: Store<State>) {
    this.store.dispatch(new GetNotes());

    store.pipe(select(getAllNotesSelector)).subscribe(notes => {
      if (notes) {
        // Initial retrieval of the notes
        this.allNotes = notes;
        this.filteredNotes = notes;

        this.store.dispatch(new DoFilter(this.allNotes, this.filter));
      }
    });

    store.pipe(select(getErrorSelector, getAllNotesSelector)).subscribe(err => {
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
   * Retrieve the collapse css class based on the current filter
   *
   * @returns The resulting class as string
   */
  public collapseClass(): string {
    /* if (!this.filter.optionIsEmpty(OptionType.owningSigs)) {
      return 'show';
    } */
    return '';
  }

  /**
   * Returns the table of contents from a markdown string
   *
   * @returns The resulting string
   */
  public toc(md: string): string {
    const toc = md.substring(
      md.lastIndexOf(this.tocStart) + this.tocStart.length,
      md.lastIndexOf(this.tocEnd),
    );
    const result = toc.replace(/\[(.*)\]\(.*\)/g, '$1');
    return result;
  }

  /**
   * Strips the table of contents from a markdown string
   *
   * @returns The resulting string
   */
  public stripToc(md: string): string {
    return md.substring(md.lastIndexOf(this.tocEnd));
  }
}
