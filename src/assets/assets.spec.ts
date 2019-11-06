import { assets } from '@env/assets';
import { readFileSync } from 'fs';
import { join, parse } from 'path';

describe('Assets', () => {
  it('should all exist', () => {
    for (const asset of assets) {
      // Given
      const assetBase = parse(asset).base;
      const path = join(__dirname, assetBase);

      // When
      const file = readFileSync(path, 'utf-8');
      const json = JSON.parse(file);

      // Then
      expect(json).toBeDefined();
    }
  });
});
