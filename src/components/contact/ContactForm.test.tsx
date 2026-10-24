import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

const EMAIL = 'me@example.com';

async function fillForm(values: { name?: string; email?: string; message?: string }) {
  if (values.name) await userEvent.type(screen.getByLabelText('Name'), values.name);
  if (values.email) await userEvent.type(screen.getByLabelText('Email'), values.email);
  if (values.message) await userEvent.type(screen.getByLabelText('Message'), values.message);
  await userEvent.click(screen.getByRole('button', { name: /send message/i }));
}

describe('ContactForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should not show any status message before submit', () => {
    render(<ContactForm locale="en" email={EMAIL} />);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.getByRole('alert')).toBeEmptyDOMElement();
  });

  it('should focus and mark the first empty field when submitted empty', async () => {
    render(<ContactForm locale="en" email={EMAIL} />);
    await fillForm({});

    expect(screen.getByRole('alert')).toHaveTextContent('Please fill in all fields.');
    expect(screen.getByLabelText('Name')).toHaveFocus();
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
  });

  it('should open the mail app when no endpoint is configured', async () => {
    const openUrl = vi.fn();
    render(<ContactForm locale="en" email={EMAIL} openUrl={openUrl} />);
    await fillForm({ name: 'Huy', email: 'huy@example.com', message: 'Hi' });

    expect(openUrl).toHaveBeenCalledWith(
      expect.stringMatching(/^mailto:me@example\.com\?subject=/),
    );
    expect(screen.getByRole('status')).toHaveTextContent('Your email app should open');
  });

  it('should show success and reset the form when the endpoint accepts the message', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactForm locale="en" email={EMAIL} endpoint="https://formspree.io/f/test" />);
    await fillForm({ name: 'Huy', email: 'huy@example.com', message: 'Hi' });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://formspree.io/f/test',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(await screen.findByRole('status')).toHaveTextContent('Thanks!');
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });

  it('should show a fallback email when the endpoint returns a server error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    render(<ContactForm locale="en" email={EMAIL} endpoint="https://formspree.io/f/test" />);
    await fillForm({ name: 'Huy', email: 'huy@example.com', message: 'Hi' });

    expect(await screen.findByRole('alert')).toHaveTextContent(`email me directly at ${EMAIL}`);
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });

  it('should show Vietnamese validation messages when locale is vi', async () => {
    render(<ContactForm locale="vi" email={EMAIL} />);
    await userEvent.click(screen.getByRole('button', { name: 'Gửi tin nhắn' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Vui lòng điền đầy đủ các trường.');
  });

  it('should block sending until the spam check is completed when Turnstile is enabled', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(
      <ContactForm
        locale="en"
        email={EMAIL}
        endpoint="https://formspree.io/f/test"
        turnstileSiteKey="site-key"
      />,
    );
    await fillForm({ name: 'Huy', email: 'huy@example.com', message: 'Hi' });

    expect(screen.getByRole('alert')).toHaveTextContent('Please complete the spam check.');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should silently drop the submission when the honeypot is filled', async () => {
    const openUrl = vi.fn();
    const { container } = render(<ContactForm locale="en" email={EMAIL} openUrl={openUrl} />);
    const honeypot = container.querySelector<HTMLInputElement>('[name="_gotcha"]');
    if (!honeypot) throw new Error('honeypot input missing');
    honeypot.value = 'bot';
    await fillForm({ name: 'Bot', email: 'bot@example.com', message: 'spam' });

    expect(openUrl).not.toHaveBeenCalled();
  });
});
