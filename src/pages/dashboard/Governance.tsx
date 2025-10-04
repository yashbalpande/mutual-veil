import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { GovernanceService } from "@/services/blockchain";
import { useWallet } from "@/context/WalletContext";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  votesFor: string;
  votesAgainst: string;
  endTime: number;
  executed: boolean;
  status: 'Active' | 'Pending' | 'Executed' | 'Failed';
}

const Governance = () => {
  const { toast } = useToast();
  const { signer, account } = useWallet();
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    data: "" // For proposal execution data
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const governanceService = useMemo(() => {
    return signer ? new GovernanceService(signer) : null;
  }, [signer]);

  const loadProposals = useCallback(async () => {
    if (!governanceService) return;

    try {
      // In a real implementation, we would get the total number of proposals
      // and fetch each one's details. For now, we'll use a mock list
      const mockProposals: Proposal[] = await Promise.all([1, 2].map(async (id) => {
        const details = await governanceService.getProposalDetails(id);
        return {
          id,
          title: `Proposal ${id}`,
          description: `Description for proposal ${id}`,
          proposer: details.proposer,
          votesFor: details.votesFor,
          votesAgainst: details.votesAgainst,
          endTime: details.endTime,
          executed: details.executed,
          status: getProposalStatus(details)
        };
      }));

      setProposals(mockProposals);
    } catch (error) {
      console.error("Failed to load proposals:", error);
      toast({
        title: "Error",
        description: "Failed to load governance proposals",
        variant: "destructive",
      });
    }
  }, [governanceService, toast]);

  // Helper function to determine proposal status
  const getProposalStatus = (details: { endTime: number; executed: boolean }) => {
    const now = Math.floor(Date.now() / 1000);
    if (details.executed) return 'Executed';
    if (details.endTime > now) return 'Active';
    return 'Failed';
  };

  // Load proposals on mount and when wallet changes
  useEffect(() => {
    loadProposals();
    const interval = setInterval(loadProposals, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [loadProposals]);

  const handleCreateProposal = async () => {
    if (!governanceService || !newProposal.title || !newProposal.description) return;

    setLoading(true);
    try {
      await governanceService.createProposal(
        JSON.stringify({
          title: newProposal.title,
          description: newProposal.description
        }),
        newProposal.data || "0x"
      );
      toast({
        title: "Success",
        description: "Proposal created successfully",
      });
      setNewProposal({ title: "", description: "", data: "" });
      setIsDialogOpen(false);
      await loadProposals();
    } catch (error) {
      console.error("Failed to create proposal:", error);
      toast({
        title: "Error",
        description: "Failed to create proposal",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleVote = async (proposalId: number, support: boolean) => {
    if (!governanceService) return;

    setLoading(true);
    try {
      await governanceService.vote(proposalId, support);
      toast({
        title: "Success",
        description: `Successfully voted ${support ? 'for' : 'against'} the proposal`,
      });
      await loadProposals();
    } catch (error) {
      console.error("Failed to vote:", error);
      toast({
        title: "Error",
        description: `Failed to vote ${support ? 'for' : 'against'} the proposal`,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleExecute = async (proposalId: number) => {
    if (!governanceService) return;

    setLoading(true);
    try {
      await governanceService.executeProposal(proposalId);
      toast({
        title: "Success",
        description: "Proposal executed successfully",
      });
      await loadProposals();
    } catch (error) {
      console.error("Failed to execute proposal:", error);
      toast({
        title: "Error",
        description: "Failed to execute proposal",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const governanceStats = {
    totalVotingPower: "1,000,000",
    activeProposals: proposals.filter(p => p.status === 'Active').length,
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Proposal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Proposal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newProposal.title}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter proposal title"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newProposal.description}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter proposal description"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Execution Data (Optional)</label>
                  <Input
                    value={newProposal.data}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, data: e.target.value }))}
                    placeholder="Enter execution data (hex)"
                    disabled={loading}
                  />
                </div>
                <Button 
                  className="w-full"
                  onClick={handleCreateProposal}
                  disabled={loading || !newProposal.title || !newProposal.description}
                >
                  Create Proposal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
              const totalVotes = Number(proposal.votesFor) + Number(proposal.votesAgainst);
              const forPercentage = totalVotes > 0 ? (Number(proposal.votesFor) / totalVotes) * 100 : 0;
              const timeLeft = Math.max(0, proposal.endTime - Math.floor(Date.now() / 1000));
              const daysLeft = Math.floor(timeLeft / (24 * 3600));
              const hoursLeft = Math.floor((timeLeft % (24 * 3600)) / 3600);
              
              return (
                <TableRow key={proposal.id}>
                  <TableCell>#{proposal.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{proposal.title}</p>
                      <p className="text-sm text-muted-foreground">{proposal.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Proposed by: {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      proposal.status === 'Active' ? 'bg-green-100 text-green-800' :
                      proposal.status === 'Executed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {proposal.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={forPercentage} />
                      <div className="text-sm">
                        For: {Number(proposal.votesFor).toLocaleString()} ({forPercentage.toFixed(1)}%)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Against: {Number(proposal.votesAgainst).toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {timeLeft > 0 ? (
                      `${daysLeft}d ${hoursLeft}h left`
                    ) : (
                      'Ended'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      {proposal.status === 'Active' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={loading || !account}
                            onClick={() => handleVote(proposal.id, true)}
                          >
                            Vote For
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={loading || !account}
                            onClick={() => handleVote(proposal.id, false)}
                          >
                            Vote Against
                          </Button>
                        </>
                      )}
                      {proposal.status !== 'Active' && !proposal.executed && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={loading || !account}
                          onClick={() => handleExecute(proposal.id)}
                        >
                          Execute
                        </Button>
                      )}
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