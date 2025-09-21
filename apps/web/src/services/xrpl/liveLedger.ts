import type { LedgerEntry } from '../../types'

// Placeholder for XRPL WebSocket integration.
// Replace with ripple-lib or xrpl.js calls subscribing to account transactions.
export const getRecentPayoutsLive = async (): Promise<LedgerEntry[]> => {
  throw new Error('Live XRPL client not implemented yet. Set VITE_DATA_MODE=mock.')
}
