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
});
