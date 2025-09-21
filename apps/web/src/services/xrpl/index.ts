import { useMocks } from '../config'
import type { LedgerEntry } from '../../types'
import { getRecentPayoutsLive } from './liveLedger'
import { getRecentPayouts as getRecentPayoutsMock } from './mockLedger'

export const getRecentPayouts = async (): Promise<LedgerEntry[]> => {
  if (useMocks) {
    return getRecentPayoutsMock()
  }

  return getRecentPayoutsLive()
}
