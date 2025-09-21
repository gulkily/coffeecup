import type { PriceQuote } from '../../types'

// Placeholder stub for live Flare integration.
// Swap with calls to @flarenetwork/flare-periphery-contracts FTSO client.
export const getFtsoQuoteLive = async (): Promise<PriceQuote> => {
  throw new Error('Live FTSO client not implemented yet. Set VITE_DATA_MODE=mock.')
}
