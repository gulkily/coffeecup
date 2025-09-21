import { ethers } from 'hardhat'

async function main() {
  const [signer] = await ethers.getSigners()
  console.log('Using signer:', signer.address)

  const contractAddress = process.env.REWARD_CONTRACT_ADDRESS
  if (!contractAddress) {
    throw new Error('REWARD_CONTRACT_ADDRESS env var required')
  }

  const contract = await ethers.getContractAt('RewardStreakManager', contractAddress)

  const xrplWalletHash = process.env.XRPL_WALLET_HASH
    ? ethers.encodeBytes32String(process.env.XRPL_WALLET_HASH)
    : ethers.encodeBytes32String('demo-wallet')

  const isClaimer = await contract.authorizedClaimers(signer.address)
  if (!isClaimer) {
    console.log('Authorising current signer as claimer')
    const tx = await contract.setClaimer(signer.address, true)
    await tx.wait()
  }

  console.log('Recording check-in...')
  const checkInTx = await contract.recordCheckIn(xrplWalletHash)
  await checkInTx.wait()

  console.log('Submitting claim...')
  const claimTx = await contract.claimReward(
    xrplWalletHash,
    ethers.encodeBytes32String('streak-week'),
    100,
    ethers.parseUnits('0.0231', 18),
    140,
  )
  await claimTx.wait()

  const streak = await contract.getStreak(xrplWalletHash)
  console.log('Updated streak:', streak)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
