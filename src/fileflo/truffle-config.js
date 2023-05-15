require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { INFURA_API_KEY, MNEMONIC, SEPOLIA_ETH_ADDRESS } = process.env;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    sepolia: {
      provider: () => new HDWalletProvider(MNEMONIC, INFURA_API_KEY),
      network_id: '11155111',
      from: SEPOLIA_ETH_ADDRESS
    }
  },
  
  contracts_directory: './contracts/',
  contracts_build_directory: './src/build/',
  compilers: {
    solc: {
      version: '0.8.0',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
