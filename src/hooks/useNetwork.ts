import { useNetwork as useWagmiNetwork, useSwitchNetwork } from 'wagmi';
import { DEFAULT_CHAIN } from '../config/chains';

export function useNetwork() {
  const { chain, chains } = useWagmiNetwork();
  const { switchNetwork, isLoading: isSwitching } = useSwitchNetwork();

  const isCorrectNetwork = chain?.id === DEFAULT_CHAIN.id;

  const switchToLens = async () => {
    if (!isCorrectNetwork && switchNetwork) {
      await switchNetwork(DEFAULT_CHAIN.id);
    }
  };

  return {
    chain,
    chains,
    isCorrectNetwork,
    switchToLens,
    isSwitching
  };
}