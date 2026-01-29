"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const features = [
  {
    id: "pokedex",
    title: "Pokedex",
    description: "Browse detailed stats, evolutions, and moves for every Pokemon. Your complete reference guide.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
        <path d="M2 12h7" />
        <path d="M15 12h7" />
      </svg>
    ),
    href: "/dexforge/pokedex",
    color: "#E5534B",
  },
  {
    id: "cards",
    title: "Card Valuation",
    description: "Scan and identify trading cards instantly. Get real-time market prices from top sources.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
    href: "/dexforge/cards",
    color: "#4D90D5",
  },
  {
    id: "team",
    title: "Team Builder",
    description: "Build competitive teams with AI-powered recommendations. Optimize your lineup for any format.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    href: "/dexforge/team",
    color: "#63BB5B",
  },
];

export default function DexForgeLanding() {
  const [darkMode, setDarkMode] = useState(true);

  const themeClass = darkMode ? styles.dark : styles.light;

  return (
    <div className={`${styles.container} ${themeClass}`}>
      <header className={styles.header}>
        <Link href="/dexforge" className={styles.logo}>
          <span className={styles.logoIcon}>D</span>
          <span className={styles.logoText}>DexForge</span>
        </Link>
        <button
          className={styles.themeToggle}
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </header>

      <main className={styles.main}>
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
            <Link
              key={feature.id}
              href={feature.href}
              className={styles.featureCard}
            >
              <div
                className={styles.featureIcon}
                style={{ color: feature.color }}
              >
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
          <p className={styles.footerText}>
            Powered by PokeAPI. Built for trainers.
          </p>
        </footer>
      </main>
    </div>
  );
}
