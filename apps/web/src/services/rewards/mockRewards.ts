import type { Reward } from '../../types'

export const getRewardOptions = async (): Promise<Reward[]> => {
  await new Promise((resolve) => setTimeout(resolve, 350))

  return [
    {
      id: 'streak-week',
      label: '7-Day Streak Boost',
      description: 'Lock in +1.4x on payouts when you check in daily.',
      multiplier: 1.4,
      streakRequirement: 7,
      status: 'available',
    },
    {
      id: 'social-share',
      label: 'Community Amplifier',
      description: 'Share on socials to unlock a 200 FLR airdrop.',
      multiplier: 2,
      streakRequirement: 3,
      status: 'locked',
    },
    {
      id: 'validator-support',
      label: 'Validator Support',
      description: 'Delegate to recommended validators for bonus yield.',
      multiplier: 1.2,
      streakRequirement: 10,
      status: 'locked',
    },
  ]
}
