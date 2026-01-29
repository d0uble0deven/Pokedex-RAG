import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const features = [
  {
    id: 'pokedex',
    title: 'Pokedex',
    description:
      'Browse detailed stats, evolutions, and moves for every Pokemon. Your complete reference guide.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
        <path d="M2 12h7" />
        <path d="M15 12h7" />
      </svg>
    ),
    to: '/pokedex',
    color: '#E5534B',
  },
  {
    id: 'cards',
    title: 'Card Valuation',
    description:
      'Scan and identify trading cards instantly. Get real-time market prices from top sources.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
    to: '/cards',
    color: '#4D90D5',
  },
  {
    id: 'team',
    title: 'Team Builder',
    description:
      'Build competitive teams with AI-powered recommendations. Optimize your lineup for any format.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    to: '/team',
    color: '#63BB5B',
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Build teams. Track value.
          <br />
          <span className={styles.heroHighlight}>Master Pokemon.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Your premium companion for competitive play and card collecting.
        </p>
      </section>

      <section className={styles.features}>
        {features.map((feature) => (
          <Link key={feature.id} to={feature.to} className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ color: feature.color }}>
              {feature.icon}
            </div>
            <div className={styles.featureContent}>
              <h2 className={styles.featureTitle}>{feature.title}</h2>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
            <div className={styles.featureArrow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </section>

      <footer className={styles.footer}>
        <p className={styles.footerText}>Powered by PokeAPI. Built for trainers.</p>
      </footer>
    </div>
  );
}
