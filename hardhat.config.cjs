require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const config = {
  solidity: "0.8.20",
  networks: {
    helaTestnet: {
      type: "http",
      url: "https://testnet-rpc.helachain.com",
      chainId: 666888,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

module.exports = config;
