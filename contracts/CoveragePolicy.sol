// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CoveragePolicy is ERC1155, Ownable {
    uint256 public nextPolicyId;

    struct Policy {
        uint256 riskId;
        uint256 amountInsured;
        uint256 termEnd;
        uint256 premiumPaid;
        bool active;
    }

    mapping(uint256 => Policy) public policies;

    constructor() ERC1155("https://api.example.com/metadata/{id}.json") Ownable(msg.sender) {}

    function mintPolicy(
        address to,
        uint256 riskId,
        uint256 amountInsured,
        uint256 termDuration,
        uint256 premiumPaid
    ) external onlyOwner returns (uint256) {
        uint256 policyId = nextPolicyId++;
        policies[policyId] = Policy({
            riskId: riskId,
            amountInsured: amountInsured,
            termEnd: block.timestamp + termDuration,
            premiumPaid: premiumPaid,
            active: true
        });
        _mint(to, policyId, 1, "");
        return policyId;
    }

    function burnPolicy(uint256 policyId) external onlyOwner {
        require(policies[policyId].active, "Policy inactive");
        policies[policyId].active = false;
        _burn(msg.sender, policyId, 1);
    }

    function uri(uint256 policyId) public view override returns (string memory) {
        require(policies[policyId].active, "Policy inactive");
        return super.uri(policyId);
    }

    function isPolicyActive(uint256 policyId) public view returns (bool) {
        return policies[policyId].active;
    }

    function getPolicyAmountInsured(uint256 policyId) public view returns (uint256) {
        return policies[policyId].amountInsured;
    }
}
