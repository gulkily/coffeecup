import { useMocks } from '../config'
import type { Reward } from '../../types'
import { getRewardOptionsLive } from './liveRewards'
import { getRewardOptions as getRewardOptionsMock } from './mockRewards'

export const getRewardOptions = async (): Promise<Reward[]> => {
  if (useMocks) {
    return getRewardOptionsMock()
  }

  return getRewardOptionsLive()
}
