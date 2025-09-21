# Flare Rewards Hub

Flare Rewards Hub pairs XRPL wallet streaks with FTSO-priced bonuses so communities see instant, verifiable rewards.

## Streak mechanic
- Each participant links an XRPL wallet. A streak counts the number of consecutive 24-hour windows in which that wallet completes the required on-ledger engagement (e.g., funding a community pool or confirming a check-in transaction).
- A backend claimer watches XRPL activity, hashes the wallet address, and calls the `RewardStreakManager` contract to record the day’s check-in. Staying within the daily window (24 hours + a two-hour grace period) keeps the streak alive.
- Break the cadence and the streak resets to day one. Claims capture the FTSO price used so dashboards can show how longer streaks unlock higher bonuses.

## Run the project locally
1. **Install prerequisites**
   - Node.js ≥ 20.19.0 (use `nvm install 20` or download from nodejs.org).
   - npm (bundled with Node 20) or pnpm if you prefer workspaces.
2. **Install dependencies**
   ```bash
   cd apps/web
   npm install
   ```
3. **Configure environment**
   ```bash
   cp .env.example .env
   # Leave VITE_DATA_MODE=mock until live SDKs are wired
   ```
4. **Start the dev server**
   ```bash
   npm run dev
   ```
   Visit the printed URL (default `http://localhost:5173`) to explore the dashboard.
5. **Build for production (optional)**
   ```bash
   npm run build
   ```
   This ensures the TypeScript types and Vite bundler succeed before demos.

## Submission artefact checklist (placeholders)
- **Demo video**: https://www.loom.com/share/e29d405c0f1f4c0e8189222e11b9e013?sid=2596150a-d7eb-4e09-93c4-ebe83f8d5189
- **Screenshots**: _Insert hero, rewards grid, ledger feed captures here._
- **Smart contract**: _Document deployment address and `RewardStreakManager.sol` summary._
- **Technical guide**: _Link to docs/technical-description.md once finalized._
- **Slide deck**: _Add Canva link after export._
- **Issue tracking**: _Reference GitHub Issues or task board URL if available._

## Repository map
- `apps/web/` – React + Vite dashboard (mock/live data toggle).
- `contracts/` – _To be added_: Hardhat project for the Flare streak manager.
- `docs/` – Hackathon summaries, technical notes, slide outline, smart contract checklist.
- `AGENTS.md` – Contributor guidelines tailored to this codebase.
- `PLAN.md` – 25-minute sprint agenda and deliverable status.

Update each placeholder before submission so judges can verify live functionality and collateral.

## Smart contract workspace
1. `cd contracts && npm install` – install Hardhat toolchain (Node >=20 recommended).
2. `npm run build` – compile RewardStreakManager.sol and regenerate artifacts.
3. `npm test` – run the Hardhat unit suite.
4. Copy `.env.example` to `.env`, populate `COSTON_RPC_URL`, `COSTON_PRIVATE_KEY`, `COSTON_EXPLORER_KEY`, then run `npm run deploy:coston` once ready.

Artifacts (`artifacts/`, `typechain-types/`) power the frontend when `VITE_DATA_MODE=live`.
