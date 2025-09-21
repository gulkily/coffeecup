# Flare Rewards Hub

Flare Rewards Hub pairs XRPL wallet streaks with FTSO-priced bonuses so communities see instant, verifiable rewards.

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
- **Demo video**: _Add Loom/YouTube link showcasing live contract + XRPL payout._
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
