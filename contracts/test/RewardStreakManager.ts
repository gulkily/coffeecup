import { expect } from "chai"
import { ethers } from "hardhat"
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs"
import { time } from "@nomicfoundation/hardhat-network-helpers"

const XRPL_HASH = ethers.encodeBytes32String("demo-wallet")

describe("RewardStreakManager", () => {
  it("allows owner to authorise claimers and track streaks", async () => {
    const [deployer, claimer] = await ethers.getSigners()
    const factory = await ethers.getContractFactory("RewardStreakManager")
    const contract = await factory.deploy()

    await expect(contract.connect(claimer).recordCheckIn(XRPL_HASH)).to.be.revertedWith(
      "Not authorized",
    )

    await expect(contract.setClaimer(claimer.address, true))
      .to.emit(contract, "ClaimerUpdated")
      .withArgs(claimer.address, true)

    await expect(contract.connect(claimer).recordCheckIn(XRPL_HASH))
      .to.emit(contract, "CheckInRecorded")
      .withArgs(XRPL_HASH, 1, anyValue)

    await time.increase(20 * 60) // within grace window
    await contract.connect(claimer).recordCheckIn(XRPL_HASH)

    const afterSecond = await contract.getStreak(XRPL_HASH)
    expect(afterSecond.currentStreak).to.equal(2)
    expect(afterSecond.bestStreak).to.equal(2)

    await time.increase(2 * 24 * 60 * 60) // streak reset
    await contract.connect(claimer).recordCheckIn(XRPL_HASH)
    const afterReset = await contract.getStreak(XRPL_HASH)
    expect(afterReset.currentStreak).to.equal(1)
  })

  it("captures claim metadata", async () => {
    const [, claimer] = await ethers.getSigners()
    const factory = await ethers.getContractFactory("RewardStreakManager")
    const contract = await factory.deploy()

    await contract.setClaimer(claimer.address, true)
    await contract.connect(claimer).recordCheckIn(XRPL_HASH)

    const rewardId = ethers.encodeBytes32String("streak-week")
    const tx = await contract
      .connect(claimer)
      .claimReward(XRPL_HASH, rewardId, 120, ethers.parseUnits("0.023", 18), 140)

    const receipt = await tx.wait()
    const event = receipt?.logs.find((log) => log.fragment?.name === "RewardClaimed")
    expect(event?.args?.walletHash).to.equal(XRPL_HASH)

    const view = await contract.getStreak(XRPL_HASH)
    expect(view.lastRewardId).to.equal(rewardId)
    expect(view.totalClaimed).to.equal(120)
    expect(view.lastMultiplierBps).to.equal(140)
  })
})
