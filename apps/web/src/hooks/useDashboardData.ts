import { useCallback, useEffect, useMemo, useState } from 'react'
import { getFtsoQuote } from '../services/flare'
import { getRewardOptions } from '../services/rewards'
import { getRecentPayouts } from '../services/xrpl'
import type { LedgerEntry, PriceQuote, Reward } from '../types'

export type DashboardState = {
  quote: PriceQuote | null
  rewards: Reward[]
  payouts: LedgerEntry[]
  isLoading: boolean
  isRefreshing: boolean
  refresh: () => Promise<void>
}

export const useDashboardData = (): DashboardState => {
  const [quote, setQuote] = useState<PriceQuote | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [payouts, setPayouts] = useState<LedgerEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const load = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const [quoteResult, rewardsResult, payoutResult] = await Promise.all([
        getFtsoQuote(),
        getRewardOptions(),
        getRecentPayouts(),
      ])
      setQuote(quoteResult)
      setRewards(rewardsResult)
      setPayouts(payoutResult)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return useMemo(
    () => ({ quote, rewards, payouts, isLoading, isRefreshing, refresh: load }),
    [quote, rewards, payouts, isLoading, isRefreshing, load],
  )
}
