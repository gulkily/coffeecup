import { ethers } from "hardhat"

async function main() {
  // Hardhat exposes configured accounts; grab the first signer for deployment.
  const [deployer] = await ethers.getSigners()
  console.log("Deploying with:", deployer.address)

  // Contracts are deployed via factories compiled by Hardhat.
  const factory = await ethers.getContractFactory("RewardStreakManager")
  const contract = await factory.deploy()

  // waitForDeployment resolves once the transaction is mined and address assigned.
  await contract.waitForDeployment()

  console.log("RewardStreakManager deployed to:", await contract.getAddress())
}

// Ensure unhandled errors bubble up so CI exits on failure.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
