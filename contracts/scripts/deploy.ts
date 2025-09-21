import { ethers } from "hardhat"

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Deploying with:", deployer.address)

  const factory = await ethers.getContractFactory("RewardStreakManager")
  const contract = await factory.deploy()
  await contract.waitForDeployment()

  console.log("RewardStreakManager deployed to:", await contract.getAddress())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
