import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CustomCursor } from "@/components/CustomCursor";
import { useWallet } from "@/context/WalletContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const { account, connectWallet, disconnectWallet } = useWallet();

  const navigation = [
    { name: 'Overview', href: '/dashboard' },
    { name: 'Risk Pool', href: '/dashboard/risk-pool' },
    { name: 'Claims', href: '/dashboard/claims' },
    { name: 'Governance', href: '/dashboard/governance' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">
                Mutual Veil
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                {navigation.map((item) => (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={location.pathname === item.href ? "default" : "ghost"}
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!account ? (
                <Button variant="outline" onClick={connectWallet}>
                  Connect Wallet
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                  <Button 
                    variant="outline"
                    onClick={disconnectWallet}
                  >
                    Disconnect
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;