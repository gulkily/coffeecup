# Repository Guidelines

## Project Structure & Module Organization
Retain the hackathon briefs (`problem_statement.txt`, `submission_requirements.txt`, `judging.txt`) at the repo root so new contributors can quickly review scope and judging criteria. Place application code inside domain-focused folders: `apps/` for user-facing clients, `services/flare/` for Flare protocol adapters, `services/xrpl/` for ledger integrations, `contracts/` for smart contracts, and `packages/shared/` for cross-cutting utilities. Keep environment defaults and onboarding notes in `docs/` to complement these briefs.

## Build, Test, and Development Commands
Standardize on `pnpm` scripts once the workspace is scaffolded: `pnpm install` bootstraps dependencies, `pnpm dev` runs the local client + service stack with hot reload, `pnpm build` produces production bundles and contract artifacts, `pnpm lint` enforces formatting, and `pnpm test` executes the full test suite. Add composite scripts (e.g., `pnpm ci`) rather than ad-hoc shell snippets in PR descriptions.

## Coding Style & Naming Conventions
Author TypeScript or Rust modules with 2-space indentation and trailing commas. Favor `PascalCase` for React components and smart-contract classes, `camelCase` for functions/variables, and `kebab-case` for file and directory names. Run ESLint + Prettier (configured via `.eslintrc.cjs` and `.prettierrc`) before committing; include format-on-save settings in editor configs. Document XRPL network constants and Flare contract addresses in typed config files rather than inline literals.

## Testing Guidelines
Use Vitest for unit coverage of services and React Testing Library for UI behavior. House tests alongside source as `*.spec.ts` or `*.test.tsx` and target 80% coverage, ensuring ledger mocks cover happy-path and failure responses from XRPL and Flare. For integration, wire Playwright suites under `tests/e2e/` and gate merges on `pnpm test --runInBand` so deterministic snapshots detect regressions.

## Commit & Pull Request Guidelines
Follow imperative, present-tense commit messages similar to `Create problem_statement.txt`. Reference issue IDs in the footer when applicable and group related changes per commit. Pull requests must include: purpose summary, screenshots or terminal captures for UI/service changes, a checklist of impacted modules, and confirmation that `pnpm lint` and `pnpm test` passed. Request review from a Flare specialist when altering contracts. Keep PRs under ~300 lines to streamline judge-ready iterations.

## Security & Configuration Tips
Never commit private keys or XRPL secrets; load them through `.env.local` and document required keys in `.env.example`. Review contract diffs for reentrancy and oracle-manipulation risks, and add assertions around price feeds obtained via FTSO. Before releases, rerun tests against the Flare Coston testnet and XRPL testnet to confirm end-to-end settlement.
