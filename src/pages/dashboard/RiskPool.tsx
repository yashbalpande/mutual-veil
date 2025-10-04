import { useState, useEffect, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RiskPoolService } from "@/services/blockchain";
import { useWallet } from "@/context/WalletContext";

const RiskPool = () => {
  const { toast } = useToast();
  const { signer, account } = useWallet();
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [poolStats, setPoolStats] = useState({
    totalLiquidity: "0",
    userLiquidity: "0",
    apy: 0,
    rewards: "0",
    activePolicies: "0",
    utilizationRate: 0,
  });

  const riskPoolService = useMemo(() => signer ? new RiskPoolService(signer) : null, [signer]);

  const loadPoolStats = useCallback(async () => {
    if (!riskPoolService || !account) return;

    try {
      const [totalLiquidity, userLiquidity, apy, rewards] = await Promise.all([
        riskPoolService.getTotalLiquidity(),
        riskPoolService.getUserLiquidity(account),
        riskPoolService.getAPY(),
        riskPoolService.getRewards(),
      ]);

      setPoolStats({
        totalLiquidity,
        userLiquidity,
        apy,
        rewards,
        activePolicies: "1,234", // TODO: Get from contract
        utilizationRate: 75, // TODO: Calculate from contract data
      });
    } catch (error) {
      console.error("Failed to load pool stats:", error);
      toast({
        title: "Error",
        description: "Failed to load pool statistics",
        variant: "destructive",
      });
    }
  }, [riskPoolService, account, toast]);

  useEffect(() => {
    loadPoolStats();
    // Set up an interval to refresh stats every 30 seconds
    const interval = setInterval(loadPoolStats, 30000);
    return () => clearInterval(interval);
  }, [signer, account, loadPoolStats]);

  const handleDeposit = async () => {
    if (!riskPoolService) return;
    setLoading(true);
    try {
      await riskPoolService.deposit(depositAmount);
      toast({
        title: "Success",
        description: "Successfully deposited funds into the risk pool",
      });
      setDepositAmount("");
      await loadPoolStats();
    } catch (error) {
      console.error("Failed to deposit:", error);
      toast({
        title: "Error",
        description: "Failed to deposit funds",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleWithdraw = async () => {
    if (!riskPoolService) return;
    setLoading(true);
    try {
      await riskPoolService.withdraw(withdrawAmount);
      toast({
        title: "Success",
        description: "Successfully withdrew funds from the risk pool",
      });
      setWithdrawAmount("");
      await loadPoolStats();
    } catch (error) {
      console.error("Failed to withdraw:", error);
      toast({
        title: "Error",
        description: "Failed to withdraw funds",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleClaimRewards = async () => {
    if (!riskPoolService) return;
    setLoading(true);
    try {
      await riskPoolService.claimRewards();
      toast({
        title: "Success",
        description: "Successfully claimed rewards",
      });
      await loadPoolStats();
    } catch (error) {
      console.error("Failed to claim rewards:", error);
      toast({
        title: "Error",
        description: "Failed to claim rewards",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Risk Pool Dashboard</h1>
      
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground mb-2">Total Liquidity</h3>
          <p className="text-2xl font-bold">${poolStats.totalLiquidity}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground mb-2">Your Liquidity</h3>
          <p className="text-2xl font-bold">${poolStats.userLiquidity}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground mb-2">Current APY</h3>
          <p className="text-2xl font-bold">{poolStats.apy}%</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground mb-2">Utilization Rate</h3>
          <div className="space-y-2">
            <Progress value={poolStats.utilizationRate} />
            <p className="text-2xl font-bold">{poolStats.utilizationRate}%</p>
          </div>
        </Card>
      </div>

      {/* Liquidity Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Deposit</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Amount to Deposit</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount"
                  disabled={loading || !signer}
                />
                <Button
                  onClick={handleDeposit}
                  disabled={loading || !signer || !depositAmount}
                >
                  Deposit
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Withdraw</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Amount to Withdraw</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  disabled={loading || !signer}
                />
                <Button
                  onClick={handleWithdraw}
                  disabled={loading || !signer || !withdrawAmount}
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Rewards */}
      <Card className="p-6 mb-12">
        <h3 className="text-xl font-semibold mb-4">Rewards</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Available Rewards</p>
            <p className="text-2xl font-bold">${poolStats.rewards}</p>
          </div>
          <Button
            onClick={handleClaimRewards}
            disabled={loading || !signer || Number(poolStats.rewards) <= 0}
          >
            Claim Rewards
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RiskPool;