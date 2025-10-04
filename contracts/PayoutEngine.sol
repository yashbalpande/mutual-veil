// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RiskPool.sol";
import "./CoveragePolicy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PayoutEngine is Ownable {
    RiskPool public riskPool;
    CoveragePolicy public coveragePolicy;

    event PayoutExecuted(uint256 policyId, address to, uint256 amount);

    constructor(address _riskPool, address _coveragePolicy) Ownable(msg.sender) {
        riskPool = RiskPool(_riskPool);
        coveragePolicy = CoveragePolicy(_coveragePolicy);
    }

    function executePayout(uint256 policyId, address to, uint256 amount) external onlyOwner {
        require(coveragePolicy.isPolicyActive(policyId), "Policy inactive");
        require(amount <= coveragePolicy.getPolicyAmountInsured(policyId), "Amount exceeds insured");
        riskPool.payout(to, amount);
        emit PayoutExecuted(policyId, to, amount);
    }
}
