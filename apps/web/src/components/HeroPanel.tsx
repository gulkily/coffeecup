import type { PriceQuote } from '../types'

type HeroPanelProps = {
  streakDays: number
  targetStreak: number
  quote: PriceQuote | null
  isConnected: boolean
  onConnect: () => void
  onClaim: () => void
  canClaim: boolean
  isClaiming: boolean
  lastClaimCopy: string
}

export const HeroPanel = ({
  streakDays,
  targetStreak,
  quote,
  isConnected,
  onConnect,
  onClaim,
  canClaim,
  isClaiming,
  lastClaimCopy,
}: HeroPanelProps) => {
  const connectLabel = isConnected ? 'Wallet connected' : 'Connect XRPL Wallet'

  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <span className="eyebrow">Flare + XRPL</span>
        <h2>Rewards that price in live oracle data</h2>
        <p>
          Keep contributors engaged with streak bonuses backed by Flare&apos;s FTSO and
          settle everything instantly on XRPL.
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className={`button ${isConnected ? 'button--ghost' : ''}`}
            onClick={onConnect}
            disabled={isConnected}
          >
            {connectLabel}
          </button>
          <button
            type="button"
            className="button button--primary"
            onClick={onClaim}
            disabled={!canClaim || isClaiming || !isConnected}
          >
            {isClaiming ? 'Claiming…' : canClaim ? 'Claim reward' : 'Claim locked'}
          </button>
        </div>
      </div>
      <div className="hero-stats">
        <div className="stat-card">
          <span className="stat-eyebrow">Active streak</span>
          <strong className="stat-value">{streakDays} days</strong>
          <span className="stat-meta">Target: {targetStreak}-day streak</span>
        </div>
        <div className="stat-card">
          <span className="stat-eyebrow">FTSO price</span>
          <strong className="stat-value">
            {quote ? `${quote.price.toFixed(4)} USD` : 'Loading…'}
          </strong>
          <span className="stat-meta">{quote ? quote.confidence : 'Awaiting oracle feed'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-eyebrow">Last claim</span>
          <strong className="stat-value">{lastClaimCopy}</strong>
          <span className="stat-meta">Rewards auto-reset daily</span>
        </div>
      </div>
    </section>
  )
}
