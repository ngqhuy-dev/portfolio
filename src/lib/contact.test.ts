import { buildMailtoUrl, validateContact } from './contact';

const valid = { name: 'Huy', email: 'huy@example.com', message: 'Hello' };

describe('validateContact', () => {
  it('should return trimmed values when every field is valid', () => {
    expect(
      validateContact({ name: '  Huy ', email: ' huy@example.com ', message: ' Hi ' }),
    ).toEqual({
      ok: true,
      values: { name: 'Huy', email: 'huy@example.com', message: 'Hi' },
    });
  });

  it('should flag the first empty field when fields contain only whitespace', () => {
    expect(validateContact({ name: 'Huy', email: '   ', message: '' })).toEqual({
      ok: false,
      field: 'email',
      error: 'required',
    });
  });

  it.each(['plainaddress', 'a@b', 'a b@c.com', '@example.com'])(
    'should reject "%s" as an invalid email',
    (email) => {
      expect(validateContact({ ...valid, email })).toEqual({
        ok: false,
        field: 'email',
        error: 'invalidEmail',
      });
    },
  );

  it('should reject a message longer than the limit when maxlength is bypassed', () => {
    expect(validateContact({ ...valid, message: 'x'.repeat(5001) })).toEqual({
      ok: false,
      field: 'message',
      error: 'tooLong',
    });
  });

  it('should accept unicode and emoji content', () => {
    expect(validateContact({ ...valid, name: 'Nguyễn Quốc Huy 🚀' }).ok).toBe(true);
  });
});

describe('buildMailtoUrl', () => {
  it('should encode subject and body so special characters survive', () => {
    const url = buildMailtoUrl('me@example.com', 'Liên hệ: Huy', { ...valid, message: 'a&b?c=d' });
    expect(url).toBe(
      'mailto:me@example.com?subject=Li%C3%AAn%20h%E1%BB%87%3A%20Huy' +
        '&body=a%26b%3Fc%3Dd%0A%0A%E2%80%94%20Huy%20%3Chuy%40example.com%3E',
    );
  });
});
