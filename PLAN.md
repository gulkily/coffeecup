# 25-Minute Sprint Plan

## Objectives
- Deliver a polished Frontend MVP for the "Flare Rewards Hub" dashboard.
- Prepare demo collateral (README highlights, screenshots, quick voice-over recording).
- Draft slide narrative showcasing problem, solution, tech integrations, and roadmap.

## Minute-by-Minute Timeline
- **0:00 – 0:03**: Align on story. Elevator pitch; outline README + slide beats.
- **0:03 – 0:06**: Scaffold Vite React TS app via `pnpm create vite@latest apps/web --template react-ts`; install deps.
- **0:06 – 0:12**: Build hero dashboard layout (wallet streak, rewards tiles, XRPL payouts section) with mock data.
- **0:12 – 0:18**: Implement `services/flare/mockFtso.ts` and `services/xrpl/mockLedger.ts`; wire to UI components.
- **0:18 – 0:22**: Add claim interactions, loading states, and highlight state transitions (streak gain, payout confirmation).
- **0:22 – 0:25**: Capture screenshots + screen recording; update README summary and slide outline.

## Work Breakdown
- **Frontend**: App shell, hero panel, rewards grid, ledger table, state management, styling.
- **Mocks**: Typed interfaces for price quotes, rewards, and ledger entries; placeholder async functions.
- **Collateral**: README sections (Summary, Tech Stack, How Flare + XRPL integrate, Demo); slides (Problem, Solution, Architecture, Demo, Future Work).

## Deliverables Checklist
- [x] `apps/web` scaffolded with clean dashboard UI.
- [x] Mock service modules returning deterministic data.
- [x] Interactive claim button + visual states.
- [x] Updated README with demo assets linked.
- [x] Slide deck outline ready for Canva transfer.
- [ ] Recorded demo walkthrough.

## Risks & Mitigations
- **Time overrun**: Stick to timeline; defer styling flourishes until core sections render.
- **Integration gaps**: Keep mocks swappable with real SDK clients by exporting typed contracts.
- **Demo glitches**: Capture video once mocks stabilized; avoid live wallet connections during pitch.
