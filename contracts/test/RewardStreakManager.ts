import { expect } from "chai"
import { ethers } from "hardhat"
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs"
import { time } from "@nomicfoundation/hardhat-network-helpers"

// We hash the XRPL wallet identifier just like the production service would.
const XRPL_HASH = ethers.encodeBytes32String("demo-wallet")

describe("RewardStreakManager", () => {
  it("allows owner to authorise claimers and track streaks", async () => {
    // Hardhat gives us a deployer plus additional actors; claimer simulates the backend service.
    const [deployer, claimer] = await ethers.getSigners()
    const factory = await ethers.getContractFactory("RewardStreakManager")
    const contract = await factory.deploy()

    await expect(contract.connect(claimer).recordCheckIn(XRPL_HASH)).to.be.revertedWith(
      "Not authorized",
    )

    // Owner must explicitly grant write access to the claimer.
    await expect(contract.setClaimer(claimer.address, true))
      .to.emit(contract, "ClaimerUpdated")
      .withArgs(claimer.address, true)

    await expect(contract.connect(claimer).recordCheckIn(XRPL_HASH))
      .to.emit(contract, "CheckInRecorded")
      .withArgs(XRPL_HASH, 1, anyValue)

    // Staying inside the 2 hour grace window keeps the streak alive.
    await time.increase(20 * 60) // within grace window
    await contract.connect(claimer).recordCheckIn(XRPL_HASH)

    const afterSecond = await contract.getStreak(XRPL_HASH)
    expect(afterSecond.currentStreak).to.equal(2)
    expect(afterSecond.bestStreak).to.equal(2)

    // Jump beyond the grace period and the streak resets to day one.
    await time.increase(2 * 24 * 60 * 60) // streak reset
    await contract.connect(claimer).recordCheckIn(XRPL_HASH)
    const afterReset = await contract.getStreak(XRPL_HASH)
    expect(afterReset.currentStreak).to.equal(1)
  })

  it("captures claim metadata", async () => {
    const [, claimer] = await ethers.getSigners()
    const factory = await ethers.getContractFactory("RewardStreakManager")
    const contract = await factory.deploy()

    // Mirror production flow: authorize claimer then record a check-in before claiming.
    await contract.setClaimer(claimer.address, true)
    await contract.connect(claimer).recordCheckIn(XRPL_HASH)

    const rewardId = ethers.encodeBytes32String("streak-week")
    // Use a lightweight claim to verify pricing and multiplier metadata is persisted.
    const tx = await contract
      .connect(claimer)
      .claimReward(XRPL_HASH, rewardId, 120, ethers.parseUnits("0.023", 18), 140)

    const receipt = await tx.wait()
    // Hardhat surfaces ABI-decoded logs; assert the emitted data matches inputs.
    const event = receipt?.logs.find((log) => log.fragment?.name === "RewardClaimed")
    expect(event?.args?.walletHash).to.equal(XRPL_HASH)

    const view = await contract.getStreak(XRPL_HASH)
    expect(view.lastRewardId).to.equal(rewardId)
    expect(view.totalClaimed).to.equal(120)
    expect(view.lastMultiplierBps).to.equal(140)
  })
})
