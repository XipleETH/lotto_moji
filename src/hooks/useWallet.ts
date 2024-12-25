import { useAccount, useChainId, useDisconnect } from 'wagmi';
import { DEFAULT_CHAIN } from '../config/chains';

export function useWallet() {
  const chainId = useChainId();
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  const isCorrectNetwork = chainId === DEFAULT_CHAIN.id;

  return {
    address,
    isConnected,
    isConnecting,
    isCorrectNetwork,
    disconnect,
    chainId
  };
}