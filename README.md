# Flare Rewards Hub

Flare Rewards Hub pairs XRPL wallet streaks with FTSO-priced bonuses so communities see instant, verifiable rewards.

## Streak mechanic
- Each participant links an XRPL wallet. A streak counts the number of consecutive 24-hour windows in which that wallet completes the required on-ledger engagement (e.g., funding a community pool or confirming a check-in transaction).
- A backend claimer watches XRPL activity, hashes the wallet address, and calls the `RewardStreakManager` contract to record the day’s check-in. Staying within the daily window (24 hours + a two-hour grace period) keeps the streak alive.
- Break the cadence and the streak resets to day one. Claims capture the FTSO price used so dashboards can show how longer streaks unlock higher bonuses.

## Run the project locally
1. **Install prerequisites**
   - Node.js >= 20.19.0 (use `nvm install 20` or download from nodejs.org).
   - pnpm >= 9 (`corepack enable` then `corepack prepare pnpm@latest --activate`).
2. **Install dependencies**
   ```bash
   cd apps/web
   pnpm install
   ```
3. **Configure environment**
   ```bash
   cp .env.example .env
   # Leave VITE_DATA_MODE=mock until live SDKs are wired
   ```
4. **Start the dev server**
   ```bash
   pnpm dev
   ```
   Visit the printed URL (default `http://localhost:5173`) to explore the dashboard.
5. **Build for production (optional)**
   ```bash
   pnpm build
   ```
   This ensures the TypeScript types and Vite bundler succeed before demos.
6. **Quality gates**
   ```bash
   pnpm lint
   pnpm test
   ```
   Run these before submitting updates to keep formatting and coverage aligned with hackathon guidelines.

## Submission artefact checklist
- **Demo video**: [Loom walkthrough](https://www.loom.com/share/e29d405c0f1f4c0e8189222e11b9e013?sid=2596150a-d7eb-4e09-93c4-ebe83f8d5189)
- **Screenshots**: [Dashboard hero capture](./Screenshot%202025-09-21%20121926.png) (replace with latest hero, rewards grid, and ledger feed captures).
- **Smart contract**: [`docs/flare-contract.md`](docs/flare-contract.md) summarises the `RewardStreakManager.sol` deployment plan.
- **Technical guide**: [`docs/technical-description.md`](docs/technical-description.md) documents stack decisions and integration points.
- **Slide deck**: [`docs/slide-deck.md`](docs/slide-deck.md) contains export-ready copy for Canva or Remark.
- **Issue tracking**: [`PLAN.md`](PLAN.md) lists sprint objectives and outstanding tasks.

![Flare Rewards Hub dashboard hero](./Screenshot%202025-09-21%20121926.png)

## Repository map
- [`apps/web/`](apps/web/) - React + Vite dashboard (mock/live data toggle).
- [`contracts/`](contracts/) - _To be added_: Hardhat project for the Flare streak manager.
- [`docs/`](docs/) - Hackathon summaries, technical notes, slide outline, smart contract checklist.
- [`AGENTS.md`](AGENTS.md) - Contributor guidelines tailored to this codebase.
- [`PLAN.md`](PLAN.md) - 25-minute sprint agenda and deliverable status.

Keep these artefacts fresh before submission so judges can verify live functionality and collateral.

## Documentation quick links
- [`docs/summary.md`](docs/summary.md) - one-slide pitch for the hackathon booth.
- [`docs/full-description.md`](docs/full-description.md) - extended narrative for submission forms.
- [`docs/flare-contract.md`](docs/flare-contract.md) - deployment checklist for the Flare smart contract.
- [`docs/technical-description.md`](docs/technical-description.md) - architecture and integration notes.
- [`docs/slides-outline.md`](docs/slides-outline.md) - talking points used to shape the final deck.
- [`docs/slide-deck.md`](docs/slide-deck.md) - ready-to-export slide copy.

## Smart contract workspace
1. `cd contracts && pnpm install` - install the Hardhat toolchain (Node >=20 recommended).
2. `pnpm build` - compile `RewardStreakManager.sol` and regenerate artifacts.
3. `pnpm test` - run the Hardhat unit suite.
4. Copy `.env.example` to `.env`, populate `COSTON_RPC_URL`, `COSTON_PRIVATE_KEY`, `COSTON_EXPLORER_KEY`, then run `pnpm deploy:coston` once ready.

Artifacts (`artifacts/`, `typechain-types/`) power the frontend when `VITE_DATA_MODE=live`.
