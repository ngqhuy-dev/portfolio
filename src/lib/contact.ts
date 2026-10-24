export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactField = 'name' | 'email' | 'message';

export interface ContactValues {
  name: string;
  email: string;
  message: string;
}

export type ContactError = 'required' | 'invalidEmail' | 'tooLong';

export type ContactValidation =
  { ok: true; values: ContactValues } | { ok: false; field: ContactField; error: ContactError };

const FIELD_ORDER: ContactField[] = ['name', 'email', 'message'];

export function validateContact(input: ContactValues): ContactValidation {
  const values: ContactValues = {
    name: input.name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
  };

  const emptyField = FIELD_ORDER.find((field) => !values[field]);
  if (emptyField) return { ok: false, field: emptyField, error: 'required' };

  if (!EMAIL_PATTERN.test(values.email)) {
    return { ok: false, field: 'email', error: 'invalidEmail' };
  }

  const tooLong = FIELD_ORDER.find((field) => values[field].length > CONTACT_LIMITS[field]);
  if (tooLong) return { ok: false, field: tooLong, error: 'tooLong' };

  return { ok: true, values };
}

export function buildMailtoUrl(
  to: string,
  subject: string,
  { name, email, message }: ContactValues,
): string {
  const body = `${message}\n\n— ${name} <${email}>`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
