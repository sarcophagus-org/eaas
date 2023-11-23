import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";
import {
  sepolia,
  mainnet,
  goerli,
  hardhat,
  polygonMumbai,
  baseGoerli,
  polygon,
} from "@wagmi/core/chains";
import { NetworkConfigProvider } from "./NetworkConfigProvider";
import { walletConnectionTheme } from "../theme/walletConnectionTheme";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { chains, provider } = configureChains(
    [mainnet, goerli, hardhat, sepolia, polygonMumbai, baseGoerli, polygon],
    [
      // jsonRpcProvider({
      //   rpc: () => ({
      //     http: `https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY!}`,
      //   }),
      //   priority: 0,
      // }),
      infuraProvider({ apiKey: process.env.REACT_APP_INFURA_API_KEY!, priority: 0 }),
      publicProvider({ priority: 2 }),
    ],
  );

  const { connectors } = getDefaultWallets({
    appName: "Sarcophagus v2",
    projectId: "82c7fb000145342f2d1b57dc2d83d001", // TODO: Update this
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <NetworkConfigProvider>
        <RainbowKitProvider
          chains={chains}
          theme={walletConnectionTheme}
          showRecentTransactions={true}
          appInfo={{
            appName: "Sarcophagus V2 EAAS",
          }}
        >
          {children}
        </RainbowKitProvider>
      </NetworkConfigProvider>
    </WagmiConfig>
  );
}
