// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RiskPool is Ownable {
    IERC20 public stablecoin;
    uint256 public totalCapital;
    uint256 public lockedCoverage;
    uint256 public freeReserve;

    mapping(address => uint256) public contributions;

    event Deposited(address indexed contributor, uint256 amount);
    event CoverageLocked(uint256 amount);
    event CoverageUnlocked(uint256 amount);
    event Payout(address indexed to, uint256 amount);

    constructor(address _stablecoin) Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        stablecoin.transferFrom(msg.sender, address(this), amount);
        contributions[msg.sender] += amount;
        totalCapital += amount;
        freeReserve += amount;
        emit Deposited(msg.sender, amount);
    }

    function lockCoverage(uint256 amount) external onlyOwner {
        require(amount <= freeReserve, "Not enough free reserve");
        lockedCoverage += amount;
        freeReserve -= amount;
        emit CoverageLocked(amount);
    }

    function unlockCoverage(uint256 amount) external onlyOwner {
        require(amount <= lockedCoverage, "Not enough locked coverage");
        lockedCoverage -= amount;
        freeReserve += amount;
        emit CoverageUnlocked(amount);
    }

    function payout(address to, uint256 amount) external onlyOwner {
        require(amount <= lockedCoverage, "Amount exceeds locked coverage");
        lockedCoverage -= amount;
        totalCapital -= amount;
        stablecoin.transfer(to, amount);
        emit Payout(to, amount);
    }

    function getFreeReserve() external view returns (uint256) {
        return freeReserve;
    }
}
