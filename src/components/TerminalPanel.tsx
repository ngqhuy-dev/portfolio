import styles from './TerminalPanel.module.css';

export interface Signal {
  title: string;
  description: string;
}

interface TerminalPanelProps {
  label: string;
  signals: Signal[];
}

export function TerminalPanel({ label, signals }: TerminalPanelProps) {
  return (
    <div className={styles.panel} aria-label={label}>
      <div className={styles.top} aria-hidden="true">
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <div className={styles.body}>
        {signals.map(({ title, description }) => (
          <div key={title} className={styles.signal}>
            <strong>{title}</strong>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
