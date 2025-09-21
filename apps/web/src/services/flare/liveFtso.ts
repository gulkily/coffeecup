import { ethers } from 'ethers'
import RewardStreakManagerArtifact from '../../contracts/RewardStreakManager.json' assert { type: 'json' }
import type { PriceQuote } from '../../types'
import { config } from '../config'

const { flareRpcUrl, rewardContractAddress, xrplWalletHash } = config

export const getFtsoQuoteLive = async (): Promise<PriceQuote> => {
  if (!flareRpcUrl || !rewardContractAddress || !xrplWalletHash) {
    throw new Error('Live FTSO requires RPC URL, contract address, and wallet hash')
  }

  const provider = new ethers.JsonRpcProvider(flareRpcUrl)
  const contract = new ethers.Contract(
    rewardContractAddress,
    RewardStreakManagerArtifact.abi,
    provider,
  )

  const streak = await contract.getStreak(xrplWalletHash)
  const rawPrice: bigint = streak.lastFtsoPriceE18
  const multiplierBps = Number(streak.lastMultiplierBps || 0n)
  const price = Number(rawPrice) / 1e18
  const confidence = multiplierBps > 0 ? `Multiplier ${(multiplierBps / 100).toFixed(2)}x` : 'No claims yet'

  return {
    asset: 'FLR/USD',
    price: price || 0,
    confidence,
    updatedAt: new Date().toISOString(),
  }
}
