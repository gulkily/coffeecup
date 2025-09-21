import type { Reward } from '../../types'

// Placeholder for smart-contract or API backed rewards.
// Wire this to Flare contracts once deployed.
export const getRewardOptionsLive = async (): Promise<Reward[]> => {
  throw new Error('Live rewards client not implemented yet. Set VITE_DATA_MODE=mock.')
}
