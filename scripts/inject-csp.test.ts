import { buildPolicy, hashInlineScripts } from './inject-csp.mjs';

describe('buildPolicy', () => {
  it('should allow only self and page hashes when no third-party feature is enabled', () => {
    const policy = buildPolicy(["'sha256-abc'"], {});
    expect(policy).toContain("script-src 'self' 'sha256-abc'");
    expect(policy).toContain("connect-src 'self';");
    expect(policy).toContain("frame-src 'none'");
    expect(policy).toContain("form-action 'self';");
    expect(policy).not.toContain('unsafe-eval');
  });

  it('should add the contact, analytics and captcha origins when they are configured', () => {
    const policy = buildPolicy([], {
      NEXT_PUBLIC_CONTACT_ENDPOINT: 'https://formspree.io/f/abc',
      NEXT_PUBLIC_PLAUSIBLE_DOMAIN: 'example.com',
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'key',
    });
    expect(policy).toContain(
      "script-src 'self' https://plausible.io https://challenges.cloudflare.com",
    );
    expect(policy).toContain('frame-src https://challenges.cloudflare.com');
    expect(policy).toContain("form-action 'self' https://formspree.io");
  });

  it('should not allow Turnstile when there is no endpoint to verify the token', () => {
    const policy = buildPolicy([], { NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'key' });
    expect(policy).not.toContain('challenges.cloudflare.com');
  });
});

describe('hashInlineScripts', () => {
  it('should hash executable inline scripts and skip JSON-LD and external scripts', () => {
    const html =
      '<script>a()</script><script src="/x.js"></script>' +
      '<script type="application/ld+json">{}</script><script>a()</script>';
    expect(hashInlineScripts(html)).toEqual([
      "'sha256-qVpDBgj7bpq5hMAcGp3AOc79J3Y1Z4HvySTwKrWDoy4='",
    ]);
  });
});
