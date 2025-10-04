import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider, JsonRpcSigner } from "ethers";
import { Button } from "./ui/button";

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
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [txs, setTxs] = useState<string[]>([]);
  const [policies, setPolicies] = useState<Array<{id: number, amountInsured: string}>>([]);
  const [buyAmount, setBuyAmount] = useState<string>("100");
  const [oracleData, setOracleData] = useState<string>("");

  useEffect(() => {
    if (window.ethereum) {
      const prov = new BrowserProvider(window.ethereum);
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
    const signerInstance = await provider.getSigner();
    setSigner(signerInstance);
    await loadPolicies(accounts[0], signerInstance);
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
    const amount = ethers.parseUnits("100", 18);
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
  const loadPolicies = async (userAddress: string, signer: JsonRpcSigner) => {
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
      if (balance > 0n) {
        const policy = await coveragePolicy.policies(i);
        loadedPolicies.push({ id: i, amountInsured: ethers.formatUnits(policy.amountInsured, 18) });
      }
    }
    setPolicies(loadedPolicies);
  };

  // Buy policy (mint ERC-1155)
  const buyPolicy = async () => {
    if (!signer || !account) {
      alert("Connect wallet first");
      return;
    }
    const amount = ethers.parseUnits(buyAmount, 18);
    const coveragePolicyAbi = [
      "function mintPolicy(address to, uint256 riskId, uint256 amountInsured, uint256 termDuration, uint256 premiumPaid) external returns (uint256)"
    ];
    const coveragePolicy = new ethers.Contract(CONTRACT_ADDRESSES.coveragePolicy, coveragePolicyAbi, signer);
    // For MVP, use riskId=1, termDuration=30 days, premiumPaid = amount * 0.1 (10%)
    const premiumPaid = amount / 10n;
    const tx = await coveragePolicy.mintPolicy(account, 1, amount, 30n * 24n * 3600n, premiumPaid);
    await tx.wait();
    trackTx(tx.hash);
    alert(`Policy purchased for amount ${buyAmount}`);
    await loadPolicies(account, signer);
  };

  // Transfer policy to another address (sell)
  const transferPolicy = async (policyId: number, to: string) => {
    if (!signer || !account) {
      alert("Connect wallet first");
      return;
    }
    const coveragePolicyAbi = [
      "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external"
    ];
    const coveragePolicy = new ethers.Contract(CONTRACT_ADDRESSES.coveragePolicy, coveragePolicyAbi, signer);
    const tx = await coveragePolicy.safeTransferFrom(account, to, policyId, 1n, "0x");
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
    const tx = await payoutEngine.executePayout(BigInt(policyId));
    await tx.wait();
    trackTx(tx.hash);
    alert(`Payout executed for policy ${policyId}`);
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="mb-6">
          <span className="text-sm tracking-[0.3em] uppercase font-light">
            Community-Powered Protection Protocol
          </span>
        </div>

        <h1 className="text-7xl md:text-9xl font-bold mb-8 leading-none tracking-tight">
          Mutual Veil
        </h1>

        <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-12 text-muted-foreground font-light leading-relaxed">
          A revolutionary decentralized insurance platform where community members protect each other. 
          Join our risk-sharing network with transparent governance, instant parametric payouts, and 
          flexible coverage options backed by smart contracts.
        </p>

        <div className="flex gap-4 justify-center flex-wrap mb-12">
          {!account ? (
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-none hover:scale-105 transition-transform"
              onClick={connectWallet}
            >
              Connect Wallet
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-none hover:scale-105 transition-transform"
                  onClick={() => depositStablecoin()}
                >
                  Deposit to Risk Pool
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-none hover:scale-105 transition-transform"
                  onClick={() => buyPolicy()}
                >
                  Get Coverage
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-3 gap-12 max-w-3xl mx-auto">
          {[
            { value: account ? `${policies.length}` : "1,000+", label: "Active Policies" },
            { value: "$5M+", label: "Protected Value" },
            { value: "100%", label: "Verified Claims Paid" },
          ].map((stat, i) => (
            <div key={i} className="border-t border-foreground pt-4">
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Policy Management Modal would go here */}
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-foreground rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-foreground rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export { Hero };
