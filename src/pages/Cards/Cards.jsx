import styles from './Cards.module.css';

export default function Cards() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Card Valuation</h1>
        <p className={styles.subtitle}>Scan and identify trading cards. Get real-time market prices.</p>
      </header>
      <div className={styles.empty}>
        <p>Card scanner coming soon.</p>
      </div>
    </div>
  );
}
