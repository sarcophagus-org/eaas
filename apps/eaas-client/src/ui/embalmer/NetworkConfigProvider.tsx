import { useEffect, useState, createContext, useContext } from "react";
import {
  sarco,
  SARCO_SUPPORTED_NETWORKS,
  SarcoNetworkConfig,
} from "@sarcophagus-org/sarcophagus-v2-sdk-client";
import { WagmiConfig, createClient } from "wagmi";
import { ethers } from "ethers";

export const NetworkConfigContext = createContext<SarcoNetworkConfig>({} as SarcoNetworkConfig);

export function useNetworkConfig(): SarcoNetworkConfig {
  return useContext(NetworkConfigContext);
}

interface SupportedNetwork {
  isSupportedChain: boolean;
  isInitialisingSarcoSdk: boolean;
  isSarcoInitialized: boolean;
  supportedNetworkNames: string[];
}

export const SupportedNetworkContext = createContext<SupportedNetwork>({} as SupportedNetwork);

export function useSupportedNetwork(): SupportedNetwork {
  return useContext(SupportedNetworkContext);
}

export function NetworkConfigProvider({ children }: { children: React.ReactNode }) {
  const wagmiClient = createClient({
    autoConnect: true,
    provider: new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER_URL!),
  });

  const [isInitialisingSarcoSdk, setIsInitialisingSarcoSdk] = useState(false);
  const [isSdkInitialized, setIsSdkInitialized] = useState(false);

  const sdkSupportedChainIds = Array.from(SARCO_SUPPORTED_NETWORKS.keys());
  const chainId = Number.parseInt(process.env.REACT_APP_CHAIN_ID!);

  useEffect(() => {
    const validChain = sdkSupportedChainIds.includes(chainId);

    if (isInitialisingSarcoSdk) return;

    if (validChain && !isSdkInitialized) {
      setIsInitialisingSarcoSdk(true);
      sarco
        .init({
          chainId,
          zeroExApiKey: process.env.REACT_APP_ZERO_EX_API_KEY,
          skipLibp2pNode: true,
          providerUrl: process.env.REACT_APP_PROVIDER_URL,
        })
        .then((_) => {
          setIsInitialisingSarcoSdk(false);
          setIsSdkInitialized(true);
        });
    }
  }, [isSdkInitialized, isInitialisingSarcoSdk, sdkSupportedChainIds, chainId]);

  const supportedChainIds =
    process.env.REACT_APP_SUPPORTED_CHAIN_IDS?.split(",").map((id) => parseInt(id)) || [];

  const isSupportedChain = supportedChainIds.includes(chainId);

  const supportedNetworkNames = sdkSupportedChainIds
    .filter((chainId) => supportedChainIds.includes(chainId))
    .map((chainId) => SARCO_SUPPORTED_NETWORKS.get(chainId)!);

  return (
    <WagmiConfig client={wagmiClient}>
      <SupportedNetworkContext.Provider
        value={{
          isInitialisingSarcoSdk: isInitialisingSarcoSdk,
          isSarcoInitialized: isSdkInitialized,
          isSupportedChain: isSupportedChain,
          supportedNetworkNames: supportedNetworkNames,
        }}
      >
        {children}
      </SupportedNetworkContext.Provider>
    </WagmiConfig>
  );
}
