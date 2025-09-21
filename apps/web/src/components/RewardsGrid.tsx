import type { Reward } from '../types'

type RewardsGridProps = {
  rewards: Reward[]
  isLoading: boolean
}

const statusCopy: Record<Reward['status'], string> = {
  available: 'Ready to claim',
  claimed: 'Claimed',
  locked: 'Locked',
}

export const RewardsGrid = ({ rewards, isLoading }: RewardsGridProps) => (
  <section className="panel">
    <header className="panel-header">
      <h3>Claimable rewards</h3>
      <p>Streak multipliers update after every oracle pulse.</p>
    </header>
    <div className="rewards-grid">
      {isLoading && rewards.length === 0 ? (
        <div className="empty-card">Loading rewards…</div>
      ) : (
        rewards.map((reward) => (
          <article
            key={reward.id}
            className={`reward-card reward-card--${reward.status}`}
          >
            <div className="reward-header">
              <span className="reward-status">{statusCopy[reward.status]}</span>
              <h4>{reward.label}</h4>
            </div>
            <p>{reward.description}</p>
            <div className="reward-meta">
              <span className="reward-multiplier">x{reward.multiplier.toFixed(1)}</span>
              <span className="reward-streak">Needs {reward.streakRequirement}-day streak</span>
            </div>
          </article>
        ))
      )}
    </div>
  </section>
)
