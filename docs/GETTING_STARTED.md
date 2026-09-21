# Getting Started — Agora

This guide walks you through setting up the Agora development environment from scratch:
prerequisites, installation, running the app, and resolving common issues.

## Prerequisites

Agora uses **pnpm** as its package manager (chosen for disk-space efficiency and speed).
Do **not** use `npm install` or `yarn` — the lockfile is `pnpm-lock.yaml`.

### 1. Node.js

Vite 8 requires **Node.js 20.19+ or 22.12+**. Check your version:

```bash
node --version
```

If you need to manage multiple Node versions, install [nvm](https://github.com/nvm-sh/nvm)
or [fnm](https://github.com/Schniz/fnm).

### 2. pnpm

Install pnpm globally via Corepack (bundled with Node) or npm:

```bash
# Option A: Corepack (recommended)
corepack enable

# Option B: npm
npm install -g pnpm

# Verify
pnpm --version
```

## Installation

From the repository root:

```bash
pnpm install
```

This installs every dependency declared in `package.json` and creates a content-addressed
store shared across projects.

## Running the App

### Development server

```bash
pnpm dev
```

Starts the Vite dev server with hot module replacement (HMR). Output URL is shown in the
terminal — by default http://localhost:5173.

- Edits to `src/**` hot-reload instantly.
- The app mounts at `src/main.tsx` and renders the root component `src/App.tsx`.

### Production build

```bash
pnpm build
```

Runs `tsc -b` (type-checking across the project references) followed by `vite build`.
The optimized output is written to `dist/`.

### Preview the production build

```bash
pnpm preview
```

Serves the `dist/` output locally so you can verify the production artifact behaves
identically to the dev experience.

### Linting

```bash
pnpm lint
```

Runs Oxlint using the rules configured in `.oxlintrc.json`.

## Project Structure at a Glance

| Path | Purpose |
| --- | --- |
| `src/main.tsx` | Entry point — mounts the React root |
| `src/App.tsx` | Root application component |
| `src/index.css` | Global styles + Tailwind v4 `@theme` tokens |
| `src/App.css` | App-level component styles |
| `public/` | Unprocessed static assets (served at `/`) |
| `index.html` | SPA entry HTML |
| `vite.config.ts` | Vite config (React + Tailwind plugins) |

## Troubleshooting

| Problem | Likely cause | Fix |
| --- | --- | --- |
| `ERR_PNPM_NO_LOCKFILE` | Ran `npm install` instead of `pnpm` | `rm -rf node_modules && pnpm install` |
| Node engine not supported | Node below 20.19 / 22.12 | Upgrade Node via nvm/fnm |
| Port 5173 already in use | Another Vite instance running | `pnpm dev --port 5174` |
| Stale build artifacts | Previous build output | `rm -rf dist && pnpm build` |
| pnpm store issues | Corrupted global store | `pnpm store prune` |

## Useful Links

- [Vite docs](https://vite.dev/)
- [React docs](https://react.dev/)
- [Tailwind CSS docs](https://tailwindcss.com/)
- [Oxlint docs](https://oxc.rs/docs/guide/usage/linter/rules)