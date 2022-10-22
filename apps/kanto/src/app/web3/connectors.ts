import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import metamaskLogo from '../../assets/images/metamask.png';
import walletConnectLogo from '../../assets/images/walletconnect.png';

export const injected = new InjectedConnector({
	supportedChainIds: [1, 3, 4, 5],
});

const walletconnect = new WalletConnectConnector({
	infuraId: '8d9b86071b8d4247a2a2ac11c75b2308',
	bridge: 'https://bridge.walletconnect.org',
	qrcode: true,
});

export const connectors = {
	injected: injected,
	walletConnect: walletconnect,
};

export const connectorsOptions = [
	{
		type: connectors.injected,
		name: 'injected',
		text: 'Metamask',
		image: metamaskLogo,
	},
	{
		type: connectors.walletConnect,
		name: 'walletConnect',
		text: 'Wallet Connect',
		image: walletConnectLogo,
	},
];
