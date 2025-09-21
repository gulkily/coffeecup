# Flare Smart Contract & Demo Checklist

## Custom Contract Plan
- Location: `contracts/contracts/RewardStreakManager.sol` (Hardhat project).
- Responsibilities:
  - Track streak metadata per XRPL-linked wallet (wallet hash stored as bytes32).
  - Accept FTSO price submissions via `IPriceSubmitter` to lock the rate used for each claim.
  - Enforce claim cooldowns, multiplier tiers, and emit `RewardClaimed` events with XRPL payout references.
  - Provide read methods consumed by the web app (`getActiveStreak`, `getRewardMultiplier`, `getLastClaim`).
- Deployment: target Flare Coston testnet first, then Songbird/Flare mainnet when ready.

## Implementation Steps
1. Initialise Hardhat (`npm init -y`, `npm install --save-dev hardhat @flarenetwork/flare-periphery-contracts`).
2. Run `npm run build` to compile and regenerate artifacts; use `npm test` to validate behaviour; deploy to Coston using funded account keys stored in `.env` (never commit secrets).
3. Generate TypeChain bindings and publish them under `apps/web/src/contracts/` for runtime use when `VITE_DATA_MODE=live`.
4. Update backend adapters (`liveFtso`, `liveLedger`, `liveRewards`) to call the deployed contract and XRPL WebSocket client.

## Demo Evidence (README Requirement)
- Record a <90s Loom (or similar) demo showing:
  1. Contract deployment output.
  2. Dashboard hitting the live contract (show `VITE_DATA_MODE=live`).
  3. XRPL payout transaction appearing on the explorer.
- Embed the video link, screenshots, and transaction hash list in `README.md`.

Completing these steps satisfies the “custom smart contract + functioning demo” requirement for the hackathon submission.
