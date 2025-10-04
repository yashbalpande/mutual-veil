import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  console.log("Deploying contracts...");

  // Deploy MockStablecoin
  const MockStablecoin = await ethers.getContractFactory("MockStablecoin");
  const mockStablecoin = await MockStablecoin.deploy();
  await mockStablecoin.waitForDeployment();
  const stablecoinAddress = await mockStablecoin.getAddress();
  console.log("MockStablecoin deployed to:", stablecoinAddress);

  // Deploy GovernanceToken
  const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
  const governanceToken = await GovernanceToken.deploy();
  await governanceToken.waitForDeployment();
  const govTokenAddress = await governanceToken.getAddress();
  console.log("GovernanceToken deployed to:", govTokenAddress);

  // Deploy RiskPool
  const RiskPool = await ethers.getContractFactory("RiskPool");
  const riskPool = await RiskPool.deploy(stablecoinAddress);
  await riskPool.waitForDeployment();
  const riskPoolAddress = await riskPool.getAddress();
  console.log("RiskPool deployed to:", riskPoolAddress);

  // Deploy CoveragePolicy
  const CoveragePolicy = await ethers.getContractFactory("CoveragePolicy");
  const coveragePolicy = await CoveragePolicy.deploy();
  await coveragePolicy.waitForDeployment();
  const coveragePolicyAddress = await coveragePolicy.getAddress();
  console.log("CoveragePolicy deployed to:", coveragePolicyAddress);

  // Deploy OracleAdapter
  const OracleAdapter = await ethers.getContractFactory("OracleAdapter");
  const oracleAdapter = await OracleAdapter.deploy();
  await oracleAdapter.waitForDeployment();
  const oracleAddress = await oracleAdapter.getAddress();
  console.log("OracleAdapter deployed to:", oracleAddress);

  // Deploy PayoutEngine
  const PayoutEngine = await ethers.getContractFactory("PayoutEngine");
  const payoutEngine = await PayoutEngine.deploy(riskPoolAddress, coveragePolicyAddress);
  await payoutEngine.waitForDeployment();
  const payoutEngineAddress = await payoutEngine.getAddress();
  console.log("PayoutEngine deployed to:", payoutEngineAddress);

  console.log("All contracts deployed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
