import type { PriceQuote } from '../../types'

export const getFtsoQuote = async (): Promise<PriceQuote> => {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const now = new Date()

  return {
    asset: 'FLR/USD',
    price: 0.0231,
    confidence: 'FTSO oracle consensus',
    updatedAt: now.toISOString(),
  }
}
