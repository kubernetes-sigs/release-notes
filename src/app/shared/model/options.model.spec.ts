import { Options, OptionType } from './options.model';

describe('OptionsModel', () => {
  let options: Options;

  beforeEach(() => {
    options = new Options();
  });

  it('should succeed to access the data', () => {
    // When
    // Then
    expect(options.data).toBeDefined();
  });

  it('should succeed to retrieve an empty OptionSet', () => {
    // When
    const res = options.get(OptionType.areas);

    // Then
    expect(res).toEqual(new Set());
  });

  it('should succeed to add data', () => {
    // Given
    options.add(OptionType.areas, ['a', 'a', 'b']);

    // When
    const res = options.get(OptionType.areas);

    // Then
    expect(res).toEqual(new Set(['a', 'b']));
  });

  it('should succeed to add data and re-sort it alphabetically', () => {
    // Given
    options.add(OptionType.areas, ['c', 'a', 'b']);

    // When
    const res = Array.from(options.get(OptionType.areas));

    // Then
    expect(res[0]).toEqual('a');
    expect(res[1]).toEqual('b');
    expect(res[2]).toEqual('c');
  });

  it('should succeed to add data and re-sort it reverse alphabetically', () => {
    // Given
    options.add(OptionType.releaseVersions, ['v1.14.0', 'v1.16.0', 'v1.14.2']);

    // When
    const res = Array.from(options.get(OptionType.releaseVersions));

    // Then
    expect(res[0]).toEqual('v1.16.0');
    expect(res[1]).toEqual('v1.14.2');
    expect(res[2]).toEqual('v1.14.0');
  });
});
