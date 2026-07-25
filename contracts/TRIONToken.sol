// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Wrapper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TRIONToken
 * @notice TRION Utility Token (TRIO) - Governance token with vesting capabilities.
 *         Includes ERC20Votes for governance and ERC20Permit for gasless approvals.
 */
contract TRIONToken is ERC20Votes, ERC20Permit, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 1e18; // 100M TRIO
    uint256 public constant CROWDFUND_ALLOCATION = 20_000_000 * 1e18; // 20M for crowdfunders

    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 duration; // 12 months in seconds
        bool initialized;
    }

    mapping(address => VestingSchedule) public vestingSchedules;

    event TokensVested(address indexed beneficiary, uint256 amount);
    event VestingScheduleCreated(address indexed beneficiary, uint256 amount, uint256 startTime, uint256 duration);

    constructor() ERC20("TRION Utility", "TRIO") ERC20Permit("TRION Utility") Ownable(msg.sender) {
        // Mint initial supply minus crowdfund allocation (to be allocated via vesting)
        _mint(msg.sender, MAX_SUPPLY - CROWDFUND_ALLOCATION);
    }

    /**
     * @notice Creates a vesting schedule for a beneficiary (called by CrowdfundVault)
     * @param beneficiary Address of the token recipient
     * @param amount Total tokens to vest
     */
    function createVestingSchedule(address beneficiary, uint256 amount) external onlyOwner {
        require(amount <= CROWDFUND_ALLOCATION, "Exceeds crowdfund allocation");
        require(!vestingSchedules[beneficiary].initialized, "Vesting already exists");

        vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            releasedAmount: 0,
            startTime: block.timestamp,
            duration: 365 days, // 12 months linear vesting
            initialized: true
        });

        // Mint tokens to this contract for vesting
        _mint(address(this), amount);

        emit VestingScheduleCreated(beneficiary, amount, block.timestamp, 365 days);
    }

    /**
     * @notice Releases vested tokens to the beneficiary (linear over 12 months)
     */
    function releaseVestedTokens() external {
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        require(schedule.initialized, "No vesting schedule");
        require(block.timestamp >= schedule.startTime, "Vesting not started");

        uint256 elapsedTime = block.timestamp - schedule.startTime;
        uint256 vestedAmount = (schedule.totalAmount * elapsedTime) / schedule.duration;
        if (elapsedTime >= schedule.duration) {
            vestedAmount = schedule.totalAmount;
        }
        uint256 releasable = vestedAmount - schedule.releasedAmount;
        require(releasable > 0, "No tokens to release");

        schedule.releasedAmount += releasable;
        _transfer(address(this), msg.sender, releasable);

        emit TokensVested(msg.sender, releasable);
    }

    /**
     * @notice Returns the vesting info for a beneficiary
     */
    function getVestingInfo(address beneficiary) external view returns (
        uint256 totalAmount,
        uint256 releasedAmount,
        uint256 vestedAmount,
        uint256 releasableAmount,
        uint256 startTime,
        uint256 endTime
    ) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        if (!schedule.initialized) {
            return (0, 0, 0, 0, 0, 0);
        }

        uint256 elapsedTime = block.timestamp > schedule.startTime ? block.timestamp - schedule.startTime : 0;
        uint256 vested = (schedule.totalAmount * elapsedTime) / schedule.duration;
        if (elapsedTime >= schedule.duration) {
            vested = schedule.totalAmount;
        }

        return (
            schedule.totalAmount,
            schedule.releasedAmount,
            vested,
            vested - schedule.releasedAmount,
            schedule.startTime,
            schedule.startTime + schedule.duration
        );
    }

    // Override clock/token/decimals for ERC20Votes compatibility
    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    // solhint-disable-next-line no-empty-blocks
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode_timestamp";
    }
}
