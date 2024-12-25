import React from 'react';
import { ConnectKitButton } from 'connectkit';
import { Wallet } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';

export const WalletButton: React.FC = () => {
  const { isConnected } = useWallet();

  return (
    <ConnectKitButton.Custom>
      {({ show }) => (
        <button
          onClick={show}
          className={`fixed top-4 right-4 p-3 rounded-lg shadow-lg transition-all 
                    hover:scale-105 flex items-center gap-2
                    ${isConnected 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-purple-600 hover:bg-purple-700'} 
                    text-white`}
        >
          <Wallet size={20} />
          <span className="text-sm font-medium">
            {isConnected ? 'Connected' : 'Connect Wallet'}
          </span>
        </button>
      )}
    </ConnectKitButton.Custom>
  );
};