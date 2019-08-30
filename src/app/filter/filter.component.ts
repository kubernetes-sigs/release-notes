import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { skip } from 'rxjs/operators';
import { Options, OptionType } from '@app/shared/model/options.model';
import { Filter } from '@app/shared/model/filter.model';
import { Settings } from '@app/shared/model/settings.model';
import { Note } from '@app/shared/model/notes.model';
import { getAllNotesSelector } from '@app/notes/notes.reducer';
import { State } from '@app/app.reducer';
import { UpdateFilter } from './filter.actions';
import { getFilterSelector } from '@app/filter/filter.reducer';
import { getSettingsSelector } from '@app/settings/settings.reducer';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {
  options: Options = new Options();
  filter: Filter = new Filter();
  settings: Settings = new Settings();
  notes: Note[] = [];

  /**
   * FilterComponent's constructor
   */
  constructor(private cdr: ChangeDetectorRef, private store: Store<State>) {}

  /**
   * Runs after component initialization
   */
  ngOnInit() {
    this.store.pipe(select(getAllNotesSelector)).subscribe(notes => {
      if (notes) {
        this.notes = notes;
        this.updateOptions();
      }
    });

    this.store.pipe(select(getFilterSelector)).subscribe(filter => {
      if (filter) {
        this.filter = filter;
      }
    });

    this.store
      .pipe(select(getSettingsSelector))
      .pipe(skip(1))
      .subscribe(settings => {
        this.settings = settings;
        this.updateOptions();
      });
  }

  /**
   * Update the options from the provided notes
   */
  updateOptions(): void {
    // Reset the options
    this.options = new Options();

    // Populate the new options
    for (const note of Object.values(this.notes)) {
      if (OptionType.areas in note) {
        this.options.add(OptionType.areas, note.areas);
      }
      if (OptionType.kinds in note) {
        this.options.add(OptionType.kinds, note.kinds);
      }
      if (OptionType.sigs in note) {
        this.options.add(OptionType.sigs, note.sigs);
      }
      if (OptionType.documentation in note) {
        this.options.add(OptionType.documentation, note.documentation.map(x => x.type.toString()));
      }
      if (
        !this.options.get(OptionType.releaseVersions).has(note.release_version) &&
        (this.settings.displayPreReleases || !this.filter.isPreRelease(note.release_version))
      ) {
        this.options.get(OptionType.releaseVersions).add(note.release_version);
      }
    }

    // Update the UI
    this.cdr.detectChanges();
  }

  /**
   * Update the filter object based on the given parameters
   */
  updateFilter(optionType: OptionType, value: string, event: any): void {
    if (event) {
      this.filter.set(optionType, value);
    } else {
      this.filter.del(optionType, value);
    }
    this.store.dispatch(new UpdateFilter(this.filter));
  }

  /**
   * Create the options header ID from the given input string
   *
   * @param input   The provided input string
   *
   * @returns The prefixed output string
   */
  optionsHeaderID(input: string): string {
    return `options-${input}`;
  }

  /**
   * Create the options checkbox ID from the given input string. This method
   * also stripps invalid dot (.) characters from the input.
   *
   * @param input   The provided input string
   *
   * @returns The prefixed output string
   */
  optionCheckboxID(input: string): string {
    if (input) {
      // Strip the dots from the release versions
      const stripped = input.replace(/\./g, '-');
      return `option-${stripped}`;
    }
    return '';
  }
}
