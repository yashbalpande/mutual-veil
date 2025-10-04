import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers, BrowserProvider, JsonRpcSigner } from "ethers";

interface WalletContextType {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
  provider: null,
  signer: null,
  account: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const prov = new ethers.BrowserProvider(window.ethereum);
      setProvider(prov);

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Check if already connected
      prov.listAccounts().then(accounts => {
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          prov.getSigner().then(setSigner);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
      if (provider) {
        const newSigner = await provider.getSigner();
        setSigner(newSigner);
      }
    }
  };

  const connectWallet = async () => {
    if (!provider) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      const newSigner = await provider.getSigner();
      setAccount(accounts[0]);
      setSigner(newSigner);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Failed to connect wallet: ${error.message}`);
      } else {
        alert('Failed to connect wallet: Unknown error');
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
  };

  return (
    <WalletContext.Provider 
      value={{ 
        provider, 
        signer, 
        account, 
        connectWallet, 
        disconnectWallet 
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};