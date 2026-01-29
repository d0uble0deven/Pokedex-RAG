"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: { type: { name: string } }[];
}

interface Recommendation {
  pokemon: Pokemon;
  reason: string;
  synergy: "high" | "medium" | "low";
}

const TYPE_COLORS: Record<string, string> = {
  normal: "#9099A1",
  fire: "#FF9C54",
  water: "#4D90D5",
  electric: "#F3D23B",
  grass: "#63BB5B",
  ice: "#74CEC0",
  fighting: "#CE4069",
  poison: "#AB6AC8",
  ground: "#D97746",
  flying: "#8FA8DD",
  psychic: "#F97176",
  bug: "#90C12C",
  rock: "#C7B78B",
  ghost: "#5269AC",
  dragon: "#0A6DC4",
  dark: "#5A5366",
  steel: "#5A8EA1",
  fairy: "#EC8FE6",
};

const SAMPLE_RECOMMENDATIONS: { id: number; reason: string; synergy: "high" | "medium" | "low" }[] = [
  { id: 6, reason: "Charizard provides strong Fire/Flying coverage and can handle Grass and Bug types that threaten your team.", synergy: "high" },
  { id: 130, reason: "Gyarados offers Water/Flying typing with Intimidate, providing physical bulk and type coverage.", synergy: "high" },
  { id: 376, reason: "Metagross brings Steel/Psychic defensive synergy and powerful physical attacks.", synergy: "medium" },
  { id: 445, reason: "Garchomp's Ground/Dragon typing covers many threats and has excellent speed.", synergy: "high" },
  { id: 248, reason: "Tyranitar sets up Sandstorm and provides Rock/Dark coverage with high bulk.", synergy: "medium" },
  { id: 94, reason: "Gengar offers special attacking power and can trap opponents with Shadow Tag.", synergy: "low" },
];

export default function TeamBuilder() {
  const [darkMode, setDarkMode] = useState(true);
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState("competitive");
  const [preferredType, setPreferredType] = useState("any");

  async function fetchPokemon(id: number): Promise<Pokemon> {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return res.json();
  }

  async function getRecommendations() {
    if (team.length >= 6) return;
    
    setLoading(true);
    setRecommendations([]);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const teamIds = team.map((p) => p.id);
    const availableRecs = SAMPLE_RECOMMENDATIONS.filter((r) => !teamIds.includes(r.id));
    
    const recs: Recommendation[] = [];
    for (const rec of availableRecs.slice(0, 4)) {
      const pokemon = await fetchPokemon(rec.id);
      recs.push({
        pokemon,
        reason: rec.reason,
        synergy: rec.synergy,
      });
    }
    
    setRecommendations(recs);
    setLoading(false);
  }

  function addToTeam(pokemon: Pokemon) {
    if (team.length < 6 && !team.find((p) => p.id === pokemon.id)) {
      setTeam([...team, pokemon]);
      setRecommendations(recommendations.filter((r) => r.pokemon.id !== pokemon.id));
    }
  }

  function removeFromTeam(id: number) {
    setTeam(team.filter((p) => p.id !== id));
  }

  function formatName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
  }

  function formatId(id: number) {
    return `#${String(id).padStart(4, "0")}`;
  }

  const themeClass = darkMode ? styles.dark : styles.light;

  return (
    <div className={`${styles.container} ${themeClass}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
<Link href="/dexforge" className={styles.logo}>
  <span className={styles.logoIcon}>D</span>
  <span className={styles.logoText}>DexForge</span>
  </Link>
  <nav className={styles.nav}>
  <Link href="/dexforge/pokedex" className={styles.navItem}>Pokedex</Link>
  <Link href="/dexforge/cards" className={styles.navItem}>Cards</Link>
  <button className={`${styles.navItem} ${styles.active}`}>Team Builder</button>
          </nav>
        </div>
        <div className={styles.headerRight}>
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
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Team Builder</h1>
            <p className={styles.pageSubtitle}>Build your perfect team with intelligent recommendations</p>
          </div>

          <section className={styles.teamSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Current Team</h2>
              <span className={styles.teamCount}>{team.length}/6</span>
            </div>
            <div className={styles.teamGrid}>
              {Array.from({ length: 6 }).map((_, i) => {
                const pokemon = team[i];
                return pokemon ? (
                  <div key={pokemon.id} className={styles.teamSlot}>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromTeam(pokemon.id)}
                      aria-label="Remove from team"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                    <div
                      className={styles.slotImage}
                      style={{
                        background: `linear-gradient(135deg, ${TYPE_COLORS[pokemon.types[0].type.name]}33 0%, transparent 60%)`,
                      }}
                    >
                      <img
                        src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
                        alt={pokemon.name}
                      />
                    </div>
                    <div className={styles.slotInfo}>
                      <span className={styles.slotId}>{formatId(pokemon.id)}</span>
                      <span className={styles.slotName}>{formatName(pokemon.name)}</span>
                      <div className={styles.slotTypes}>
                        {pokemon.types.map((t) => (
                          <span
                            key={t.type.name}
                            className={styles.slotType}
                            style={{ backgroundColor: TYPE_COLORS[t.type.name] }}
                          >
                            {t.type.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={`empty-${i}`} className={styles.emptySlot}>
                    <div className={styles.emptyIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v8M8 12h8" />
                      </svg>
                    </div>
                    <span className={styles.emptyText}>Add Pokemon</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className={styles.inputSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Get Recommendations</h2>
            </div>
            <div className={styles.inputCard}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Describe what you want</label>
                <textarea
                  className={styles.textarea}
                  placeholder="e.g. fire Pokemon that looks cool and has evolutions, or a bulky water type for defense..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
              </div>
              <div className={styles.optionsRow}>
                <div className={styles.selectGroup}>
                  <label className={styles.inputLabel}>Game Format</label>
                  <select
                    className={styles.select}
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    <option value="competitive">Competitive</option>
                    <option value="story">Story Mode</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>
                <div className={styles.selectGroup}>
                  <label className={styles.inputLabel}>Preferred Type</label>
                  <select
                    className={styles.select}
                    value={preferredType}
                    onChange={(e) => setPreferredType(e.target.value)}
                  >
                    <option value="any">Any Type</option>
                    {Object.keys(TYPE_COLORS).map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className={styles.recommendBtn}
                  onClick={getRecommendations}
                  disabled={loading || team.length >= 6}
                >
                  {loading ? (
                    <>
                      <span className={styles.spinner} />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Recommend Pokemon
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {(loading || recommendations.length > 0) && (
            <section className={styles.resultsSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recommendations</h2>
                {!loading && (
                  <span className={styles.synergyHint}>Based on team synergy</span>
                )}
              </div>
              
              {loading ? (
                <div className={styles.loadingState}>
                  <div className={styles.loadingSpinner} />
                  <p className={styles.loadingText}>Analyzing your team and finding the best matches...</p>
                </div>
              ) : (
                <div className={styles.resultsGrid}>
                  {recommendations.map((rec) => (
                    <div key={rec.pokemon.id} className={styles.recCard}>
                      <div className={styles.recHeader}>
                        <span className={`${styles.synergyBadge} ${styles[rec.synergy]}`}>
                          {rec.synergy === "high" ? "High Synergy" : rec.synergy === "medium" ? "Good Fit" : "Consider"}
                        </span>
                      </div>
                      <div
                        className={styles.recImage}
                        style={{
                          background: `linear-gradient(135deg, ${TYPE_COLORS[rec.pokemon.types[0].type.name]}22 0%, transparent 60%)`,
                        }}
                      >
                        <img
                          src={rec.pokemon.sprites.other["official-artwork"].front_default || rec.pokemon.sprites.front_default}
                          alt={rec.pokemon.name}
                        />
                      </div>
                      <div className={styles.recInfo}>
                        <div className={styles.recNameRow}>
                          <span className={styles.recName}>{formatName(rec.pokemon.name)}</span>
                          <span className={styles.recId}>{formatId(rec.pokemon.id)}</span>
                        </div>
                        <div className={styles.recTypes}>
                          {rec.pokemon.types.map((t) => (
                            <span
                              key={t.type.name}
                              className={styles.recType}
                              style={{ backgroundColor: TYPE_COLORS[t.type.name] }}
                            >
                              {t.type.name}
                            </span>
                          ))}
                        </div>
                        <p className={styles.recReason}>{rec.reason}</p>
                      </div>
                      <button
                        className={styles.addBtn}
                        onClick={() => addToTeam(rec.pokemon)}
                        disabled={team.length >= 6}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add to Team
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
