import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Governance = () => {
  const proposals = [
    {
      id: "PROP-001",
      title: "Increase Smart Contract Cover Premium Rate",
      status: "Active",
      votesFor: 75000,
      votesAgainst: 25000,
      endsIn: "2 days",
      description: "Proposal to increase the premium rate for smart contract coverage from 10% to 12%",
    },
    {
      id: "PROP-002",
      title: "Add New Risk Pool for NFT Coverage",
      status: "Active",
      votesFor: 60000,
      votesAgainst: 40000,
      endsIn: "5 days",
      description: "Introduce a new risk pool specifically for NFT theft and smart contract vulnerability coverage",
    },
  ];

  const governanceStats = {
    totalVotingPower: "1,000,000",
    activeProposals: 2,
    participation: 65,
    treasuryBalance: "500,000",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Governance</h1>

      {/* Governance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground mb-2">Total Voting Power</h3>
          <p className="text-2xl font-bold">{governanceStats.totalVotingPower}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground mb-2">Active Proposals</h3>
          <p className="text-2xl font-bold">{governanceStats.activeProposals}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground mb-2">Participation Rate</h3>
          <div className="space-y-2">
            <Progress value={governanceStats.participation} />
            <p className="text-2xl font-bold">{governanceStats.participation}%</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground mb-2">Treasury Balance</h3>
          <p className="text-2xl font-bold">${governanceStats.treasuryBalance}</p>
        </Card>
      </div>

      {/* Active Proposals */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Active Proposals</h2>
          <Button>Create Proposal</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Proposal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Ends In</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map((proposal) => {
              const totalVotes = proposal.votesFor + proposal.votesAgainst;
              const forPercentage = (proposal.votesFor / totalVotes) * 100;
              
              return (
                <TableRow key={proposal.id}>
                  <TableCell>{proposal.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{proposal.title}</p>
                      <p className="text-sm text-muted-foreground">{proposal.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                      {proposal.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={forPercentage} />
                      <div className="text-sm">
                        For: {proposal.votesFor.toLocaleString()} ({forPercentage.toFixed(1)}%)
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{proposal.endsIn}</TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">Vote For</Button>
                      <Button variant="outline" size="sm">Vote Against</Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Governance;