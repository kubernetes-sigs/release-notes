import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Note, Documentation } from '@app/shared/model/notes.model';
import { DoFilter, GetNotes } from './notes.actions';
import { State } from '@app/app.reducer';
import {
  getErrorSelector,
  getAllNotesSelector,
  getFilteredNotesSelector,
  getLoadingSelector,
} from './notes.reducer';
import { Filter } from '@app/shared/model/filter.model';
import { OptionType } from '@app/shared/model/options.model';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { UpdateFilter } from '@app/filter/filter.actions';
import { getFilterSelector } from '@app/filter/filter.reducer';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap/tooltip';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap/collapse';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    NgbTooltipModule,
    NgbCollapseModule,
    FontAwesomeModule,
  ],
})
export class NotesComponent implements OnInit, OnDestroy {
  filter: Filter = new Filter();
  allNotes: Note[] = [];
  filteredNotes: Note[] = [];
  loading = false;
  p = 1;
  faBook = faBook;
  errorMessage = '';
  OptionType = OptionType;
  collapseStates: { [key: number]: boolean } = {};

  readonly kep = 'KEP';
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<State>,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.store.dispatch(new GetNotes());

    this.store.pipe(select(getAllNotesSelector), takeUntil(this.destroy$)).subscribe(notes => {
      if (notes) {
        // Initial retrieval of the notes
        this.allNotes = notes;
        this.filteredNotes = notes;

        this.store.dispatch(new DoFilter(this.allNotes, this.filter));
        this.cdr.markForCheck();
      }
    });

    this.store
      .pipe(select(getErrorSelector, getAllNotesSelector), takeUntil(this.destroy$))
      .subscribe(err => {
        if (err) {
          this.errorMessage = `Unable to display notes: ${err}`;
          this.cdr.markForCheck();
        }
      });

    this.store.pipe(select(getFilteredNotesSelector), takeUntil(this.destroy$)).subscribe(notes => {
      if (notes) {
        // Filter update of the notes
        this.filteredNotes = notes;
        this.cdr.markForCheck();
      }
    });

    this.store.pipe(select(getFilterSelector), takeUntil(this.destroy$)).subscribe(filter => {
      if (filter) {
        this.filter = filter;
        this.store.dispatch(new DoFilter(this.allNotes, filter));
        this.cdr.markForCheck();
      }
    });

    this.store.pipe(select(getLoadingSelector), takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByCommit(_index: number, note: Note): string {
    return note.commit;
  }

  trackByValue(_index: number, value: string): string {
    return value;
  }

  trackByDocUrl(_index: number, doc: Documentation): string {
    return doc.url;
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
    if (!doc.description) {
      return 'Kubernetes Enhancement Proposal';
    }

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
  public isCollapsed(prNumber: number): boolean {
    // If documentation filter is active, show all
    if (!this.filter.optionIsEmpty(OptionType.documentation)) {
      return false;
    }
    // Otherwise check individual state (default collapsed)
    return this.collapseStates[prNumber] !== false;
  }

  public toggleCollapse(prNumber: number): void {
    // Initialize to true (collapsed) if undefined, then toggle
    const currentState = this.collapseStates[prNumber] !== false;
    this.collapseStates[prNumber] = !currentState;
  }
}
