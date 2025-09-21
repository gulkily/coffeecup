import type { LedgerEntry } from '../../types'

const explorerBase = 'https://livenet.xrpl.org/transactions'

export const getRecentPayouts = async (): Promise<LedgerEntry[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const now = new Date()

  return [
    {
      id: '1',
      type: 'credit',
      description: 'Quest streak bonus',
      amount: 125,
      currency: 'FLR',
      hash: '4E2A6F9B3C6D4A8B9C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F2BC',
      explorerUrl: `${explorerBase}/4E2A6F9B3C6D4A8B9C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F2BC`,
      timestamp: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: '2',
      type: 'credit',
      description: 'Community vote reward',
      amount: 80,
      currency: 'FLR',
      hash: '9B7C3E1F5A6D8C0E2F4A6B8C0D2E4F6A8B0C2D4E6F8A0B2C4D6E8F0A2B4C6D8E',
      explorerUrl: `${explorerBase}/9B7C3E1F5A6D8C0E2F4A6B8C0D2E4F6A8B0C2D4E6F8A0B2C4D6E8F0A2B4C6D8E`,
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: '3',
      type: 'debit',
      description: 'Charity donation route',
      amount: 20,
      currency: 'FLR',
      hash: 'AA0199EE4477CC22BB66554433221100FFEECCDDAABB99887766554433221100',
      explorerUrl: `${explorerBase}/AA0199EE4477CC22BB66554433221100FFEECCDDAABB99887766554433221100`,
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ]
}
