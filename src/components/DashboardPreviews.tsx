import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const RiskPoolPreview = () => {
  const riskPools = [
    {
      name: "Smart Contract Cover",
      liquidity: "2.5M",
      apy: "14.2",
      utilization: 80,
    },
    {
      name: "Stablecoin Depeg",
      liquidity: "1.5M",
      apy: "11.8",
      utilization: 65,
    },
    {
      name: "Oracle Failure",
      liquidity: "1.0M",
      apy: "10.5",
      utilization: 55,
    },
  ];

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Risk Pools</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Earn rewards by providing liquidity to our risk pools. Each pool is carefully managed
            with dynamic pricing and risk assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        <div className="text-center">
          <Link to="/dashboard/risk-pool">
            <Button size="lg" variant="outline">View All Risk Pools</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export const ClaimsPreview = () => {
  const recentClaims = [
    {
      type: "Smart Contract Exploit",
      amount: "50,000",
      status: "Approved",
      timeAgo: "2 days ago",
    },
    {
      type: "Stablecoin Depeg",
      amount: "25,000",
      status: "Processing",
      timeAgo: "1 day ago",
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Claims Processing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transparent and automated claims processing with oracle-based verification.
            Get instant payouts when claim conditions are met.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {recentClaims.map((claim, index) => (
            <Card key={index} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{claim.type}</h3>
                  <p className="text-sm text-muted-foreground">{claim.timeAgo}</p>
                </div>
                <div className={claim.status === 'Approved' ? 'text-green-600' : 'text-orange-600'}>
                  {claim.status}
                </div>
              </div>
              <p className="text-2xl font-bold">${claim.amount}</p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/dashboard/claims">
            <Button size="lg" variant="outline">View All Claims</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export const GovernancePreview = () => {
  const proposals = [
    {
      title: "Increase Smart Contract Cover Premium Rate",
      votesFor: 75,
      votesAgainst: 25,
      endsIn: "2 days",
    },
    {
      title: "Add New Risk Pool for NFT Coverage",
      votesFor: 60,
      votesAgainst: 40,
      endsIn: "5 days",
    },
  ];

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Community Governance</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Shape the future of the protocol through decentralized governance.
            Stake tokens to participate in key decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {proposals.map((proposal, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-semibold mb-4">{proposal.title}</h3>
              <div className="space-y-2">
                <Progress value={proposal.votesFor} />
                <div className="flex justify-between text-sm">
                  <span>For: {proposal.votesFor}%</span>
                  <span>Against: {proposal.votesAgainst}%</span>
                </div>
                <p className="text-sm text-muted-foreground">Ends in {proposal.endsIn}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/dashboard/governance">
            <Button size="lg" variant="outline">View All Proposals</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};