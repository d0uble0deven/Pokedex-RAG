import styles from './TeamBuilder.module.css';

export default function TeamBuilder() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Team Builder</h1>
        <p className={styles.subtitle}>Build competitive teams with AI-powered recommendations.</p>
      </header>
      <div className={styles.empty}>
        <p>Team builder coming soon.</p>
      </div>
    </div>
  );
}
