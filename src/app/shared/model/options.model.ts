/**
 * All available option types
 */
export enum OptionType {
  areas = 'areas',
  kinds = 'kinds',
  releaseVersions = 'releaseVersions',
  sigs = 'sigs',
  documentation = 'documentation',
}

/**
 * The option data type
 */
export type OptionData = Map<OptionType, OptionSet>;

/**
 * The options for a single OptionType
 */
export type OptionSet = Set<string>;

/**
 * A generic options abstraction
 */
export class Options {
  /**
   * The private data store
   */
  private store: OptionData = new Map([
    [OptionType.areas, new Set()],
    [OptionType.kinds, new Set()],
    [OptionType.releaseVersions, new Set()],
    [OptionType.sigs, new Set()],
    [OptionType.documentation, new Set()],
  ]);

  /**
   * Retrieve the data
   *
   * @returns OptionData The currently available data
   */
  public get data(): OptionData {
    return this.store;
  }

  /**
   * Retrieve an single OptionSet for the provided optionType
   *
   * @param optionType The OptionType to be used
   *
   * @returns OptionSet The data
   */
  public get(optionType: OptionType): OptionSet {
    return this.data.get(optionType);
  }

  /**
   * Append an input string array to the provided option type by discarding
   * duplicate elements
   *
   * @param optionType The OptionType to be used
   * @param input The array of documentation string to be added
   */
  public add(optionType: OptionType, input: string[]) {
    this.data.set(optionType, this.merge(this.data.get(optionType), input));
  }

  /**
   * Merge a set and a string array into a new set
   *
   * @param input The base set
   * @param arr The array to be appended
   *
   * @returns OptionSet the new Set of strings
   */
  private merge(input: OptionSet, arr: string[]): OptionSet {
    return new Set([...input, ...new Set(arr)]);
  }
}
