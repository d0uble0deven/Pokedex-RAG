import { Outlet } from 'react-router-dom';
import TopNav from '../TopNav/TopNav';
import styles from './AppShell.module.css';

export default function AppShell() {
  return (
    <div className={styles.shell}>
      <TopNav />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
