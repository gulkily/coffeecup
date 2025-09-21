# Flare Rewards Hub (Frontend)

A rapid prototype dashboard for demonstrating how XRPL wallet streaks can trigger oracle-priced bonuses using Flare FTSO data. The UI delivers a polished hero experience backed by typed mock services so we can swap in real SDK calls after judging feedback.

## Quick start
- `npm install` – install dependencies (Node 20.19+ recommended for Vite 7).

Copy `.env.example` to `.env` and configure:
- `VITE_DATA_MODE=mock` (default) for deterministic demo data
- Switch to `VITE_DATA_MODE=live` with `VITE_FLARE_RPC_URL`, `VITE_REWARD_CONTRACT_ADDRESS`, `VITE_XRPL_RPC_URL`, `VITE_XRPL_ACCOUNT`, and `VITE_XRPL_WALLET_HASH` set after deployment.
- `npm run dev` – launch the local dev server with hot reload.
- `npm run build` – generate a production bundle for the demo.

## Key sections
- `src/components/HeroPanel.tsx` – wallet CTA, streak summary, FTSO price snapshot.
- `src/components/RewardsGrid.tsx` – cards describing streak bonuses and multipliers.
- `src/components/LedgerTable.tsx` – mock XRPL settlement feed with explorer links.
- `src/services/*/mock*.ts` – typed async mocks for Flare, XRPL, and reward logic.

## Demo checklist
1. Connect button toggles state to prove wallet flow entry point.
2. Claim button animates to show asynchronous settlement and updates reward status.
3. Ledger feed highlights how payouts could mirror XRPL explorer activity.

## Swap-in roadmap
- Replace `mockFtso` with `@flarenetwork/flare-periphery-contracts` FTSO calls.
- Swap `mockLedger` for XRPL WebSocket subscription to the team wallet address.
- Promote rewards storage into a Flare smart-contract so streak metadata persists on-chain.

Capture screenshots of the hero panel, rewards grid, and ledger feed for the slide deck, then record a <60s walkthrough to embed in the repo README.

## Data adapters
- `VITE_DATA_MODE=mock` (default) keeps the dashboard on deterministic demo data.
- `VITE_DATA_MODE=live` will call the Flare periphery client, XRPL WebSocket listener, and rewards contract once those implementations are supplied.

## Live data flow
- Flare RPC + contract address hydrate RewardStreakManager reads via ethers.js.
- XRPL RPC (JSON-RPC or WebSocket proxy) pulls recent account transactions for the ledger feed.
- Wallet hash (bytes32) links XRPL accounts to the on-chain streak metadata.
