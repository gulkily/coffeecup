import { useMocks } from '../config'
import type { PriceQuote } from '../../types'
import { getFtsoQuoteLive } from './liveFtso'
import { getFtsoQuote as getFtsoQuoteMock } from './mockFtso'

export const getFtsoQuote = async (): Promise<PriceQuote> => {
  if (useMocks) {
    return getFtsoQuoteMock()
  }

  return getFtsoQuoteLive()
}
