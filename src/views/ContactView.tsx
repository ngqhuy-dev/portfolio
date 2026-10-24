import type { ReactNode } from 'react';
import { ContactForm } from '@/components/contact/ContactForm';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { siteConfig } from '@/config/site';
import { getDictionary, type Locale } from '@/i18n';
import styles from './ContactView.module.css';

interface ContactChannel {
  label: string;
  value: string;
  icon: ReactNode;
  href?: string;
}

function ChannelCard({ label, value, icon, href }: ContactChannel) {
  const content = (
    <>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <div>
        <strong>{label}</strong>
        <br />
        <span className={styles.value}>{value}</span>
      </div>
    </>
  );
  const className = `card card-interactive ${styles.channel}`;

  if (!href) return <div className={className}>{content}</div>;

  const isExternal = href.startsWith('http');
  return (
    <a
      className={className}
      href={href}
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      {content}
    </a>
  );
}

export function ContactView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).contact;
  const channels: ContactChannel[] = [
    {
      label: t.channels.email,
      value: siteConfig.email,
      icon: '✉',
      href: `mailto:${siteConfig.email}`,
    },
    {
      label: t.channels.github,
      value: 'github.com/ngqhuy-dev',
      icon: <GitHubIcon />,
      href: siteConfig.links.github,
    },
    {
      label: t.channels.facebook,
      value: 'facebook.com/nqhuy.it',
      icon: 'fb',
      href: siteConfig.links.facebook,
    },
    {
      label: t.channels.bitbucket,
      value: t.channels.bitbucketValue,
      icon: 'bb',
      href: siteConfig.links.bitbucket,
    },
    { label: t.channels.location, value: siteConfig.location, icon: '⊙' },
  ];

  return (
    <section className="section" aria-labelledby="contact-heading">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 id="contact-heading">{t.heading}</h1>
      <div className={`${styles.layout} stagger`}>
        <div className={`${styles.list} stagger`}>
          {channels.map((channel) => (
            <ChannelCard key={channel.label} {...channel} />
          ))}
        </div>
        <ContactForm
          locale={locale}
          email={siteConfig.email}
          endpoint={siteConfig.contactEndpoint}
          turnstileSiteKey={siteConfig.turnstileSiteKey}
        />
      </div>
    </section>
  );
}
