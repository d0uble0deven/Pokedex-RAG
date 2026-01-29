import { useParams } from 'react-router-dom';
import styles from './PokemonDetail.module.css';

export default function PokemonDetail() {
  const { id } = useParams();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pokemon #{id}</h1>
        <p className={styles.subtitle}>Detailed view coming soon.</p>
      </header>
      <div className={styles.empty}>
        <p>Stats, evolutions, and moves will appear here.</p>
      </div>
    </div>
  );
}
