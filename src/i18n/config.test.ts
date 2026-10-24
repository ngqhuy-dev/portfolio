import { localizedPath, stripLocale } from './config';

describe('localizedPath', () => {
  it('should keep legacy English URLs without a prefix', () => {
    expect(localizedPath('en', '/')).toBe('/');
    expect(localizedPath('en', '/about')).toBe('/about');
  });

  it('should prefix Vietnamese URLs with /vi', () => {
    expect(localizedPath('vi', '/')).toBe('/vi');
    expect(localizedPath('vi', '/portfolio/linora')).toBe('/vi/portfolio/linora');
  });
});

describe('stripLocale', () => {
  it.each([
    ['/', 'en', '/'],
    ['/about', 'en', '/about'],
    ['/vi', 'vi', '/'],
    ['/vi/resume', 'vi', '/resume'],
    ['/video', 'en', '/video'],
  ])('should map %s to locale %s and path %s', (pathname, locale, path) => {
    expect(stripLocale(pathname)).toEqual({ locale, path });
  });

  it('should round-trip with localizedPath', () => {
    for (const path of ['/', '/about', '/portfolio/jinstore']) {
      expect(stripLocale(localizedPath('vi', path))).toEqual({ locale: 'vi', path });
    }
  });
});

describe('stripLocale with trailing slashes', () => {
  it('should ignore a trailing slash from the static export URLs', () => {
    expect(stripLocale('/vi/about/')).toEqual({ locale: 'vi', path: '/about' });
    expect(stripLocale('/vi/')).toEqual({ locale: 'vi', path: '/' });
    expect(stripLocale('/portfolio/')).toEqual({ locale: 'en', path: '/portfolio' });
  });
});
