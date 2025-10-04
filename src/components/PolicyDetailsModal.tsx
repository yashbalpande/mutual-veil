import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ethers } from "ethers";

interface PolicyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: {
    id: number;
    amountInsured: string;
    details?: {
      riskId: bigint;
      termEnd: bigint;
      premiumPaid: bigint;
      active: boolean;
    };
  } | null;
}

export const PolicyDetailsModal = ({ isOpen, onClose, policy }: PolicyDetailsModalProps) => {
  if (!policy) return null;

  const now = Math.floor(Date.now() / 1000);
  const termEnd = policy.details ? Number(policy.details.termEnd) : 0;
  const daysRemaining = Math.max(0, Math.floor((termEnd - now) / (24 * 3600)));
  const progress = Math.max(0, Math.min(100, (daysRemaining / 30) * 100)); // Assuming 30-day term

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Policy #{policy.id}</DialogTitle>
          <DialogDescription>
            Coverage details and status information
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={policy.details?.active ? "default" : "destructive"}>
              {policy.details?.active ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-muted-foreground">Coverage Amount</span>
            <span className="font-medium">{policy.amountInsured} USDC</span>
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-muted-foreground">Premium Paid</span>
            <span className="font-medium">
              {policy.details ? ethers.formatUnits(policy.details.premiumPaid, 18) : '0'} USDC
            </span>
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-muted-foreground">Risk Type</span>
            <span className="font-medium">
              {policy.details?.riskId === 1n ? "Smart Contract Cover" :
               policy.details?.riskId === 2n ? "Stablecoin Depeg" :
               policy.details?.riskId === 3n ? "Oracle Failure" : "Unknown"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Coverage Period</span>
              <span className="font-medium">{daysRemaining} days remaining</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Coverage Terms</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Automatic payout on verified claim events</li>
              <li>24/7 oracle monitoring of covered risks</li>
              <li>Transferable policy NFT</li>
              <li>Renewable upon expiration</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};