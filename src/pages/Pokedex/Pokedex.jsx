import styles from './Pokedex.module.css';

export default function Pokedex() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pokedex</h1>
        <p className={styles.subtitle}>Browse stats, evolutions, and moves for every Pokemon.</p>
      </header>
      <div className={styles.empty}>
        <p>Pokemon list coming soon.</p>
      </div>
    </div>
  );
}
