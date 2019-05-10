/**
 * A generic options abstraction
 */
export class Options {
  areas: string[] = [];
  kinds: string[] = [];
  releaseVersions: string[] = [];
  sigs: string[] = [];
}

/**
 * A generic filter abstraction based on the Options type
 */
export class Filter extends Options {
  markdown = '';

  /**
   * Helper method to test if the filter is empty
   *
   * @returns true is the filter is empty, false otherwise
   */
  public isEmpty(): boolean {
    for (const key in this) {
      if (Object.keys(this[key]).length > 0) {
        return false;
      }
    }
    return true;
  }
}
