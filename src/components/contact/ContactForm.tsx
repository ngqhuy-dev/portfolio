'use client';

import { type FormEvent, useState } from 'react';
import { getDictionary, type Locale } from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { buildMailtoUrl, CONTACT_LIMITS, type ContactField, validateContact } from '@/lib/contact';
import styles from './ContactForm.module.css';
import { Turnstile, TURNSTILE_RESPONSE_FIELD } from './Turnstile';

type FormStatus =
  | { type: 'idle' }
  | { type: 'sending' }
  | { type: 'sent' }
  | { type: 'handoff' }
  | { type: 'error'; message: string; field?: ContactField };

interface ContactFormProps {
  locale: Locale;
  email: string;
  /** Formspree-style endpoint; empty means hand the message off to the visitor's mail app. */
  endpoint?: string;
  /** Cloudflare Turnstile site key; only used together with `endpoint`. */
  turnstileSiteKey?: string;
  /** Injected for tests; defaults to navigating the window. */
  openUrl?: (url: string) => void;
}

function navigateTo(url: string) {
  window.location.href = url;
}

export function ContactForm({
  locale,
  email,
  endpoint,
  turnstileSiteKey,
  openUrl = navigateTo,
}: ContactFormProps) {
  const t = getDictionary(locale).form;
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });
  // Remounting the widget after a send issues a fresh single-use token.
  const [submissionCount, setSubmissionCount] = useState(0);
  const isCaptchaEnabled = Boolean(endpoint && turnstileSiteKey);

  const invalidField = status.type === 'error' ? status.field : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (data.get('_gotcha')) return;

    const result = validateContact({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });

    if (!result.ok) {
      const labels: Record<ContactField, string> = {
        name: t.name,
        email: t.email,
        message: t.message,
      };
      const message =
        result.error === 'tooLong'
          ? t.tooLong(labels[result.field].toLowerCase(), CONTACT_LIMITS[result.field])
          : t[result.error];
      setStatus({ type: 'error', message, field: result.field });
      const invalidInput = form.elements.namedItem(result.field);
      if (invalidInput instanceof HTMLElement) invalidInput.focus();
      return;
    }

    if (!endpoint) {
      openUrl(buildMailtoUrl(email, t.mailSubject(result.values.name), result.values));
      setStatus({ type: 'handoff' });
      trackEvent('Contact', { method: 'mailto' });
      return;
    }

    if (isCaptchaEnabled && !data.get(TURNSTILE_RESPONSE_FIELD)) {
      setStatus({ type: 'error', message: t.captchaRequired });
      return;
    }

    setStatus({ type: 'sending' });
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      form.reset();
      setStatus({ type: 'sent' });
      trackEvent('Contact', { method: 'form' });
    } catch {
      setStatus({ type: 'error', message: `${t.failed} ${email}.` });
    } finally {
      setSubmissionCount((count) => count + 1);
    }
  }

  const mailLink = <a href={`mailto:${email}`}>{email}</a>;

  return (
    <form
      className={`card ${styles.form}`}
      noValidate
      onSubmit={handleSubmit}
      aria-busy={status.type === 'sending'}
    >
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor="gotcha">{t.honeypot}</label>
        <input id="gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid cols-2">
        <div>
          <label htmlFor="name">{t.name}</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder={t.namePlaceholder}
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name}
            required
            aria-invalid={invalidField === 'name' || undefined}
          />
        </div>
        <div>
          <label htmlFor="email">{t.email}</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={CONTACT_LIMITS.email}
            required
            aria-invalid={invalidField === 'email' || undefined}
          />
        </div>
      </div>
      <div>
        <label htmlFor="message">{t.message}</label>
        <textarea
          id="message"
          name="message"
          placeholder={t.messagePlaceholder}
          maxLength={CONTACT_LIMITS.message}
          required
          aria-invalid={invalidField === 'message' || undefined}
        />
      </div>
      {isCaptchaEnabled && turnstileSiteKey && (
        <Turnstile key={submissionCount} siteKey={turnstileSiteKey} language={locale} />
      )}
      <button className="btn btn-primary" type="submit" disabled={status.type === 'sending'}>
        {status.type === 'sending' ? t.sending : t.submit}
      </button>
      <div className={styles.success} role="status" aria-live="polite">
        {status.type === 'sent' && (
          <>
            {t.sent} {mailLink}.
          </>
        )}
        {status.type === 'handoff' && (
          <>
            {t.handoff} {mailLink}.
          </>
        )}
      </div>
      <div className={styles.error} role="alert">
        {status.type === 'error' && status.message}
      </div>
    </form>
  );
}
