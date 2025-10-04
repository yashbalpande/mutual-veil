// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract OracleAdapter is Ownable {
    constructor() Ownable(msg.sender) {}

    // Event emitted when oracle data is submitted
    event OracleDataSubmitted(bytes32 indexed riskId, uint256 value, uint256 timestamp);

    mapping(bytes32 => uint256) public latestData;
    mapping(bytes32 => uint256) public latestTimestamp;

    function submitOracleData(bytes32 riskId, uint256 value) external onlyOwner {
        latestData[riskId] = value;
        latestTimestamp[riskId] = block.timestamp;
        emit OracleDataSubmitted(riskId, value, block.timestamp);
    }

    function getData(bytes32 riskId) external view returns (uint256, uint256) {
        return (latestData[riskId], latestTimestamp[riskId]);
    }

    // Function to check if trigger condition is met (e.g., rainfall > threshold)
    function checkTrigger(bytes32 riskId, uint256 threshold) external view returns (bool) {
        return latestData[riskId] >= threshold;
    }
}
