/**
 * A generic options abstraction
 */
export class Options {
  areas: string[] = [];
  kinds: string[] = [];
  releaseVersions: string[] = [];
  sigs: string[] = [];
  documentation: string[] = [];
}

/**
 * A generic filter abstraction based on the Options type
 */
export class Filter extends Options {
  private markdown = '';

  /**
   * Method to set the markdown attribute
   * @returns void
   */
  public setMarkdown(md: string): void {
    this.markdown = md;
  }

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

  /**
   * Helper method to convert filter object into a URI-friendly object
   *
   *  @returns a object
   */
  public toURI(): object {
    const friendly = {};
    for (const key of Object.keys(this)) {
      if (key !== 'markdown') {
        if (Object.keys(this[key]).length > 0) {
          friendly[key] = Object.keys(this[key]);
        }
      }
      if (key === 'markdown' && this.markdown.trim().length > 0) {
        friendly[key] = this[key];
      }
    }

    return friendly;
  }

  /**
   * Method to see if a value is empty
   *
   * @returns a boolean
   */
  public isset(key: string): boolean {
    if (Object.keys(this[key]).length > 0) {
      return true;
    }
    return false;
  }

  /**
   * Method to return a value
   *
   * @returns an object or null
   */
  public get(key: string): object {
    return this[key];
  }

  /**
   * Method to add a value to a key
   *
   * @returns void
   */
  public add(key: string, value: string): void {
    this[key][value] = true;
  }
}
