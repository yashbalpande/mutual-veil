import { ethers } from "ethers";
import { getContractAddresses } from "@/config/contracts";

abstract class BaseService {
  protected addresses: ReturnType<typeof getContractAddresses>;

  constructor(signer: ethers.JsonRpcSigner) {
    const chainId = Number((signer.provider as ethers.JsonRpcProvider)._network.chainId);
    this.addresses = getContractAddresses(chainId);
  }
}

const ABIS = {
  riskPool: [
    "function deposit(uint256 amount) external",
    "function withdraw(uint256 amount) external",
    "function getRewards() external view returns (uint256)",
    "function claimRewards() external",
    "function getTotalLiquidity() external view returns (uint256)",
    "function getUserLiquidity(address user) external view returns (uint256)",
    "function getAPY() external view returns (uint256)",
  ],
  coveragePolicy: [
    "function mintPolicy(address to, uint256 riskId, uint256 amountInsured, uint256 termDuration, uint256 premiumPaid) external returns (uint256)",
    "function renewPolicy(uint256 policyId) external",
    "function getPolicyDetails(uint256 policyId) external view returns (uint256 riskId, uint256 amountInsured, uint256 termEnd, uint256 premiumPaid, bool active)",
    "function transferPolicy(address to, uint256 policyId) external",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    "function balanceOf(address owner) external view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
  ],
  claims: [
    "function submitClaim(uint256 policyId, string calldata evidence) external returns (uint256 claimId)",
    "function getClaimStatus(uint256 claimId) external view returns (uint8 status, uint256 amount, string memory evidence)",
    "function processClaim(uint256 claimId) external",
  ],
  governance: [
    "function createProposal(string calldata description, bytes calldata data) external returns (uint256)",
    "function vote(uint256 proposalId, bool support) external",
    "function executeProposal(uint256 proposalId) external",
    "function getProposalDetails(uint256 proposalId) external view returns (address proposer, uint256 votesFor, uint256 votesAgainst, uint256 endTime, bool executed)",
  ],
};

export class RiskPoolService extends BaseService {
  private contract: ethers.Contract;
  private stablecoin: ethers.Contract;

  constructor(signer: ethers.JsonRpcSigner) {
    super(signer);
    this.contract = new ethers.Contract(this.addresses.riskPool, ABIS.riskPool, signer);
    this.stablecoin = new ethers.Contract(
      this.addresses.mockStablecoin,
      ["function approve(address spender, uint256 amount) external returns (bool)"],
      signer
    );
  }

  async deposit(amount: string) {
    const parsedAmount = ethers.parseUnits(amount, 18);
    // First approve the risk pool to spend stablecoins
    const approveTx = await this.stablecoin.approve(this.addresses.riskPool, parsedAmount);
    await approveTx.wait();
    // Then deposit
    const tx = await this.contract.deposit(parsedAmount);
    await tx.wait();
  }

  async withdraw(amount: string) {
    const parsedAmount = ethers.parseUnits(amount, 18);
    const tx = await this.contract.withdraw(parsedAmount);
    await tx.wait();
  }

  async getRewards() {
    const rewards = await this.contract.getRewards();
    return ethers.formatUnits(rewards, 18);
  }

  async claimRewards() {
    const tx = await this.contract.claimRewards();
    await tx.wait();
  }

  async getTotalLiquidity() {
    const liquidity = await this.contract.getTotalLiquidity();
    return ethers.formatUnits(liquidity, 18);
  }

  async getUserLiquidity(address: string) {
    const liquidity = await this.contract.getUserLiquidity(address);
    return ethers.formatUnits(liquidity, 18);
  }

  async getAPY() {
    const apy = await this.contract.getAPY();
    return Number(apy) / 100; // Assuming APY is returned as percentage * 100
  }
}

export class PolicyService extends BaseService {
  private contract: ethers.Contract;
  private stablecoin: ethers.Contract;
  private signer: ethers.JsonRpcSigner;

  constructor(signer: ethers.JsonRpcSigner) {
    super(signer);
    this.signer = signer;
    this.contract = new ethers.Contract(this.addresses.coveragePolicy, ABIS.coveragePolicy, signer);
    this.stablecoin = new ethers.Contract(
      this.addresses.mockStablecoin,
      ["function approve(address spender, uint256 amount) external returns (bool)"],
      signer
    );
  }

  async purchasePolicy(amount: string, riskId: number) {
    const parsedAmount = ethers.parseUnits(amount, 18);
    const premium = (parsedAmount * BigInt(10)) / BigInt(100); // 10% premium
    
    // Approve premium payment
    const approveTx = await this.stablecoin.approve(this.addresses.coveragePolicy, premium);
    await approveTx.wait();
    
    // Get signer's address
    const signerAddress = await this.signer.getAddress();
    
    // Purchase policy
    const tx = await this.contract.mintPolicy(
      signerAddress,
      riskId,
      parsedAmount,
      BigInt(30 * 24 * 3600), // 30 days
      premium
    );
    await tx.wait();
  }

  async renewPolicy(policyId: number) {
    const tx = await this.contract.renewPolicy(policyId);
    await tx.wait();
  }

  async transferPolicy(to: string, policyId: number) {
    const tx = await this.contract.transferPolicy(to, policyId);
    await tx.wait();
  }

  async getPolicyDetails(policyId: number) {
    const details = await this.contract.getPolicyDetails(policyId);
    return {
      riskId: Number(details.riskId),
      amountInsured: ethers.formatUnits(details.amountInsured, 18),
      termEnd: Number(details.termEnd),
      premiumPaid: ethers.formatUnits(details.premiumPaid, 18),
      active: details.active,
    };
  }

  async getUserPolicies(userAddress: string) {
    // Get the number of policies owned by the user
    const balance = await this.contract.balanceOf(userAddress);
    
    // Fetch each policy owned by the user
    const policies = [];
    for (let i = 0; i < Number(balance); i++) {
      const policyId = await this.contract.tokenOfOwnerByIndex(userAddress, i);
      const details = await this.getPolicyDetails(Number(policyId));
      policies.push({
        id: Number(policyId),
        riskId: details.riskId,
        amountInsured: details.amountInsured,
        termEnd: details.termEnd,
        active: details.active,
      });
    }

    return policies;
  }
}

export class ClaimsService extends BaseService {
  private contract: ethers.Contract;

  constructor(signer: ethers.JsonRpcSigner) {
    super(signer);
    this.contract = new ethers.Contract(this.addresses.payoutEngine, ABIS.claims, signer);
  }

  async submitClaim(policyId: number, evidence: string) {
    const tx = await this.contract.submitClaim(policyId, evidence);
    await tx.wait();
  }

  async getClaimStatus(claimId: number) {
    const status = await this.contract.getClaimStatus(claimId);
    return {
      status: ['Pending', 'Approved', 'Rejected', 'Paid'][Number(status.status)],
      amount: ethers.formatUnits(status.amount, 18),
      evidence: status.evidence,
    };
  }

  async processClaim(claimId: number) {
    const tx = await this.contract.processClaim(claimId);
    await tx.wait();
  }
}

export class GovernanceService extends BaseService {
  private contract: ethers.Contract;

  constructor(signer: ethers.JsonRpcSigner) {
    super(signer);
    this.contract = new ethers.Contract(this.addresses.governanceToken, ABIS.governance, signer);
  }

  async createProposal(description: string, data: string) {
    const tx = await this.contract.createProposal(description, data);
    await tx.wait();
  }

  async vote(proposalId: number, support: boolean) {
    const tx = await this.contract.vote(proposalId, support);
    await tx.wait();
  }

  async executeProposal(proposalId: number) {
    const tx = await this.contract.executeProposal(proposalId);
    await tx.wait();
  }

  async getProposalDetails(proposalId: number) {
    const details = await this.contract.getProposalDetails(proposalId);
    return {
      proposer: details.proposer,
      votesFor: ethers.formatUnits(details.votesFor, 18),
      votesAgainst: ethers.formatUnits(details.votesAgainst, 18),
      endTime: Number(details.endTime),
      executed: details.executed,
    };
  }
}