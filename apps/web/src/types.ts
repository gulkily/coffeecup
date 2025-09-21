export interface PriceQuote {
  asset: string
  price: number
  confidence: string
  updatedAt: string
}

export interface Reward {
  id: string
  label: string
  description: string
  multiplier: number
  streakRequirement: number
  status: 'available' | 'claimed' | 'locked'
}

export interface LedgerEntry {
  id: string
  type: 'credit' | 'debit'
  description: string
  amount: number
  currency: string
  hash: string
  explorerUrl?: string
  timestamp: string
}
