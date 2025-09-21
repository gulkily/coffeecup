# Technical Description

- **Frontend stack**: React + TypeScript (Vite 7) with a `VITE_DATA_MODE` toggle that swaps between deterministic mock data and live adapters. State is managed through a typed `useDashboardData` hook so network clients slot in without UI rewrites, and ethers.js bridges the RewardStreakManager ABI for on-chain reads.
- **Flare integration**: Targets `@flarenetwork/flare-periphery-contracts` to query the FTSO price service; the custom contract (see below) will expose streak metadata and emit claim events consumed by the dashboard. Oracle updates drive the multiplier logic surfaced in the hero panel.
- **XRPL integration**: Uses `xrpl` WebSocket subscriptions to stream account transactions, converting them into ledger rows with explorer deep links. Instant settlement and public hashes reinforce trust during demos.
- **Smart-contract layer**: A bespoke `RewardStreakManager` Solidity contract on Flare stores wallet streaks—consecutive days an XRPL wallet hits the required engagement event—enforces cooldown logic, and authorises XRPL payout triggers. Events include the FTSO snapshot used during claims so auditors can replay state at any block.
- **Tooling**: Hardhat workspace under `contracts/` with TypeChain bindings exported to the frontend, Vitest for component tests, and Playwright for end-to-end verification once live integrations are active.
