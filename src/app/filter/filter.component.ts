import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { skip } from 'rxjs/operators';
import { Filter, Options } from '@app/shared/model/options.model';
import { Settings } from '@app/shared/model/settings.model';
import { Note } from '@app/notes/notes.model';
import { getAllNotesSelector } from '@app/notes/notes.reducer';
import { State } from '@app/app.reducer';
import { UpdateFilter } from './filter.actions';
import { getFilterSelector } from '@app/filter/filter.reducer';
import { getSettingsSelector } from '@app/settings/settings.reducer';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
})
export class FilterComponent {
  options: Options = new Options();
  filter: Filter = new Filter();
  settings: Settings = new Settings();
  notes: Note[] = [];

  /**
   * FilterComponent's constructor
   */
  constructor(private store: Store<State>) {
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
      if ('areas' in note) {
        this.options.areas = [...new Set(this.options.areas.concat(note.areas))];
      }
      if ('kinds' in note) {
        this.options.kinds = [...new Set(this.options.kinds.concat(note.kinds))];
      }
      if ('sigs' in note) {
        this.options.sigs = [...new Set(this.options.sigs.concat(note.sigs))];
      }
      if ('documentation' in note) {
        this.options.documentation = [
          ...new Set(
            this.options.documentation.concat(note.documentation.map(x => x.type.toString())),
          ),
        ];
      }
      if (
        !this.options.releaseVersions.includes(note.release_version) &&
        (this.settings.displayPreReleases || !this.isPreRelease(note.release_version))
      ) {
        this.options.releaseVersions.push(note.release_version);
      }
    }
  }

  /**
   * Test wheter a release version string is a pre release
   *
   * @param version The release version string
   *
   * @returns boolean true if it's a pre-release, otherwise false
   */
  isPreRelease(version: string): boolean {
    if (version) {
      return version.includes('alpha') || version.includes('beta') || version.includes('rc');
    }
    return false;
  }

  /**
   * Update the filter object based on the given parameters
   */
  updateFilter(key: string, value: string, event: any): void {
    if (event) {
      this.filter.add(key, value);
    } else {
      this.filter.del(key, value);
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
    // Strip the dots from the release versions
    const stripped = input.replace(/\./g, '-');
    return `option-${stripped}`;
  }
}
