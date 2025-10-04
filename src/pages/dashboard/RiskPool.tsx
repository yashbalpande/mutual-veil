import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ethers } from "ethers";

const RiskPool = () => {
  const poolStats = {
    totalLiquidity: "5,000,000",
    activePolicies: "1,234",
    averageAPY: "12.5",
    utilizationRate: 75,
  };

  const riskPools = [
    {
      name: "Smart Contract Cover",
      liquidity: "2,500,000",
      apy: "14.2",
      utilization: 80,
    },
    {
      name: "Stablecoin Depeg",
      liquidity: "1,500,000",
      apy: "11.8",
      utilization: 65,
    },
    {
      name: "Oracle Failure",
      liquidity: "1,000,000",
      apy: "10.5",
      utilization: 55,
    },
  ];

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
          <h3 className="text-sm text-muted-foreground mb-2">Active Policies</h3>
          <p className="text-2xl font-bold">{poolStats.activePolicies}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground mb-2">Average APY</h3>
          <p className="text-2xl font-bold">{poolStats.averageAPY}%</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground mb-2">Utilization Rate</h3>
          <div className="space-y-2">
            <Progress value={poolStats.utilizationRate} />
            <p className="text-2xl font-bold">{poolStats.utilizationRate}%</p>
          </div>
        </Card>
      </div>

      {/* Individual Risk Pools */}
      <h2 className="text-2xl font-semibold mb-6">Risk Pools</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {riskPools.map((pool, index) => (
          <Card key={index} className="p-6">
            <h3 className="text-xl font-semibold mb-4">{pool.name}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Liquidity</p>
                <p className="text-xl font-bold">${pool.liquidity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current APY</p>
                <p className="text-xl font-bold text-green-600">{pool.apy}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Utilization</p>
                <Progress value={pool.utilization} />
                <p className="text-sm mt-1">{pool.utilization}%</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RiskPool;