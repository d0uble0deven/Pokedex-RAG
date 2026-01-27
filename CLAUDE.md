# CLAUDE.md — Project Constitution

## What this is
A portfolio project: Pokédex + card scan/value + team builder using RAG.

## Tech stack (locked)
- React (Vite)
- JavaScript only (no TypeScript)
- CSS Modules (no Tailwind, no shadcn, no CSS-in-JS)
- React Router for routing
- Node/Express backend later (API + RAG + card scan)
- SQLite for caching/small data

## Coding conventions
- Small components
- One component per file
- CSS Modules named `ComponentName.module.css`
- Prefer semantic HTML
- No inline styles unless necessary
- Keep dependencies minimal

## How to work in this repo
When you make changes:
1) Explain what you’ll do
2) Make the smallest change possible
3) Provide a **Verify** step (commands + expected result)

## Useful commands
- npm run dev
- npm run lint
- npm run format
- npm run build
