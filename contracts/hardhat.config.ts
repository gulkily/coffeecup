import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"

// Load environment variables so deploy scripts and the config can read RPC keys locally.
dotenv.config()

// Coston key is optional: we only pass it to Hardhat if the developer has populated .env.
const costonPrivateKey = process.env.COSTON_PRIVATE_KEY

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    // Surface explicit folders so new contributors can find source, test, and artifact roots.
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    // Default in-process Hardhat network for local iteration and unit tests.
    hardhat: {},
    coston: {
      // Coston is Flare's testnet; fall back to public RPC so onboarding is smooth.
      url: process.env.COSTON_RPC_URL || "https://coston2-api.flare.network/ext/C/rpc",
      chainId: 114,
      // Only inject the private key when provided to avoid accidentally using the default signer.
      accounts: costonPrivateKey ? [costonPrivateKey] : [],
    },
  },
  etherscan: {
    apiKey: {
      // Allows `hardhat verify` to publish source when explorers expose API keys.
      coston: process.env.COSTON_EXPLORER_KEY || "",
    },
  },
  mocha: {
    // Contract workflows involve time manipulation; extend timeout to keep tests stable.
    timeout: 400000,
  },
}

export default config
