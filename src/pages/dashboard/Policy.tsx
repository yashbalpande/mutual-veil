import { useState, useCallback, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserPolicy {
  id: number;
  riskType: string;
  amount: string;
  expiry: Date;
  active: boolean;
}
import { useToast } from "@/hooks/use-toast";
import { PolicyService } from "@/services/blockchain";
import { useWallet } from "@/context/WalletContext";

const RISK_TYPES = [
  { id: 1, name: "Smart Contract Cover", description: "Protection against smart contract vulnerabilities and exploits" },
  { id: 2, name: "Stablecoin Depeg", description: "Coverage for stablecoin value loss" },
  { id: 3, name: "Oracle Failure", description: "Protection against oracle manipulation or failure" },
];

export default function Policy() {
  const { toast } = useToast();
  const { signer, account } = useWallet();
  const [loading, setLoading] = useState(false);
  const [selectedRiskId, setSelectedRiskId] = useState<string>("");
  const [coverageAmount, setCoverageAmount] = useState("");
  const [transferAddress, setTransferAddress] = useState("");
  const [policyIdToTransfer, setPolicyIdToTransfer] = useState("");
  const [policyIdToRenew, setPolicyIdToRenew] = useState("");
  const [userPolicies, setUserPolicies] = useState<UserPolicy[]>([]);

  const policyService = useMemo(() => signer ? new PolicyService(signer) : null, [signer]);

  const loadUserPolicies = useCallback(async () => {
    if (!policyService || !account) return;

    try {
      const policies = await policyService.getUserPolicies(account);
      const policyDetails = policies.map(policy => ({
        id: policy.id,
        riskType: RISK_TYPES.find(r => r.id === policy.riskId)?.name || `Risk Type ${policy.riskId}`,
        amount: policy.amountInsured,
        expiry: new Date(Number(policy.termEnd) * 1000),
        active: policy.active
      }));

      setUserPolicies(policyDetails);
    } catch (error) {
      console.error("Failed to load user policies:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load your policies",
        variant: "destructive",
      });
    }
  }, [policyService, account, toast]);

  const calculatePremium = (amount: string, riskId: number) => {
    // This would be replaced with actual premium calculation logic
    // For now, using a simple 10% premium
    return Number(amount) * 0.1;
  };

  useEffect(() => {
    loadUserPolicies();
    // Refresh policies every 30 seconds
    const interval = setInterval(loadUserPolicies, 30000);
    return () => clearInterval(interval);
  }, [loadUserPolicies]);

  const handlePurchasePolicy = async () => {
    if (!policyService || !selectedRiskId || !coverageAmount) return;

    setLoading(true);
    try {
      await policyService.purchasePolicy(coverageAmount, Number(selectedRiskId));
      toast({
        title: "Success",
        description: "Successfully purchased policy",
      });
      setCoverageAmount("");
      setSelectedRiskId("");
      await loadUserPolicies();
    } catch (error) {
      console.error("Failed to purchase policy:", error);
      toast({
        title: "Error",
        description: "Failed to purchase policy",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleTransferPolicy = async () => {
    if (!policyService || !transferAddress || !policyIdToTransfer) return;

    setLoading(true);
    try {
      await policyService.transferPolicy(transferAddress, Number(policyIdToTransfer));
      toast({
        title: "Success",
        description: "Successfully transferred policy",
      });
      setTransferAddress("");
      setPolicyIdToTransfer("");
      await loadUserPolicies();
    } catch (error) {
      console.error("Failed to transfer policy:", error);
      toast({
        title: "Error",
        description: "Failed to transfer policy",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleRenewPolicy = async () => {
    if (!policyService || !policyIdToRenew) return;

    setLoading(true);
    try {
      await policyService.renewPolicy(Number(policyIdToRenew));
      toast({
        title: "Success",
        description: "Successfully renewed policy",
      });
      setPolicyIdToRenew("");
      await loadUserPolicies();
    } catch (error) {
      console.error("Failed to renew policy:", error);
      toast({
        title: "Error",
        description: "Failed to renew policy",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Policy Management</h1>

      {/* Purchase New Policy */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Purchase New Policy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Risk Type</p>
            <Select
              value={selectedRiskId}
              onValueChange={setSelectedRiskId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select risk type" />
              </SelectTrigger>
              <SelectContent>
                {RISK_TYPES.map((risk) => (
                  <SelectItem key={risk.id} value={risk.id.toString()}>
                    {risk.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRiskId && (
              <p className="text-sm text-muted-foreground mt-2">
                {RISK_TYPES.find(r => r.id.toString() === selectedRiskId)?.description}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Coverage Amount</p>
            <div className="flex gap-4">
              <Input
                type="number"
                value={coverageAmount}
                onChange={(e) => setCoverageAmount(e.target.value)}
                placeholder="Enter amount"
                disabled={loading || !signer}
              />
              <Button
                onClick={handlePurchasePolicy}
                disabled={loading || !signer || !selectedRiskId || !coverageAmount}
              >
                Purchase
              </Button>
            </div>
            {selectedRiskId && coverageAmount && (
              <p className="text-sm text-muted-foreground mt-2">
                Premium: ${calculatePremium(coverageAmount, Number(selectedRiskId))}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Transfer Policy */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Transfer Policy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Policy ID</p>
            <Input
              type="number"
              value={policyIdToTransfer}
              onChange={(e) => setPolicyIdToTransfer(e.target.value)}
              placeholder="Enter policy ID"
              disabled={loading || !signer}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Recipient Address</p>
            <div className="flex gap-4">
              <Input
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                placeholder="Enter recipient address"
                disabled={loading || !signer}
              />
              <Button
                onClick={handleTransferPolicy}
                disabled={loading || !signer || !transferAddress || !policyIdToTransfer}
              >
                Transfer
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Renew Policy */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Renew Policy</h2>
        <div className="flex gap-4">
          <Input
            type="number"
            value={policyIdToRenew}
            onChange={(e) => setPolicyIdToRenew(e.target.value)}
            placeholder="Enter policy ID"
            disabled={loading || !signer}
          />
          <Button
            onClick={handleRenewPolicy}
            disabled={loading || !signer || !policyIdToRenew}
          >
            Renew
          </Button>
        </div>
      </Card>

      {/* Active Policies */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Active Policies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPolicies.map((policy) => (
            <Card key={policy.id} className={`p-4 ${!policy.active ? 'opacity-60' : ''}`}>
              <h3 className="font-semibold mb-2 flex justify-between items-center">
                {policy.riskType}
                <span className={`text-sm px-2 py-1 rounded ${
                  policy.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {policy.active ? 'Active' : 'Expired'}
                </span>
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Policy ID:</span> {policy.id}</p>
                <p><span className="text-muted-foreground">Coverage:</span> ${Number(policy.amount).toLocaleString()}</p>
                <p><span className="text-muted-foreground">Expires:</span> {policy.expiry.toLocaleDateString()}</p>
                {!policy.active && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => {
                      setPolicyIdToRenew(policy.id.toString());
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Renew Policy
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}