import { Filter } from './filter.model';
import { OptionType } from './options.model';

describe('OptionsModel', () => {
  let filter: Filter;

  beforeEach(() => {
    filter = new Filter();
  });

  it('should succeed on initial state', () => {
    // When
    // Then
    expect(filter.toURI()).toEqual({});
    expect(filter.isEmpty()).toBeTruthy();
    expect(filter.optionIsEmpty(OptionType.areas)).toBeTruthy();
    expect(filter.has(OptionType.areas, 'value')).toBeFalsy();
    expect(filter.hasAny(OptionType.areas, ['value'])).toBeFalsy();
    expect(filter.hasAny(OptionType.areas, [])).toBeFalsy();
    expect(filter.hasAny(OptionType.areas, undefined)).toBeFalsy();
  });

  it('should succeed to set a value', () => {
    // When
    filter.set(OptionType.areas, 'value');

    // Then
    expect(filter.toURI()).toEqual({ areas: ['value'] });
    expect(filter.isEmpty()).toBeFalsy();
    expect(filter.optionIsEmpty(OptionType.areas)).toBeFalsy();
    expect(filter.has(OptionType.areas, 'value')).toBeTruthy();
    expect(filter.hasAny(OptionType.areas, ['value'])).toBeTruthy();
  });

  it('should succeed to set text', () => {
    // When
    filter.text = 'text';

    // Then
    expect(filter.toURI()).toEqual({ markdown: 'text' });
    expect(filter.isEmpty()).toBeFalsy();
  });

  it('should succeed to del a value', () => {
    // When
    filter.set(OptionType.areas, 'value');
    filter.del(OptionType.areas, 'value');

    // Then
    expect(filter.toURI()).toEqual({});
    expect(filter.isEmpty()).toBeTruthy();
    expect(filter.optionIsEmpty(OptionType.areas)).toBeTruthy();
    expect(filter.has(OptionType.areas, 'value')).toBeFalsy();
  });

  it('should indicate if a release version is a pre-release', () => {
    expect(filter.isPreRelease(undefined)).toBeFalsy();
    expect(filter.isPreRelease('1.15.1')).toBeFalsy();
    expect(filter.isPreRelease('1.16.0-alpha.1')).toBeTruthy();
    expect(filter.isPreRelease('1.16.0-beta.1')).toBeTruthy();
    expect(filter.isPreRelease('1.16.0-rc.1')).toBeTruthy();
    expect(filter.isPreRelease('1.17.0-alpha.1')).toBeTruthy();
    expect(filter.isPreRelease('1.17.0-beta.1')).toBeTruthy();
    expect(filter.isPreRelease('1.17.0-rc.1')).toBeTruthy();
  });
});
