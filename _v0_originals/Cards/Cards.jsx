"use client";

import React from "react"

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface CardMatch {
  id: string;
  name: string;
  set: string;
  number: string;
  rarity: string;
  image: string;
  confidence: "high" | "medium" | "low";
}

interface PriceData {
  low: number;
  mid: number;
  high: number;
  market: number;
  lastUpdated: string;
  sources: string[];
}

const MOCK_MATCHES: CardMatch[] = [
  {
    id: "base1-4",
    name: "Charizard",
    set: "Base Set",
    number: "4/102",
    rarity: "Holo Rare",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    confidence: "high",
  },
  {
    id: "base2-4",
    name: "Charizard",
    set: "Base Set 2",
    number: "4/130",
    rarity: "Holo Rare",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    confidence: "medium",
  },
  {
    id: "legendary-3",
    name: "Charizard",
    set: "Legendary Collection",
    number: "3/110",
    rarity: "Holo Rare",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    confidence: "low",
  },
];

const MOCK_PRICES: PriceData = {
  low: 245.00,
  mid: 389.50,
  high: 650.00,
  market: 412.75,
  lastUpdated: "2024-01-15T14:32:00Z",
  sources: ["TCGPlayer", "eBay", "CardMarket"],
};

type ScanState = "idle" | "uploading" | "analyzing" | "complete" | "error";

export default function CardValuation() {
  const [darkMode, setDarkMode] = useState(true);
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [matches, setMatches] = useState<CardMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<CardMatch | null>(null);
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateScan = useCallback((imageUrl: string) => {
    setUploadedImage(imageUrl);
    setScanState("uploading");

    setTimeout(() => {
      setScanState("analyzing");
    }, 800);

    setTimeout(() => {
      setMatches(MOCK_MATCHES);
      setSelectedMatch(MOCK_MATCHES[0]);
      setPrices(MOCK_PRICES);
      setScanState("complete");
    }, 2500);
  }, []);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        simulateScan(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDemoScan = () => {
    simulateScan("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png");
  };

  const handleReset = () => {
    setScanState("idle");
    setUploadedImage(null);
    setMatches([]);
    setSelectedMatch(null);
    setPrices(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConfidenceColor = (confidence: CardMatch["confidence"]) => {
    switch (confidence) {
      case "high":
        return "var(--success)";
      case "medium":
        return "var(--warning)";
      case "low":
        return "var(--error)";
    }
  };

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
  <button className={`${styles.navItem} ${styles.active}`}>Cards</button>
  <Link href="/dexforge/team" className={styles.navItem}>Team Builder</Link>
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
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Card Valuation</h1>
          <p className={styles.pageSubtitle}>Scan or upload your Pokemon cards to get instant market valuations</p>
        </div>

        <div className={styles.content}>
          <section className={styles.uploadSection}>
            <h2 className={styles.sectionTitle}>Upload Card</h2>
            
            {scanState === "idle" && (
              <>
                <div
                  className={`${styles.uploadZone} ${isDragging ? styles.dragging : ""}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleInputChange}
                    accept="image/*"
                    className={styles.fileInput}
                  />
                  <div className={styles.uploadIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className={styles.uploadText}>Drag and drop your card image here</p>
                  <p className={styles.uploadHint}>or use the buttons below</p>
                </div>

                <div className={styles.uploadActions}>
                  <button className={styles.uploadBtn} onClick={handleUploadClick}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload Image
                  </button>
                  <button className={styles.cameraBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    Use Camera
                  </button>
                </div>

                <p className={styles.guidanceText}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  Best results with good lighting and a flat surface
                </p>

                <button className={styles.demoBtn} onClick={handleDemoScan}>
                  Try Demo Scan
                </button>
              </>
            )}

            {(scanState === "uploading" || scanState === "analyzing") && (
              <div className={styles.scanningState}>
                <div className={styles.scanPreview}>
                  {uploadedImage && (
                    <img src={uploadedImage || "/placeholder.svg"} alt="Uploaded card" className={styles.previewImage} />
                  )}
                  <div className={styles.scanOverlay}>
                    <div className={styles.scanLine} />
                  </div>
                </div>
                <div className={styles.scanStatus}>
                  <div className={styles.spinner} />
                  <span className={styles.scanText}>
                    {scanState === "uploading" ? "Uploading image..." : "Analyzing card..."}
                  </span>
                </div>
              </div>
            )}

            {scanState === "complete" && uploadedImage && (
              <div className={styles.completeState}>
                <div className={styles.scannedPreview}>
                  <img src={uploadedImage || "/placeholder.svg"} alt="Scanned card" className={styles.previewImage} />
                  <div className={styles.checkBadge}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                <button className={styles.resetBtn} onClick={handleReset}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 21h5v-5" />
                  </svg>
                  Scan Another
                </button>
              </div>
            )}
          </section>

          <section className={styles.resultsSection}>
            <h2 className={styles.sectionTitle}>Scan Results</h2>

            {scanState === "idle" && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                </div>
                <p className={styles.emptyText}>No card scanned yet</p>
                <p className={styles.emptyHint}>Upload or scan a card to see results</p>
              </div>
            )}

            {(scanState === "uploading" || scanState === "analyzing") && (
              <div className={styles.loadingState}>
                <div className={styles.loadingCard} />
                <div className={styles.loadingCard} />
                <div className={styles.loadingCard} />
              </div>
            )}

            {scanState === "complete" && matches.length > 0 && (
              <>
                <div className={styles.matchesHeader}>
                  <span className={styles.matchCount}>{matches.length} potential matches found</span>
                </div>

                <div className={styles.matchesList}>
                  {matches.map((match) => (
                    <button
                      key={match.id}
                      className={`${styles.matchCard} ${selectedMatch?.id === match.id ? styles.selected : ""}`}
                      onClick={() => setSelectedMatch(match)}
                    >
                      <div className={styles.matchImage}>
                        <img src={match.image || "/placeholder.svg"} alt={match.name} />
                      </div>
                      <div className={styles.matchInfo}>
                        <span className={styles.matchName}>{match.name}</span>
                        <span className={styles.matchSet}>{match.set}</span>
                        <span className={styles.matchNumber}>{match.number}</span>
                      </div>
                      <div className={styles.matchMeta}>
                        <span className={styles.matchRarity}>{match.rarity}</span>
                        <span
                          className={styles.confidence}
                          style={{ color: getConfidenceColor(match.confidence) }}
                        >
                          <span
                            className={styles.confidenceDot}
                            style={{ backgroundColor: getConfidenceColor(match.confidence) }}
                          />
                          {match.confidence.charAt(0).toUpperCase() + match.confidence.slice(1)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>

        {scanState === "complete" && selectedMatch && prices && (
          <section className={styles.valuationSection}>
            <h2 className={styles.sectionTitle}>Market Valuation</h2>
            <div className={styles.valuationHeader}>
              <div className={styles.selectedCard}>
                <span className={styles.selectedName}>{selectedMatch.name}</span>
                <span className={styles.selectedSet}>{selectedMatch.set} - {selectedMatch.number}</span>
              </div>
              <div className={styles.lastUpdated}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Updated {formatDate(prices.lastUpdated)}
              </div>
            </div>

            <div className={styles.priceGrid}>
              <div className={styles.priceCard}>
                <span className={styles.priceLabel}>Market Price</span>
                <span className={styles.priceValue}>{formatCurrency(prices.market)}</span>
                <span className={styles.priceNote}>Average across sources</span>
              </div>
              <div className={styles.priceCard}>
                <span className={styles.priceLabel}>Low</span>
                <span className={`${styles.priceValue} ${styles.low}`}>{formatCurrency(prices.low)}</span>
                <span className={styles.priceNote}>Recent low sale</span>
              </div>
              <div className={styles.priceCard}>
                <span className={styles.priceLabel}>Mid</span>
                <span className={`${styles.priceValue} ${styles.mid}`}>{formatCurrency(prices.mid)}</span>
                <span className={styles.priceNote}>Median price</span>
              </div>
              <div className={styles.priceCard}>
                <span className={styles.priceLabel}>High</span>
                <span className={`${styles.priceValue} ${styles.high}`}>{formatCurrency(prices.high)}</span>
                <span className={styles.priceNote}>Recent high sale</span>
              </div>
            </div>

            <div className={styles.sourcesSection}>
              <span className={styles.sourcesLabel}>Data sources:</span>
              <div className={styles.sourcesBadges}>
                {prices.sources.map((source) => (
                  <span key={source} className={styles.sourceBadge}>{source}</span>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
