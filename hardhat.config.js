require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hela: {
      url: "https://rpc.helachain.com",
      chainId: 666,
      accounts: [PRIVATE_KEY],
      gasPrice: "auto"
    },
    helaTestnet: {
      url: "https://testnet-rpc.helachain.com",
      chainId: 666001,
      accounts: [PRIVATE_KEY],
      gasPrice: "auto"
    },
    hardhat: {
      chainId: 31337
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: {
      hela: process.env.HELA_API_KEY || ""
    },
    customChains: [
      {
        network: "hela",
        chainId: 666,
        urls: {
          apiURL: "https://api.scan.helachain.com/api",
          browserURL: "https://scan.helachain.com"
        }
      },
      {
        network: "helaTestnet",
        chainId: 666001,
        urls: {
          apiURL: "https://testnet-api.scan.helachain.com/api",
          browserURL: "https://testnet.scan.helachain.com"
        }
      }
    ]
  }
};