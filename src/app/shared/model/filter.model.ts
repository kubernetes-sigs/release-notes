import { Params } from '@angular/router';
import { Options, OptionType, OptionSet } from './options.model';

/**
 * A generic filter abstraction based on the Options type
 */
export class Filter extends Options {
  /**
   * The filter text
   */
  public text = '';

  /**
   * Specifies of the filter should hide pre release versions
   */
  public displayPreReleases = false;

  /**
   * The markdown key for the filter text
   */
  public readonly markdownKey = 'markdown';

  /**
   * Helper method to test if the filter is empty
   *
   * @returns true is the filter is empty, false otherwise
   */
  public isEmpty(): boolean {
    if (this.text.length > 0) {
      return false;
    }
    let empty = true;
    this.data.forEach((value: OptionSet, key: string) => {
      if (key !== OptionType.releaseVersions && value.size > 0) {
        empty = false;
      }
    });
    return empty;
  }

  /**
   * Helper method to convert filter object into a URI-friendly object
   *
   * @returns Params the query parameter object
   */
  public toURI(): Params {
    const params: Params = {};

    // Set the markdown if needed
    if (this.text.trim().length > 0) {
      params[this.markdownKey] = this.text;
    }

    // Add the option data if needed
    this.data.forEach((value: OptionSet, key: string) => {
      if (value.size > 0) {
        params[key] = [...value.values()];
      }
    });

    return params;
  }

  /**
   * Method to see if an option is empty
   *
   * @returns boolean true if empty, otherwise false
   */
  public optionIsEmpty(optionType: OptionType): boolean {
    if (super.get(optionType).size === 0) {
      return true;
    }
    return false;
  }

  /**
   * Method to add a value to an OptionType
   *
   * @param optionType The OptionType to be used
   * @param value The value to be added
   */
  public set(optionType: OptionType, value: string): void {
    super.get(optionType).add(value);
  }

  /**
   * Method to delete a value for an OptionType
   *
   * @param optionType The OptionType to be used
   * @param value The value to be deleted
   */
  public del(optionType: OptionType, value: string): void {
    super.get(optionType).delete(value);
  }

  /**
   * Method to check if the option type and value exists whtin the filter
   *
   * @param optionType The OptionType to be used
   * @param value The value to be checked
   *
   * @returns boolean true if the filter contains the value, otherwise false
   */
  public has(optionType: OptionType, value: string): boolean {
    return super.get(optionType).has(value);
  }

  /**
   * Method to check if the option type and value exists whtin the filter
   *
   * @param optionType The OptionType to be used
   * @param values The values to be checked
   *
   * @returns boolean true if the filter contains any of the values, otherwise false
   */
  public hasAny(optionType: OptionType, values: string[]): boolean {
    if (values) {
      for (const v of values) {
        if (this.has(optionType, v)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Test wheter a release version string is a pre release
   *
   * @param version The release version string
   *
   * @returns boolean true if it's a pre-release, otherwise false
   */
  public isPreRelease(version: string): boolean {
    if (version) {
      return version.includes('alpha') || version.includes('beta') || version.includes('rc');
    }
    return false;
  }
}
