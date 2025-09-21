// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title RewardStreakManager
/// @notice Tracks XRPL-linked wallet streaks and captures FTSO snapshots for reward claims.
contract RewardStreakManager is Ownable {
    // We treat a "day" streak window as 24 hours so on-ledger activity can happen at any time.
    uint256 private constant SECONDS_PER_DAY = 1 days;

    /// @dev Additional grace period granted on top of the daily window to keep a streak active.
    uint256 public checkInGraceSeconds = 2 hours;

    struct StreakState {
        // Number of consecutive days the wallet has met the engagement criteria.
        uint32 currentStreak;
        // Highest streak maintained historically in order to unlock tiered rewards.
        uint32 bestStreak;
        // Timestamp of the last recorded check-in used to evaluate continuity.
        uint64 lastCheckInAt;
        // Timestamp when the wallet last claimed a reward from the streak.
        uint64 lastClaimAt;
        // Multiplier basis points applied to the most recent claim for auditability.
        uint16 lastMultiplierBps;
        // Total amount (scaled to reward token decimals) claimed by this wallet.
        uint96 totalClaimed;
        // FTSO price with 18 decimals sampled at claim time to prove valuation.
        uint256 lastFtsoPriceE18;
        // Application-defined identifier for the most recent reward payout.
        bytes32 lastRewardId;
    }

    struct StreakView {
        uint32 currentStreak;
        uint32 bestStreak;
        uint64 lastCheckInAt;
        uint64 lastClaimAt;
        uint16 lastMultiplierBps;
        uint96 totalClaimed;
        uint256 lastFtsoPriceE18;
        bytes32 lastRewardId;
    }

    // Store streak progression keyed by hashed XRPL wallet ids so that PII is never on-chain.
    mapping(bytes32 => StreakState) private streakState;
    // Backend services allowed to write streak updates alongside the contract owner.
    mapping(address => bool) public authorizedClaimers;

    /// @notice Emitted whenever a streak check-in succeeds.
    event CheckInRecorded(bytes32 indexed walletHash, uint32 newStreak, uint64 timestamp);
    /// @notice Emitted after a reward claim to snapshot valuation inputs.
    event RewardClaimed(
        bytes32 indexed walletHash,
        bytes32 indexed rewardId,
        uint32 streakAtClaim,
        uint16 multiplierBps,
        uint256 ftsoPriceE18,
        uint96 amountClaimed,
        address indexed claimer,
        uint64 timestamp
    );
    event ClaimerUpdated(address indexed claimer, bool isAuthorized);
    event CheckInGraceUpdated(uint256 newGraceSeconds);

    modifier onlyClaimer() {
        // Claimers are limited to the owner and explicitly whitelisted backend actors.
        require(msg.sender == owner() || authorizedClaimers[msg.sender], "Not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /// @notice Updates or inserts streak metadata for the XRPL wallet hash.
    function recordCheckIn(bytes32 walletHash) external onlyClaimer returns (uint32 newStreak) {
        StreakState storage state = streakState[walletHash];
        uint64 nowTs = uint64(block.timestamp);

        if (state.lastCheckInAt == 0) {
            // First touch for this wallet kicks off the streak at day one.
            state.currentStreak = 1;
        } else if (nowTs <= state.lastCheckInAt + uint64(SECONDS_PER_DAY + checkInGraceSeconds)) {
            // If we are still within the day window (plus grace) extend the streak.
            state.currentStreak += 1;
        } else {
            // Missing the window resets the streak to day one again.
            state.currentStreak = 1;
        }

        state.lastCheckInAt = nowTs;
        if (state.currentStreak > state.bestStreak) {
            // Track the best run to drive long-term loyalty rewards.
            state.bestStreak = state.currentStreak;
        }

        emit CheckInRecorded(walletHash, state.currentStreak, nowTs);
        return state.currentStreak;
    }

    /// @notice Registers a reward claim and stores the FTSO snapshot used for settlement.
    function claimReward(
        bytes32 walletHash,
        bytes32 rewardId,
        uint96 amountClaimed,
        uint256 ftsoPriceE18,
        uint16 multiplierBps
    ) external onlyClaimer returns (StreakView memory viewState) {
        require(multiplierBps >= 100, "Multiplier too low");
        StreakState storage state = streakState[walletHash];
        require(state.currentStreak > 0, "No streak recorded");

        uint64 nowTs = uint64(block.timestamp);
        // Persist metadata needed to reconstruct the most recent claim.
        state.lastClaimAt = nowTs;
        state.lastFtsoPriceE18 = ftsoPriceE18;
        state.lastMultiplierBps = multiplierBps;
        state.lastRewardId = rewardId;
        state.totalClaimed += amountClaimed;

        emit RewardClaimed(
            walletHash,
            rewardId,
            state.currentStreak,
            multiplierBps,
            ftsoPriceE18,
            amountClaimed,
            msg.sender,
            nowTs
        );

        return _buildView(state);
    }

    /// @notice Returns streak metadata for presentation layers.
    function getStreak(bytes32 walletHash) external view returns (StreakView memory) {
        StreakState storage state = streakState[walletHash];
        return _buildView(state);
    }

    /// @notice Authorises or revokes backend claimers that can write streak data.
    function setClaimer(address claimer, bool isAuthorized) external onlyOwner {
        // Toggle access for off-chain services that sync XRPL activity to Flare.
        authorizedClaimers[claimer] = isAuthorized;
        emit ClaimerUpdated(claimer, isAuthorized);
    }

    /// @notice Adjusts the grace window allowed between check-ins before a streak resets.
    function setCheckInGrace(uint256 newGraceSeconds) external onlyOwner {
        require(newGraceSeconds <= 12 hours, "Grace too high");
        // Guard rails prevent operators from silently turning streaks into multi-day windows.
        checkInGraceSeconds = newGraceSeconds;
        emit CheckInGraceUpdated(newGraceSeconds);
    }

    function _buildView(StreakState storage state) private view returns (StreakView memory) {
        // Copy values into a struct that omits storage-only bookkeeping.
        return StreakView({
            currentStreak: state.currentStreak,
            bestStreak: state.bestStreak,
            lastCheckInAt: state.lastCheckInAt,
            lastClaimAt: state.lastClaimAt,
            lastMultiplierBps: state.lastMultiplierBps,
            totalClaimed: state.totalClaimed,
            lastFtsoPriceE18: state.lastFtsoPriceE18,
            lastRewardId: state.lastRewardId
        });
    }
}
