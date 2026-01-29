import { NavLink, Link } from 'react-router-dom';
import styles from './TopNav.module.css';

const navItems = [
  { label: 'Pokedex', to: '/pokedex' },
  { label: 'Cards', to: '/cards' },
  { label: 'Team Builder', to: '/team' },
];

export default function TopNav() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoIcon}>D</span>
        <span className={styles.logoText}>DexForge</span>
      </Link>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
