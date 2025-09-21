import type { LedgerEntry } from '../../types'
import { config } from '../config'

const { xrplRpcUrl, xrplWalletHash, xrplAccount } = config

export const getRecentPayoutsLive = async (): Promise<LedgerEntry[]> => {
  if (!xrplRpcUrl || !xrplWalletHash || !xrplAccount) {
    throw new Error('Live XRPL feed requires RPC URL and wallet hash')
  }

  const body = {
    method: 'account_tx',
    params: [
      {
        account: xrplAccount,
        limit: 5,
        binary: false,
      },
    ],
  }

  const response = await fetch(xrplRpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`XRPL RPC error: ${response.status}`)
  }

  const json = (await response.json()) as any
  const transactions = json.result?.transactions ?? []

  return transactions.map((tx: any, index: number) => {
    const ledgerTx = tx.tx
    const amount = Number(ledgerTx.Amount?.value || ledgerTx.Amount || 0)
    const currency = ledgerTx.Amount?.currency || 'FLR'
    const hash = ledgerTx.hash

    const ledgerTime = typeof ledgerTx.date === 'number' ? (ledgerTx.date + 946684800) * 1000 : Date.now()
    return {
      id: `${hash}-${index}`,
      type: amount >= 0 ? 'credit' : 'debit',
      description: ledgerTx.TransactionType || 'Payment',
      amount: Math.abs(amount),
      currency,
      hash,
      explorerUrl: `https://livenet.xrpl.org/transactions/${hash}`,
      timestamp: new Date(ledgerTime).toISOString(),
    }
  })
}

