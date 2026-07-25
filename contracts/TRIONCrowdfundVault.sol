// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./TRIONToken.sol";
import "./TRIONGenesisNFT.sol";

/**
 * @title TRIONCrowdfundVault
 * @notice The core crowdfunding engine. Accepts ETH and USDC contributions,
 *         mints soulbound NFTs, allocates vesting tokens, and tracks citizenship tiers.
 *
 * TIER THRESHOLDS:
 *   Bronze: >= 0.05 ETH or >= 100 USDC ($100)
 *   Silver: >= 0.25 ETH or >= 500 USDC ($500)
 *   Gold:   >= 1.0  ETH or >= 2000 USDC ($2000)
 */
contract TRIONCrowdfundVault is ReentrancyGuard, Ownable {
    using Strings for uint256;

    // Token allocations per tier (TRIO tokens, 18 decimals)
    uint256 public constant BRONZE_TOKENS = 5_000 * 1e18;
    uint256 public constant SILVER_TOKENS = 30_000 * 1e18;
    uint256 public constant GOLD_TOKENS = 150_000 * 1e18;

    // ETH thresholds
    uint256 public constant BRONZE_ETH = 0.05 ether;
    uint256 public constant SILVER_ETH = 0.25 ether;
    uint256 public constant GOLD_ETH = 1.0 ether;

    // USDC thresholds (USDC has 6 decimals)
    uint256 public constant BRONZE_USDC = 100 * 1e6;
    uint256 public constant SILVER_USDC = 500 * 1e6;
    uint256 public constant GOLD_USDC = 2000 * 1e6;

    // Infrastructure goal
    uint256 public constant FUNDING_GOAL = 250_000 ether; // in ETH equivalent

    IERC20 public immutable usdcToken;
    TRIONToken public immutable trionToken;
    TRIONGenesisNFT public immutable genesisNFT;

    // Tracking
    uint256 public totalContributions;
    uint256 public totalContributors;

    struct Contributor {
        bool exists;
        uint8 tier;          // 0=Bronze, 1=Silver, 2=Gold
        uint256 totalAmount; // in ETH wei equivalent
        uint256 nftTokenId;
        uint256 contributeTimestamp;
    }

    mapping(address => Contributor) public contributors;

    event CitizenOnboarded(address indexed user, uint8 tier, uint256 amount);
    event ContributionReceived(address indexed user, uint256 amount, bool isETH);
    event FundsWithdrawn(address indexed treasury, uint256 amount);
    event EmergencyWithdrawal(address indexed treasury, uint256 ethAmount, uint256 usdcAmount);

    constructor(
        address _usdc,
        address _trionToken,
        address _genesisNFT
    ) Ownable(msg.sender) {
        usdcToken = IERC20(_usdc);
        trionToken = TRIONToken(_trionToken);
        genesisNFT = TRIONGenesisNFT(_genesisNFT);
    }

    /**
     * @notice Contribute ETH to the crowdfund
     *         Computes tier, mints NFT, allocates vesting tokens
     */
    function contributeETH() external payable nonReentrant {
        require(msg.value > 0, "Must send ETH");
        _processContribution(msg.sender, msg.value, true);
    }

    /**
     * @notice Contribute USDC to the crowdfund
     * @param amount USDC amount (with 6 decimals)
     */
    function contributeUSDC(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");

        // Transfer USDC from sender
        bool success = usdcToken.transferFrom(msg.sender, address(this), amount);
        require(success, "USDC transfer failed");

        // Convert USDC to ETH equivalent for tier calculation (1 USDC ~ 1/2000 ETH)
        uint256 ethEquivalent = (amount * 1 ether) / 2000 * 1e6;

        _processContribution(msg.sender, ethEquivalent, false);
    }

    /**
     * @notice Internal: Process contribution, determine tier, mint NFT, allocate tokens
     */
    function _processContribution(address contributor, uint256 amount, bool isETH) private {
        Contributor storage c = contributors[contributor];

        // Determine tier
        uint8 tier = _calculateTier(amount);
        uint256 tokenAllocation = _getTokenAllocation(tier);

        if (!c.exists) {
            // First-time contributor
            c.exists = true;
            c.tier = tier;
            c.contributeTimestamp = block.timestamp;
            totalContributors++;

            // Mint Soulbound NFT
            TRIONGenesisNFT.Tier nftTier = TRIONGenesisNFT.Tier(tier);
            uint256 nftId = genesisNFT.mintPassport(contributor, nftTier, amount);
            c.nftTokenId = nftId;

            // Create vesting schedule for TRIO tokens
            trionToken.createVestingSchedule(contributor, tokenAllocation);

            emit CitizenOnboarded(contributor, tier, amount);
        } else {
            // Returning contributor - upgrade tier if applicable
            if (tier > c.tier) {
                c.tier = tier;
                // Burn old NFT and mint new tier (by burning we use the soulbound nature)
                // In production, emit an upgrade event
            }
        }

        c.totalAmount += amount;
        totalContributions += amount;

        emit ContributionReceived(contributor, amount, isETH);
    }

    /**
     * @notice Calculates tier based on contribution amount (ETH wei)
     */
    function _calculateTier(uint256 amount) internal view returns (uint8) {
        if (amount >= GOLD_ETH) return 2; // Gold
        if (amount >= SILVER_ETH) return 1; // Silver
        return 0; // Bronze
    }

    /**
     * @notice Returns token allocation for tier
     */
    function _getTokenAllocation(uint8 tier) internal pure returns (uint256) {
        if (tier == 2) return GOLD_TOKENS;
        if (tier == 1) return SILVER_TOKENS;
        return BRONZE_TOKENS;
    }

    /**
     * @notice Returns total balance in ETH (ETH balance + USDC converted)
     */
    function getTotalBalance() external view returns (uint256) {
        return address(this).balance + (usdcToken.balanceOf(address(this)) * 1 ether) / 2000 * 1e6;
    }

    /**
     * @notice Returns funding progress as percentage (basis points, 10000 = 100%)
     */
    function getFundingProgress() external view returns (uint256) {
        return (totalContributions * 10000) / FUNDING_GOAL;
    }

    /**
     * @notice Returns contributor info
     */
    function getContributor(address addr) external view returns (
        bool exists,
        uint8 tier,
        uint256 totalAmount,
        uint256 nftTokenId,
        uint256 contributeTimestamp
    ) {
        Contributor memory c = contributors[addr];
        return (c.exists, c.tier, c.totalAmount, c.nftTokenId, c.contributeTimestamp);
    }

    /**
     * @notice Emergency withdrawal - only callable by owner
     * @param treasury Address to send funds to
     */
    function withdrawFunds(address treasury) external onlyOwner nonReentrant {
        require(treasury != address(0), "Invalid treasury");
        uint256 ethBal = address(this).balance;
        uint256 usdcBal = usdcToken.balanceOf(address(this));

        if (ethBal > 0) {
            (bool ok,) = treasury.call{value: ethBal}("");
            require(ok, "ETH transfer failed");
        }
        if (usdcBal > 0) {
            bool ok2 = usdcToken.transfer(treasury, usdcBal);
            require(ok2, "USDC transfer failed");
        }

        emit EmergencyWithdrawal(treasury, ethBal, usdcBal);
    }

    receive() external payable {}
}
