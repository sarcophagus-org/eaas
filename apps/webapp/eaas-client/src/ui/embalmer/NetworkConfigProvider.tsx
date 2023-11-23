import { useNetwork } from "wagmi";
import { 
  useEffect, useState,
  createContext, useContext 
} from "react";
import {
  sarco,
  SARCO_SUPPORTED_NETWORKS,
  SarcoNetworkConfig,
} from "@sarcophagus-org/sarcophagus-v2-sdk-client";

const emptyConfig: SarcoNetworkConfig = {
  chainId: 0,
  networkName: "",
  networkShortName: "",
  sarcoTokenAddress: "",
  tokenSymbol: "",
  diamondDeployAddress: "",
  explorerUrl: "",
  etherscanApiUrl: "",
  etherscanApiKey: "",
  apiUrlBase: "",
  bundlr: {
    currencyName: "",
    nodeUrl: "",
  },
  arweaveConfig: {
    host: "",
    port: 0,
    protocol: "https",
    timeout: 0,
    logging: false,
  },
  subgraphUrl: "",
  zeroExApiUrl: "",
  zeroExSellToken: "",
};

export const NetworkConfigContext = createContext<SarcoNetworkConfig>({} as SarcoNetworkConfig);

export function useNetworkConfig(): SarcoNetworkConfig {
  return useContext(NetworkConfigContext);
}

interface SupportedNetwork {
  isSupportedChain: boolean;
  isInitialisingSarcoSdk: boolean;
  isSarcoInitialized: boolean;
  isBundlrConnected: boolean;
  setIsBundlrConnected: Function;
  supportedNetworkNames: string[];
}

export const SupportedNetworkContext = createContext<SupportedNetwork>({} as SupportedNetwork);

// TODO: Rename to something more appropriate. `useNetworkInfo`?
export function useSupportedNetwork(): SupportedNetwork {
  return useContext(SupportedNetworkContext);
}

export function NetworkConfigProvider({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();

  const [currentChainId, setCurrentChainId] = useState<number | undefined>();
  const [isInitialisingSarcoSdk, setIsInitialisingSarcoSdk] = useState(false);
  const [isSdkInitialized, setIsSdkInitialized] = useState(false);
  const [isBundlrConnected, setIsBundlrConnected] = useState(false);
  const [networkConfig, setNetworkConfig] = useState<SarcoNetworkConfig>(emptyConfig);

  const sdkSupportedChainIds = Array.from(SARCO_SUPPORTED_NETWORKS.keys());

  useEffect(() => {
    const validChain = !!chain && sdkSupportedChainIds.includes(chain.id);

    if (isInitialisingSarcoSdk) return;

    const initSarcoSdk = (chainId: number) =>
      sarco
        .init({
          chainId: chainId,
          zeroExApiKey: process.env.REACT_APP_ZERO_EX_API_KEY,
        })
        .then((config) => {
          setCurrentChainId(chain?.id);
          setNetworkConfig(config);
          setIsInitialisingSarcoSdk(false);
          setIsSdkInitialized(true);
        });

    const chainChanged = chain?.id !== currentChainId;
    if (chainChanged) {
      setIsInitialisingSarcoSdk(true);
      setIsSdkInitialized(false);

      new Promise<void>((res) => setTimeout(() => res(), 10)).then(() => {
        if (validChain) {
          initSarcoSdk(chain.id);
        } else {
          setCurrentChainId(chain?.id);
          setIsInitialisingSarcoSdk(false);
        }
      });
    }

    if (validChain && !isSdkInitialized) {
      setIsInitialisingSarcoSdk(true);
      initSarcoSdk(chain.id);
    }
  }, [chain, currentChainId, isSdkInitialized, isInitialisingSarcoSdk, sdkSupportedChainIds]);

  const supportedChainIds =
    process.env.REACT_APP_SUPPORTED_CHAIN_IDS?.split(",").map((id) => parseInt(id)) || [];

  const isSupportedChain = supportedChainIds.includes(networkConfig.chainId);

  const supportedNetworkNames = sdkSupportedChainIds
    .filter((chainId) => supportedChainIds.includes(chainId))
    .map((chainId) => SARCO_SUPPORTED_NETWORKS.get(chainId)!);

  return (
    <NetworkConfigContext.Provider value={networkConfig}>
      <SupportedNetworkContext.Provider
        value={{
          isInitialisingSarcoSdk: isInitialisingSarcoSdk,
          isSarcoInitialized: isSdkInitialized,
          isBundlrConnected,
          setIsBundlrConnected,
          isSupportedChain: isSupportedChain,
          supportedNetworkNames: supportedNetworkNames,
        }}
      >
        {children}
      </SupportedNetworkContext.Provider>
    </NetworkConfigContext.Provider>
  );
}
