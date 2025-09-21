import { useMemo, useState } from 'react'
import './App.css'
import { HeroPanel } from './components/HeroPanel'
import { LedgerTable } from './components/LedgerTable'
import { RewardsGrid } from './components/RewardsGrid'
import { useDashboardData } from './hooks/useDashboardData'
import type { Reward } from './types'
import { formatRelativeTime } from './utils/time'

const DEFAULT_STREAK_DAYS = 7
const TARGET_STREAK_DAYS = 10

function App() {
  const { quote, rewards, payouts, isLoading } = useDashboardData()
  const [isConnected, setIsConnected] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimedIds, setClaimedIds] = useState<string[]>([])
  const [lastClaimAt, setLastClaimAt] = useState<string | null>(null)

  const claimableReward = useMemo(
    () =>
      rewards.find(
        (reward) => reward.status === 'available' && !claimedIds.includes(reward.id),
      ),
    [rewards, claimedIds],
  )

  const handleConnect = () => setIsConnected(true)

  const handleClaim = async () => {
    if (!claimableReward || isClaiming) {
      return
    }

    setIsClaiming(true)
    await new Promise((resolve) => setTimeout(resolve, 600))

    setClaimedIds((prev) => [...prev, claimableReward.id])
    setLastClaimAt(new Date().toISOString())
    setIsClaiming(false)
  }

  const transformedRewards: Reward[] = rewards.map((reward) => {
    if (claimedIds.includes(reward.id)) {
      return { ...reward, status: 'claimed' }
    }
    return reward
  })

  const lastClaimCopy = lastClaimAt ? formatRelativeTime(lastClaimAt) : 'Not claimed'

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="badge">Workshop sprint build</span>
        <h1>Flare Rewards Hub</h1>
        <p>
          XRPL wallet activity unlocks streak bonuses priced by Flare&apos;s FTSO. Show the
          judges live how we keep communities returning every day.
        </p>
      </header>

      <HeroPanel
        streakDays={DEFAULT_STREAK_DAYS}
        targetStreak={TARGET_STREAK_DAYS}
        quote={quote}
        isConnected={isConnected}
        onConnect={handleConnect}
        onClaim={handleClaim}
        canClaim={Boolean(claimableReward)}
        isClaiming={isClaiming}
        lastClaimCopy={lastClaimCopy}
      />

      <RewardsGrid rewards={transformedRewards} isLoading={isLoading} />
      <LedgerTable entries={payouts} isLoading={isLoading} />
    </div>
  )
}

export default App
