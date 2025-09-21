import type { LedgerEntry } from '../types'
import { formatRelativeTime } from '../utils/time'

type LedgerTableProps = {
  entries: LedgerEntry[]
  isLoading: boolean
}

export const LedgerTable = ({ entries, isLoading }: LedgerTableProps) => (
  <section className="panel">
    <header className="panel-header">
      <h3>XRPL settlement feed</h3>
      <p>Mirror payouts and deductions streamed from the ledger.</p>
    </header>
    <div className="ledger-table">
      <div className="ledger-table__head">
        <span>Type</span>
        <span>Summary</span>
        <span>Amount</span>
        <span>Timestamp</span>
        <span>Tx</span>
      </div>
      {isLoading && entries.length === 0 ? (
        <div className="ledger-empty">Loading ledger activity…</div>
      ) : (
        entries.map((entry) => (
          <div className="ledger-table__row" key={entry.id}>
            <span className={`ledger-pill ledger-pill--${entry.type}`}>
              {entry.type === 'credit' ? 'Credit' : 'Debit'}
            </span>
            <span>{entry.description}</span>
            <span>
              {entry.type === 'debit' ? '-' : '+'}
              {entry.amount} {entry.currency}
            </span>
            <span>{formatRelativeTime(entry.timestamp)}</span>
            <span>
              {entry.explorerUrl ? (
                <a href={entry.explorerUrl} target="_blank" rel="noreferrer">
                  {shortHash(entry.hash)}
                </a>
              ) : (
                shortHash(entry.hash)
              )}
            </span>
          </div>
        ))
      )}
    </div>
  </section>
)

const shortHash = (hash: string) => `${hash.slice(0, 6)}…${hash.slice(-4)}`
