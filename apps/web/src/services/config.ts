const DATA_MODE = import.meta.env.VITE_DATA_MODE ?? 'mock'
const FLARE_RPC_URL = import.meta.env.VITE_FLARE_RPC_URL ?? ''
const REWARD_CONTRACT_ADDRESS = import.meta.env.VITE_REWARD_CONTRACT_ADDRESS ?? ''
const XRPL_RPC_URL = import.meta.env.VITE_XRPL_RPC_URL ?? ''
const XRPL_WALLET_HASH = import.meta.env.VITE_XRPL_WALLET_HASH ?? ''
const XRPL_ACCOUNT = import.meta.env.VITE_XRPL_ACCOUNT ?? ''

export const dataMode = DATA_MODE
export const useMocks = DATA_MODE !== 'live'

export const config = {
  flareRpcUrl: FLARE_RPC_URL,
  rewardContractAddress: REWARD_CONTRACT_ADDRESS,
  xrplRpcUrl: XRPL_RPC_URL,
  xrplWalletHash: XRPL_WALLET_HASH,
  xrplAccount: XRPL_ACCOUNT,
}
