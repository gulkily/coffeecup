import { ethers } from 'ethers'
import RewardStreakManagerArtifact from '../../contracts/RewardStreakManager.json' assert { type: 'json' }
import type { Reward } from '../../types'
import { config } from '../config'

const { flareRpcUrl, rewardContractAddress, xrplWalletHash } = config

export const getRewardOptionsLive = async (): Promise<Reward[]> => {
  if (!flareRpcUrl || !rewardContractAddress || !xrplWalletHash) {
    throw new Error('Live rewards require RPC URL, contract address, and wallet hash')
  }

  const provider = new ethers.JsonRpcProvider(flareRpcUrl)
  const contract = new ethers.Contract(
    rewardContractAddress,
    RewardStreakManagerArtifact.abi,
    provider,
  )

  const streak = await contract.getStreak(xrplWalletHash)
  const multiplierBps = Number(streak.lastMultiplierBps || 0n)
  const claimedRewardId = streak.lastRewardId as string

  const baseRewards: Reward[] = [
    {
      id: 'streak-week',
      label: '7-Day Streak Boost',
      description: 'Locks in a payout multiplier when you maintain the streak.',
      multiplier: multiplierBps > 0 ? multiplierBps / 100 : 1.0,
      streakRequirement: 7,
      status: claimedRewardId === ethers.encodeBytes32String('streak-week') ? 'claimed' : 'available',
    },
  ]

  return baseRewards
}
