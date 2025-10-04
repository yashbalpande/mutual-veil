// Hela Mainnet Contract Addresses
export const HELA_MAINNET = {
  mockStablecoin: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  governanceToken: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  riskPool: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  coveragePolicy: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  oracleAdapter: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  payoutEngine: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
};

// Hela Testnet Contract Addresses (to be updated after deployment)
export const HELA_TESTNET = {
  mockStablecoin: "",
  governanceToken: "",
  riskPool: "",
  coveragePolicy: "",
  oracleAdapter: "",
  payoutEngine: "",
};

// Get contract addresses based on chainId
export const getContractAddresses = (chainId: number) => {
  switch (chainId) {
    case 666: // Hela Mainnet
      return HELA_MAINNET;
    case 666001: // Hela Testnet
      return HELA_TESTNET;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};