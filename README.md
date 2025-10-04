# Mutual Veil - Decentralized Insurance Platform

Mutual Veil is a decentralized insurance platform built on Ethereum that enables users to participate in risk pools, purchase insurance policies, and engage in decentralized governance. The platform combines traditional insurance concepts with DeFi mechanics to create a transparent, efficient, and user-controlled insurance ecosystem.

## Features

### Risk Pools
- Deposit liquidity to earn rewards
- Withdraw liquidity at any time
- Real-time APY calculations
- Automatic reward distribution
- Pool utilization tracking

### Policy Management
- Purchase insurance policies for different risk types:
  - Smart Contract Cover
  - Stablecoin Depeg Protection
  - Oracle Failure Coverage
- Transfer policies to other addresses
- Renew policies before expiration
- View detailed policy information

### Claims Processing
- Submit claims with evidence
- Track claim status
- Automated claim verification
- Quick claim payouts
- Transparent claim history

### Governance
- Create improvement proposals
- Vote on active proposals
- Execute approved proposals
- Real-time voting statistics
- Treasury management

## Technology Stack

- Frontend:
  - React.js
  - TypeScript
  - Tailwind CSS
  - shadcn/ui Components
  - Vite

- Blockchain:
  - Ethereum
  - Solidity Smart Contracts
  - Ethers.js v6
  - Hardhat Development Framework

## Smart Contracts

### Core Contracts

1. **RiskPool.sol**
   - Manages liquidity pools
   - Handles deposits and withdrawals
   - Calculates and distributes rewards

2. **CoveragePolicy.sol**
   - ERC721-based insurance policies
   - Policy minting and management
   - Premium calculations

3. **PayoutEngine.sol**
   - Processes insurance claims
   - Manages claim verification
   - Handles payouts

4. **GovernanceToken.sol**
   - ERC20 governance token
   - Voting power delegation
   - Proposal management

5. **OracleAdapter.sol**
   - External data integration
   - Price feeds
   - Risk assessment data

## Getting Started

### Prerequisites
- Node.js v16+
- npm or yarn
- MetaMask or similar Web3 wallet

### Wallet Configuration

#### MetaMask Setup

1. **Add Hela Mainnet:**
   - Network Name: Hela Network
   - RPC URL: https://rpc.helachain.com
   - Chain ID: 666
   - Currency Symbol: HELA
   - Block Explorer: https://scan.helachain.com

2. **Add Hela Testnet:**
   - Network Name: Hela Testnet
   - RPC URL: https://testnet-rpc.helachain.com
   - Chain ID: 666001
   - Currency Symbol: tHELA
   - Block Explorer: https://testnet.scan.helachain.com

3. **Add Contract Tokens:**
   - In MetaMask, click "Import Token"
   - Add the following tokens:
     - Governance Token (MVEIL)
     - Mock Stablecoin (MUSD)
   - Use the contract addresses provided in the "Deployed Contract Addresses" section

4. **Get Test Tokens:**
   - Visit the Hela Testnet Faucet: https://faucet.helachain.com
   - Request test tHELA tokens
   - Use the Mock Stablecoin faucet function to get test MUSD

### Installation

1. Clone the repository
```bash
git clone https://github.com/yashbalpande/mutual-veil.git
cd mutual-veil
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Deploy smart contracts

For local development:
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

For Hela Network deployment:
```bash
# Deploy to Hela Testnet
npx hardhat run scripts/deploy-hela.js --network helaTestnet

# Deploy to Hela Mainnet
npx hardhat run scripts/deploy-hela.js --network hela
```

### Hela Network Integration

The platform is deployed on the Hela Network, a next-generation blockchain designed for decentralized insurance and DeFi applications.

#### Hela Network Details

**Mainnet**
- Network Name: Hela Network
- RPC URL: https://rpc.helachain.com
- Chain ID: 666
- Currency Symbol: HELA
- Block Explorer: https://scan.helachain.com

**Testnet**
- Network Name: Hela Testnet
- RPC URL: https://testnet-rpc.helachain.com
- Chain ID: 666001
- Currency Symbol: tHELA
- Block Explorer: https://testnet.scan.helachain.com
- Faucet: https://faucet.helachain.com

#### Deployed Contract Addresses

**Mainnet (Chain ID: 666)**
```
MockStablecoin: 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6
GovernanceToken: 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
RiskPool: 0x610178dA211FEF7D417bC0e6FeD39F05609AD788
CoveragePolicy: 0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e
OracleAdapter: 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0
PayoutEngine: 0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82
```

**Testnet (Chain ID: 666001)**
```
MockStablecoin: 0x9A676e781A523b5d0C0e43731313A708CB607508
GovernanceToken: 0x0165878A594ca255338adfa4d48449f69242Eb8F
RiskPool: 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
CoveragePolicy: 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6
OracleAdapter: 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
PayoutEngine: 0x610178dA211FEF7D417bC0e6FeD39F05609AD788
```

#### Network Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_CHAIN_ID=666
VITE_RPC_URL=https://rpc.helachain.com
```

## Project Structure

```
mutual-veil/
├── contracts/              # Smart contracts
├── src/
│   ├── components/         # React components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # Blockchain services
│   └── lib/               # Utilities and helpers
├── scripts/               # Deployment scripts
├── test/                  # Contract tests
└── hardhat.config.js      # Hardhat configuration
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

This project is provided as-is. Users should conduct their own security audits before using in production.

## Contact

Yash Balpande - [GitHub](https://github.com/yashbalpande)

Project Link: [https://github.com/yashbalpande/mutual-veil](https://github.com/yashbalpande/mutual-veil)
