import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"

dotenv.config()

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
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {},
    coston: {
      url: process.env.COSTON_RPC_URL || "https://coston2-api.flare.network/ext/C/rpc",
      chainId: 114,
      accounts: costonPrivateKey ? [costonPrivateKey] : [],
    },
  },
  etherscan: {
    apiKey: {
      coston: process.env.COSTON_EXPLORER_KEY || "",
    },
  },
  mocha: {
    timeout: 400000,
  },
}

export default config
