import { hasPublicLink, projectInitials, projects } from './projects';

describe('projects data', () => {
  it('should have unique ids', () => {
    const ids = projects.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should only use valid hex accents', () => {
    for (const { accent } of projects) {
      if (accent) expect(accent).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe('hasPublicLink', () => {
  it.each([
    ['#', false],
    ['', false],
    [undefined, false],
    ['https://github.com/x', true],
  ])('should return %s → %s', (url, expected) => {
    expect(hasPublicLink(url)).toBe(expected);
  });
});

describe('projectInitials', () => {
  it('should take the first letter of the first two words, ignoring dashes', () => {
    expect(projectInitials('Event Flow — Event Management Platform')).toBe('EF');
    expect(projectInitials('JinStore — Cross-platform')).toBe('JC');
  });

  it('should return an empty string when the title is empty', () => {
    expect(projectInitials('')).toBe('');
  });
});
