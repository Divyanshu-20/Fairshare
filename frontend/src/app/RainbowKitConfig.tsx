import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
anvil,
mainnet,
sepolia,
polygon,
} from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'FairShare',
  projectId: process.env.NEXT_PUBLIC_CONNECT_WALLET_ID!,
  chains: [anvil, mainnet, sepolia, polygon],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

export default config;