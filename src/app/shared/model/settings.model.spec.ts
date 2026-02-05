import { Settings } from './settings.model';

describe('Settings Model', () => {
  let settings: Settings;

  beforeEach(() => {
    settings = new Settings();
  });

  it('should create an instance', () => {
    expect(settings).toBeTruthy();
  });

  it('should initialize displayPreReleases to false', () => {
    expect(settings.displayPreReleases).toBe(false);
  });

  it('should allow setting displayPreReleases to true', () => {
    settings.displayPreReleases = true;
    expect(settings.displayPreReleases).toBe(true);
  });

  it('should allow setting displayPreReleases to false', () => {
    settings.displayPreReleases = true;
    settings.displayPreReleases = false;
    expect(settings.displayPreReleases).toBe(false);
  });
});
