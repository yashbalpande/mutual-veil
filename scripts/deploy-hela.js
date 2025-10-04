const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy MockStablecoin
  console.log("Deploying MockStablecoin...");
  const MockStablecoin = await hre.ethers.getContractFactory("MockStablecoin");
  const mockStablecoin = await MockStablecoin.deploy();
  await mockStablecoin.waitForDeployment();
  console.log("MockStablecoin deployed to:", await mockStablecoin.getAddress());

  // Deploy GovernanceToken
  console.log("Deploying GovernanceToken...");
  const GovernanceToken = await hre.ethers.getContractFactory("GovernanceToken");
  const governanceToken = await GovernanceToken.deploy();
  await governanceToken.waitForDeployment();
  console.log("GovernanceToken deployed to:", await governanceToken.getAddress());

  // Deploy RiskPool
  console.log("Deploying RiskPool...");
  const RiskPool = await hre.ethers.getContractFactory("RiskPool");
  const riskPool = await RiskPool.deploy(await mockStablecoin.getAddress());
  await riskPool.waitForDeployment();
  console.log("RiskPool deployed to:", await riskPool.getAddress());

  // Deploy OracleAdapter
  console.log("Deploying OracleAdapter...");
  const OracleAdapter = await hre.ethers.getContractFactory("OracleAdapter");
  const oracleAdapter = await OracleAdapter.deploy();
  await oracleAdapter.waitForDeployment();
  console.log("OracleAdapter deployed to:", await oracleAdapter.getAddress());

  // Deploy CoveragePolicy
  console.log("Deploying CoveragePolicy...");
  const CoveragePolicy = await hre.ethers.getContractFactory("CoveragePolicy");
  const coveragePolicy = await CoveragePolicy.deploy(
    await mockStablecoin.getAddress(),
    await riskPool.getAddress(),
    await oracleAdapter.getAddress()
  );
  await coveragePolicy.waitForDeployment();
  console.log("CoveragePolicy deployed to:", await coveragePolicy.getAddress());

  // Deploy PayoutEngine
  console.log("Deploying PayoutEngine...");
  const PayoutEngine = await hre.ethers.getContractFactory("PayoutEngine");
  const payoutEngine = await PayoutEngine.deploy(
    await coveragePolicy.getAddress(),
    await riskPool.getAddress(),
    await oracleAdapter.getAddress()
  );
  await payoutEngine.waitForDeployment();
  console.log("PayoutEngine deployed to:", await payoutEngine.getAddress());

  // Setup contract relationships
  console.log("Setting up contract relationships...");

  // Grant roles
  const POLICY_MANAGER_ROLE = await coveragePolicy.POLICY_MANAGER_ROLE();
  const RISK_POOL_MANAGER_ROLE = await riskPool.RISK_POOL_MANAGER_ROLE();

  await coveragePolicy.grantRole(POLICY_MANAGER_ROLE, await payoutEngine.getAddress());
  await riskPool.grantRole(RISK_POOL_MANAGER_ROLE, await payoutEngine.getAddress());
  await riskPool.grantRole(RISK_POOL_MANAGER_ROLE, await coveragePolicy.getAddress());

  console.log("Deployment complete!");

  // Log all addresses for easy reference
  console.log("\nDeployed Contract Addresses:");
  console.log("-----------------------------");
  console.log("MockStablecoin:", await mockStablecoin.getAddress());
  console.log("GovernanceToken:", await governanceToken.getAddress());
  console.log("RiskPool:", await riskPool.getAddress());
  console.log("OracleAdapter:", await oracleAdapter.getAddress());
  console.log("CoveragePolicy:", await coveragePolicy.getAddress());
  console.log("PayoutEngine:", await payoutEngine.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });