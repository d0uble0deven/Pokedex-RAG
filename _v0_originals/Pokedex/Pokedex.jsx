"use client";

import React from "react";

import { useState, useEffect } from "react";
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
  stats: { base_stat: number; stat: { name: string } }[];
  height: number;
  weight: number;
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  base_experience: number;
  moves: { move: { name: string; url: string }; version_group_details: { level_learned_at: number; move_learn_method: { name: string } }[] }[];
  species: { url: string };
}

interface PokemonListItem {
  name: string;
  url: string;
}

interface EvolutionChain {
  species: { name: string; url: string };
  evolves_to: EvolutionChain[];
  evolution_details: { min_level: number | null; trigger: { name: string }; item: { name: string } | null }[];
}

interface MoveDetail {
  name: string;
  type: { name: string };
  power: number | null;
  accuracy: number | null;
  pp: number;
  damage_class: { name: string };
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

const STAT_ABBR: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SPA",
  "special-defense": "SPD",
  speed: "SPE",
};

type Tab = "overview" | "stats" | "evolution" | "moves";

export default function DexForge() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [movesData, setMovesData] = useState<MoveDetail[]>([]);
  const [movesLoading, setMovesLoading] = useState(false);
  const limit = 24;

  useEffect(() => {
    fetchPokemon();
  }, [page]);

  useEffect(() => {
    if (selected) {
      setActiveTab("overview");
      fetchEvolution(selected.species.url);
    }
  }, [selected]);

  async function fetchPokemon() {
    setLoading(true);
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${page * limit}`
    );
    const data = await res.json();
    setPokemon(data.results);
    setLoading(false);
  }

  async function fetchDetails(name: string) {
    setDetailLoading(true);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();
    setSelected(data);
    setDetailLoading(false);
  }

  async function fetchEvolution(speciesUrl: string) {
    try {
      const speciesRes = await fetch(speciesUrl);
      const speciesData = await speciesRes.json();
      const evoRes = await fetch(speciesData.evolution_chain.url);
      const evoData = await evoRes.json();
      setEvolutionChain(evoData.chain);
    } catch {
      setEvolutionChain(null);
    }
  }

  async function fetchMoves() {
    if (!selected || movesData.length > 0) return;
    setMovesLoading(true);
    const movesToFetch = selected.moves.slice(0, 20);
    const details: MoveDetail[] = [];
    for (const m of movesToFetch) {
      try {
        const res = await fetch(m.move.url);
        const data = await res.json();
        details.push({
          name: data.name,
          type: data.type,
          power: data.power,
          accuracy: data.accuracy,
          pp: data.pp,
          damage_class: data.damage_class,
        });
      } catch {
        // skip
      }
    }
    setMovesData(details);
    setMovesLoading(false);
  }

  useEffect(() => {
    if (activeTab === "moves" && selected) {
      fetchMoves();
    }
  }, [activeTab, selected]);

  useEffect(() => {
    if (selected) {
      setMovesData([]);
    }
  }, [selected]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    setDetailLoading(true);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase().trim()}`
      );
      if (res.ok) {
        const data = await res.json();
        setSelected(data);
      }
    } catch {
      // ignore
    }
    setDetailLoading(false);
  }

  function formatId(id: number) {
    return `#${String(id).padStart(4, "0")}`;
  }

  function formatName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
  }

  function getStatPercent(value: number) {
    return Math.min((value / 255) * 100, 100);
  }

  function getStatColor(value: number) {
    if (value < 50) return "#E5534B";
    if (value < 80) return "#F3D23B";
    if (value < 100) return "#63BB5B";
    return "#4D90D5";
  }

  function getTotalStats(stats: Pokemon["stats"]) {
    return stats.reduce((sum, s) => sum + s.base_stat, 0);
  }

  function getEvolutionList(chain: EvolutionChain): { name: string; id: number; trigger: string }[] {
    const list: { name: string; id: number; trigger: string }[] = [];
    
    function traverse(node: EvolutionChain, trigger: string) {
      const id = parseInt(node.species.url.split("/").filter(Boolean).pop() || "1");
      list.push({ name: node.species.name, id, trigger });
      for (const evo of node.evolves_to) {
        const detail = evo.evolution_details[0];
        let triggerText = "";
        if (detail?.min_level) {
          triggerText = `Lv. ${detail.min_level}`;
        } else if (detail?.item) {
          triggerText = formatName(detail.item.name);
        } else if (detail?.trigger) {
          triggerText = formatName(detail.trigger.name);
        }
        traverse(evo, triggerText);
      }
    }
    
    traverse(chain, "");
    return list;
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
  <button className={`${styles.navItem} ${styles.active}`}>Pokedex</button>
  <Link href="/dexforge/cards" className={styles.navItem}>Cards</Link>
  <Link href="/dexforge/team" className={styles.navItem}>Team Builder</Link>
          </nav>
        </div>
        <div className={styles.headerRight}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>
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
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>
              Pokemon
              <span className={styles.count}>{page * limit + 1}-{page * limit + pokemon.length}</span>
            </h2>
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewBtn} ${viewMode === "grid" ? styles.active : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                className={`${styles.viewBtn} ${viewMode === "list" ? styles.active : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="4" width="18" height="4" rx="1" />
                  <rect x="3" y="10" width="18" height="4" rx="1" />
                  <rect x="3" y="16" width="18" height="4" rx="1" />
                </svg>
              </button>
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
            </div>
          ) : (
            <div className={viewMode === "grid" ? styles.grid : styles.list}>
              {pokemon.map((p, i) => {
                const id = page * limit + i + 1;
                return (
                  <button
                    key={p.name}
                    className={`${styles.pokemonCard} ${selected?.name === p.name ? styles.selected : ""}`}
                    onClick={() => fetchDetails(p.name)}
                  >
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                      alt={p.name}
                      className={styles.pokemonSprite}
                      loading="lazy"
                    />
                    <div className={styles.pokemonInfo}>
                      <span className={styles.pokemonId}>{formatId(id)}</span>
                      <span className={styles.pokemonName}>{formatName(p.name)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className={styles.pagination}>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className={styles.pageBtn}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>Page {page + 1}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className={styles.pageBtn}
            >
              Next
            </button>
          </div>
        </aside>

        <section className={styles.detail}>
          {detailLoading ? (
            <div className={styles.detailLoading}>
              <div className={styles.spinner} />
            </div>
          ) : selected ? (
            <>
              <div className={styles.detailHeader}>
                <div className={styles.detailTitle}>
                  <h1 className={styles.detailName}>{formatName(selected.name)}</h1>
                  <span className={styles.detailId}>{formatId(selected.id)}</span>
                </div>
                <div className={styles.types}>
                  {selected.types.map((t) => (
                    <span
                      key={t.type.name}
                      className={styles.type}
                      style={{ backgroundColor: TYPE_COLORS[t.type.name] }}
                    >
                      {t.type.name.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${activeTab === "overview" ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "stats" ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab("stats")}
                >
                  Stats
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "evolution" ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab("evolution")}
                >
                  Evolution
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "moves" ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab("moves")}
                >
                  Moves
                </button>
              </div>

              <div className={styles.tabContent}>
                {activeTab === "overview" && (
                  <div className={styles.overviewTab}>
                    <div className={styles.overviewGrid}>
                      <div className={styles.imageSection}>
                        <div
                          className={styles.imageWrapper}
                          style={{
                            background: `linear-gradient(135deg, ${TYPE_COLORS[selected.types[0].type.name]}22 0%, transparent 60%)`,
                          }}
                        >
                          <img
                            src={selected.sprites.other["official-artwork"].front_default || selected.sprites.front_default}
                            alt={selected.name}
                            className={styles.detailImage}
                          />
                        </div>
                      </div>

                      <div className={styles.overviewInfo}>
                        <div className={styles.metrics}>
                          <div className={styles.metric}>
                            <span className={styles.metricLabel}>Height</span>
                            <span className={styles.metricValue}>{(selected.height / 10).toFixed(1)}m</span>
                          </div>
                          <div className={styles.metric}>
                            <span className={styles.metricLabel}>Weight</span>
                            <span className={styles.metricValue}>{(selected.weight / 10).toFixed(1)}kg</span>
                          </div>
                          <div className={styles.metric}>
                            <span className={styles.metricLabel}>Base XP</span>
                            <span className={styles.metricValue}>{selected.base_experience || "—"}</span>
                          </div>
                        </div>

                        <div className={styles.abilitiesSection}>
                          <h3 className={styles.sectionTitle}>Abilities</h3>
                          <div className={styles.abilities}>
                            {selected.abilities.map((a) => (
                              <span
                                key={a.ability.name}
                                className={`${styles.ability} ${a.is_hidden ? styles.hidden : ""}`}
                              >
                                {formatName(a.ability.name)}
                                {a.is_hidden && <span className={styles.hiddenTag}>Hidden</span>}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className={styles.quickStats}>
                          <h3 className={styles.sectionTitle}>Base Stats</h3>
                          <div className={styles.quickStatsGrid}>
                            {selected.stats.map((s) => (
                              <div key={s.stat.name} className={styles.quickStat}>
                                <span className={styles.quickStatLabel}>{STAT_ABBR[s.stat.name]}</span>
                                <span className={styles.quickStatValue}>{s.base_stat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "stats" && (
                  <div className={styles.statsTab}>
                    <div className={styles.statsSection}>
                      <div className={styles.statHeader}>
                        <h3 className={styles.sectionTitle}>Base Stats</h3>
                        <span className={styles.totalStat}>
                          Total: <strong>{getTotalStats(selected.stats)}</strong>
                        </span>
                      </div>
                      <div className={styles.stats}>
                        {selected.stats.map((s) => (
                          <div key={s.stat.name} className={styles.stat}>
                            <span className={styles.statName}>{STAT_ABBR[s.stat.name]}</span>
                            <div className={styles.statBarWrapper}>
                              <div
                                className={styles.statBar}
                                style={{
                                  width: `${getStatPercent(s.base_stat)}%`,
                                  backgroundColor: getStatColor(s.base_stat),
                                }}
                              />
                            </div>
                            <span className={styles.statValue}>{s.base_stat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.statComparison}>
                      <h3 className={styles.sectionTitle}>Stat Analysis</h3>
                      <div className={styles.analysisGrid}>
                        <div className={styles.analysisCard}>
                          <span className={styles.analysisLabel}>Highest</span>
                          <span className={styles.analysisValue}>
                            {STAT_ABBR[selected.stats.reduce((a, b) => a.base_stat > b.base_stat ? a : b).stat.name]}
                          </span>
                          <span className={styles.analysisNum}>
                            {Math.max(...selected.stats.map(s => s.base_stat))}
                          </span>
                        </div>
                        <div className={styles.analysisCard}>
                          <span className={styles.analysisLabel}>Lowest</span>
                          <span className={styles.analysisValue}>
                            {STAT_ABBR[selected.stats.reduce((a, b) => a.base_stat < b.base_stat ? a : b).stat.name]}
                          </span>
                          <span className={styles.analysisNum}>
                            {Math.min(...selected.stats.map(s => s.base_stat))}
                          </span>
                        </div>
                        <div className={styles.analysisCard}>
                          <span className={styles.analysisLabel}>Average</span>
                          <span className={styles.analysisValue}>BST</span>
                          <span className={styles.analysisNum}>
                            {Math.round(getTotalStats(selected.stats) / 6)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "evolution" && (
                  <div className={styles.evolutionTab}>
                    {evolutionChain ? (
                      <div className={styles.evolutionChain}>
                        {getEvolutionList(evolutionChain).map((evo, i, arr) => (
                          <React.Fragment key={evo.name}>
                            <button
                              className={`${styles.evolutionCard} ${evo.name === selected.name ? styles.currentEvo : ""}`}
                              onClick={() => fetchDetails(evo.name)}
                            >
                              <img
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`}
                                alt={evo.name}
                                className={styles.evolutionImage}
                              />
                              <span className={styles.evolutionName}>{formatName(evo.name)}</span>
                              <span className={styles.evolutionId}>{formatId(evo.id)}</span>
                            </button>
                            {i < arr.length - 1 && (
                              <div className={styles.evolutionArrow}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                                {arr[i + 1].trigger && (
                                  <span className={styles.evolutionTrigger}>{arr[i + 1].trigger}</span>
                                )}
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.noEvolution}>
                        <p>Loading evolution data...</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "moves" && (
                  <div className={styles.movesTab}>
                    {movesLoading ? (
                      <div className={styles.movesLoading}>
                        <div className={styles.spinner} />
                        <p>Loading moves...</p>
                      </div>
                    ) : (
                      <>
                        <div className={styles.movesHeader}>
                          <span className={styles.moveCount}>{selected.moves.length} moves available</span>
                        </div>
                        <div className={styles.movesList}>
                          <div className={styles.movesTableHeader}>
                            <span>Move</span>
                            <span>Type</span>
                            <span>Cat.</span>
                            <span>Power</span>
                            <span>Acc.</span>
                            <span>PP</span>
                          </div>
                          {movesData.map((move) => (
                            <div key={move.name} className={styles.moveRow}>
                              <span className={styles.moveName}>{formatName(move.name)}</span>
                              <span
                                className={styles.moveType}
                                style={{ backgroundColor: TYPE_COLORS[move.type.name] }}
                              >
                                {move.type.name}
                              </span>
                              <span className={styles.moveCategory} data-category={move.damage_class.name}>
                                {move.damage_class.name.charAt(0).toUpperCase()}
                              </span>
                              <span className={styles.movePower}>{move.power || "—"}</span>
                              <span className={styles.moveAccuracy}>{move.accuracy || "—"}</span>
                              <span className={styles.movePP}>{move.pp}</span>
                            </div>
                          ))}
                        </div>
                        {movesData.length < selected.moves.length && (
                          <p className={styles.movesNote}>Showing first 20 moves</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
                </svg>
              </div>
              <h2 className={styles.placeholderTitle}>Select a Pokemon</h2>
              <p className={styles.placeholderText}>Choose from the list or search to view detailed stats and information</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
