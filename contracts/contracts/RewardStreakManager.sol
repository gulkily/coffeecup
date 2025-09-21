// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title RewardStreakManager
/// @notice Tracks XRPL-linked wallet streaks and captures FTSO snapshots for reward claims.
contract RewardStreakManager is Ownable {
    uint256 private constant SECONDS_PER_DAY = 1 days;

    /// @dev Additional grace period granted on top of the daily window to keep a streak active.
    uint256 public checkInGraceSeconds = 2 hours;

    struct StreakState {
        uint32 currentStreak;
        uint32 bestStreak;
        uint64 lastCheckInAt;
        uint64 lastClaimAt;
        uint16 lastMultiplierBps;
        uint96 totalClaimed;
        uint256 lastFtsoPriceE18;
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

    mapping(bytes32 => StreakState) private streakState;
    mapping(address => bool) public authorizedClaimers;

    event CheckInRecorded(bytes32 indexed walletHash, uint32 newStreak, uint64 timestamp);
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
        require(msg.sender == owner() || authorizedClaimers[msg.sender], "Not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /// @notice Updates or inserts streak metadata for the XRPL wallet hash.
    function recordCheckIn(bytes32 walletHash) external onlyClaimer returns (uint32 newStreak) {
        StreakState storage state = streakState[walletHash];
        uint64 nowTs = uint64(block.timestamp);

        if (state.lastCheckInAt == 0) {
            state.currentStreak = 1;
        } else if (nowTs <= state.lastCheckInAt + uint64(SECONDS_PER_DAY + checkInGraceSeconds)) {
            state.currentStreak += 1;
        } else {
            state.currentStreak = 1;
        }

        state.lastCheckInAt = nowTs;
        if (state.currentStreak > state.bestStreak) {
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
        authorizedClaimers[claimer] = isAuthorized;
        emit ClaimerUpdated(claimer, isAuthorized);
    }

    /// @notice Adjusts the grace window allowed between check-ins before a streak resets.
    function setCheckInGrace(uint256 newGraceSeconds) external onlyOwner {
        require(newGraceSeconds <= 12 hours, "Grace too high");
        checkInGraceSeconds = newGraceSeconds;
        emit CheckInGraceUpdated(newGraceSeconds);
    }

    function _buildView(StreakState storage state) private view returns (StreakView memory) {
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
