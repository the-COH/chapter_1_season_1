// src/pages/_app.tsx
import "../styles/globals.css";
import "../styles/fonts.css";
import type { AppType } from "next/app";
import {
  WagmiConfig,
  createClient,
  configureChains,
  chain,
  Chain,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

export const CantoTestnet: Chain = {
  id: 740,
  name: "Canto Testnet",
  network: "canto testnet",
  rpcUrls: { default: "https://eth.plexnode.wtf" },
  nativeCurrency: {
    name: "Canto",
    symbol: "CANTO",
    decimals: 18,
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [CantoTestnet],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== CantoTestnet.id) return null;
        return { http: chain.rpcUrls.default };
      },
    }),
  ]
);

const client = createClient({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={client}>
      <div className="staticNoiseOverlay" />
      <div className="scanlinesOverlay" />
      <div className="scanLine" />
      <div className="overlay" />
      <Component {...pageProps} />
    </WagmiConfig>
  );
};

export default MyApp;
