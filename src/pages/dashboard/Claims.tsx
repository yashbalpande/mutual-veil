import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Claims = () => {
  const claims = [
    {
      id: "CLM-001",
      policyId: "POL-123",
      type: "Smart Contract Exploit",
      amount: "50,000",
      status: "Approved",
      date: "2025-10-01",
      evidence: "Contract vulnerability CVE-2025-1234",
    },
    {
      id: "CLM-002",
      policyId: "POL-456",
      type: "Stablecoin Depeg",
      amount: "25,000",
      status: "Pending",
      date: "2025-10-03",
      evidence: "Price feed data showing depeg event",
    },
    {
      id: "CLM-003",
      policyId: "POL-789",
      type: "Oracle Failure",
      amount: "75,000",
      status: "Processing",
      date: "2025-10-04",
      evidence: "Oracle downtime logs",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Claims History</h1>

      <div className="space-y-6">
        {claims.map((claim) => (
          <Card key={claim.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold">Claim {claim.id}</h3>
                  <Badge>{claim.type}</Badge>
                  <Badge variant={getStatusColor(claim.status) as any}>
                    {claim.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Policy ID</p>
                    <p className="font-medium">{claim.policyId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Claim Amount</p>
                    <p className="font-medium">${claim.amount} USDC</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{claim.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Evidence</p>
                    <p className="font-medium">{claim.evidence}</p>
                  </div>
                </div>
              </div>

              <Button variant="outline">View Details</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Claims;