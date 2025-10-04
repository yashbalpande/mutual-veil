import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESSES = {
  mockStablecoin: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  governanceToken: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  riskPool: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  coveragePolicy: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  oracleAdapter: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  payoutEngine: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
};

const TARGET_WALLET = "0xdBCDFA31753eD9C5d984FFaa7Eb2320EeE061A58";

const Hero = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [txs, setTxs] = useState<string[]>([]);
  const [policies, setPolicies] = useState<Array<{id: number, amountInsured: string}>>([]);
  const [buyAmount, setBuyAmount] = useState<string>("100");
  const [oracleData, setOracleData] = useState<string>("");

  useEffect(() => {
    if (window.ethereum) {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      alert("Please install MetaMask!");
      return;
    }
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
    const signer = provider.getSigner();
    setSigner(signer);
    await loadPolicies(accounts[0], signer);
  };

  const trackTx = (txHash: string) => {
    if (account && account.toLowerCase() === TARGET_WALLET.toLowerCase()) {
      setTxs((prev) => [...prev, txHash]);
    }
  };

  // Deposit stablecoin to risk pool
  const depositStablecoin = async () => {
    if (!signer) {
      alert("Connect wallet first");
      return;
    }
    const abi = [
      "function approve(address spender, uint256 amount) public returns (bool)",
    ];
    const stablecoin = new ethers.Contract(CONTRACT_ADDRESSES.mockStablecoin, abi, signer);
    const amount = ethers.utils.parseUnits("100", 18);
    const tx = await stablecoin.approve(CONTRACT_ADDRESSES.riskPool, amount);
    await tx.wait();
    trackTx(tx.hash);

    const riskPoolAbi = [
      "function deposit(uint256 amount) external",
    ];
    const riskPool = new ethers.Contract(CONTRACT_ADDRESSES.riskPool, riskPoolAbi, signer);
    const tx2 = await riskPool.deposit(amount);
    await tx2.wait();
    trackTx(tx2.hash);
    alert("Deposited 100 stablecoins to Risk Pool");
  };

  // Load owned policies
  const loadPolicies = async (userAddress: string, signer: ethers.Signer) => {
    const coveragePolicyAbi = [
      "function balanceOf(address account, uint256 id) view returns (uint256)",
      "function policies(uint256) view returns (uint256 riskId, uint256 amountInsured, uint256 termEnd, uint256 premiumPaid, bool active)",
      "function nextPolicyId() view returns (uint256)"
    ];
    const coveragePolicy = new ethers.Contract(CONTRACT_ADDRESSES.coveragePolicy, coveragePolicyAbi, signer);
    const nextId = await coveragePolicy.nextPolicyId();
    const loadedPolicies = [];
    for (let i = 0; i < nextId; i++) {
      const balance = await coveragePolicy.balanceOf(userAddress, i);
      if (balance.gt(0)) {
        const policy = await coveragePolicy.policies(i);
        loadedPolicies.push({ id: i, amountInsured: ethers.utils.formatUnits(policy.amountInsured, 18) });
      }
    }
    setPolicies(loadedPolicies);
  };

  // Buy policy (mint ERC-1155)
  const buyPolicy = async () => {
    if (!signer) {
      alert("Connect wallet first");
      return;
    }
    const amount = ethers.utils.parseUnits(buyAmount, 18);
    const coveragePolicyAbi = [
      "function mintPolicy(address to, uint256 riskId, uint256 amountInsured, uint256 termDuration, uint256 premiumPaid) external returns (uint256)"
    ];
    const coveragePolicy = new ethers.Contract(CONTRACT_ADDRESSES.coveragePolicy, coveragePolicyAbi, signer);
    // For MVP, use riskId=1, termDuration=30 days, premiumPaid = amount * 0.1 (10%)
    const premiumPaid = amount.div(10);
    const tx = await coveragePolicy.mintPolicy(account, 1, amount, 30 * 24 * 3600, premiumPaid);
    await tx.wait();
    trackTx(tx.hash);
    alert(`Policy purchased for amount ${buyAmount}`);
    await loadPolicies(account, signer);
  };

  // Transfer policy to another address (sell)
  const transferPolicy = async (policyId: number, to: string) => {
    if (!signer) {
      alert("Connect wallet first");
      return;
    }
    const coveragePolicyAbi = [
      "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external"
    ];
    const coveragePolicy = new ethers.Contract(CONTRACT_ADDRESSES.coveragePolicy, coveragePolicyAbi, signer);
    const tx = await coveragePolicy.safeTransferFrom(account, to, policyId, 1, "0x");
    await tx.wait();
    trackTx(tx.hash);
    alert(`Policy ${policyId} transferred to ${to}`);
    await loadPolicies(account, signer);
  };

  // Submit oracle data (simulate)
  const submitOracleData = async () => {
    if (!signer) {
      alert("Connect wallet first");
      return;
    }
    if (!oracleData) {
      alert("Enter oracle data");
      return;
    }
    const oracleAdapterAbi = [
      "function submitData(string calldata data) external"
    ];
    const oracleAdapter = new ethers.Contract(CONTRACT_ADDRESSES.oracleAdapter, oracleAdapterAbi, signer);
    const tx = await oracleAdapter.submitData(oracleData);
    await tx.wait();
    trackTx(tx.hash);
    alert("Oracle data submitted");
  };

  // Execute payout
  const executePayout = async (policyId: number) => {
    if (!signer) {
      alert("Connect wallet first");
      return;
    }
    const payoutEngineAbi = [
      "function executePayout(uint256 policyId) external"
    ];
    const payoutEngine = new ethers.Contract(CONTRACT_ADDRESSES.payoutEngine, payoutEngineAbi, signer);
    const tx = await payoutEngine.executePayout(policyId);
    await tx.wait();
    trackTx(tx.hash);
    alert(`Payout executed for policy ${policyId}`);
  };

  return (
    <div className="p-4 border rounded shadow max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Mutual Veil Insurance DAO MVP</h1>
      {!account ? (
        <button onClick={connectWallet} className="btn btn-primary">
          Connect Wallet
        </button>
      ) : (
        <>
          <p>Connected: {account}</p>
          <button onClick={depositStablecoin} className="btn btn-secondary">
            Deposit 100 Stablecoins to Risk Pool
          </button>

          <div>
            <h2 className="font-semibold mt-4">Buy Policy</h2>
            <input
              type="number"
              min="1"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="border p-1 rounded mr-2"
            />
            <button onClick={buyPolicy} className="btn btn-primary">
              Buy Policy
            </button>
          </div>

          <div>
            <h2 className="font-semibold mt-4">Your Policies</h2>
            {policies.length === 0 && <p>No policies owned.</p>}
            <ul>
              {policies.map((policy) => (
                <li key={policy.id} className="flex items-center space-x-2">
                  <span>Policy ID: {policy.id}, Amount Insured: {policy.amountInsured}</span>
                  <button
                    onClick={() => {
                      const to = prompt("Enter recipient address to transfer policy:");
                      if (to) transferPolicy(policy.id, to);
                    }}
                    className="btn btn-sm btn-outline"
                  >
                    Transfer
                  </button>
                  <button
                    onClick={() => executePayout(policy.id)}
                    className="btn btn-sm btn-primary"
                  >
                    Execute Payout
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mt-4">Submit Oracle Data</h2>
            <input
              type="text"
              value={oracleData}
              onChange={(e) => setOracleData(e.target.value)}
              className="border p-1 rounded mr-2 w-full"
              placeholder="Enter oracle data string"
            />
            <button onClick={submitOracleData} className="btn btn-primary mt-2">
              Submit Oracle Data
            </button>
          </div>

          <div>
            <h2 className="font-semibold mt-4">Tracked Transactions for {TARGET_WALLET}:</h2>
            <ul className="list-disc list-inside max-h-40 overflow-auto">
              {txs.map((tx, idx) => (
                <li key={idx}>
                  <a href={`https://testnet-blockexplorer.helachain.com/tx/${tx}`} target="_blank" rel="noopener noreferrer">
                    {tx}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export { Hero };
