import { TestBed, getTestBed } from '@angular/core/testing';
import { Filter } from './options.model';

describe('OptionsModel', () => {
  let filter: Filter;

  // Given
  const message = 'message';

  beforeEach(() => {
    filter = new Filter();
  });

  describe('toURI()', () => {
    it('should succeed on initial state', () => {
      // When
      // Then
      expect(filter.toURI()).toEqual({});
      expect(filter.isEmpty()).toBeTruthy();
    });
  });

  describe('setMarkdown', () => {
    it('should succeed with markdown', () => {
      // Given
      const markdown = 'some markdown';

      // When
      filter.setMarkdown(markdown);

      // Then
      expect(filter.toURI()).toEqual({ markdown });
      expect(filter.isEmpty()).toBeFalsy();
    });
  });
});
