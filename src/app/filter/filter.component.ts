import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '@app/notes/notes.model';
import { Filter, Options } from '@app/shared/model/options.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
})
export class FilterComponent {
  @Input() options: Options = new Options();
  @Input() filter: Filter = new Filter();
  @Output() filterUpdate = new EventEmitter<Filter>();

  /**
   * Update the filter object based on the given parameters
   */
  updateFilterObject(a: string, b: string, val: any): void {
    if (val) {
      this.filter.add(a, b);
    } else {
      delete this.filter[a][b];
    }
    this.filterUpdate.emit(this.filter);
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
