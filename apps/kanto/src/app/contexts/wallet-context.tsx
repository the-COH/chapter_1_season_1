import React, {
	createContext,
	ReactNode,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { isNil, noop } from 'lodash';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { useLocalStorage } from '../hooks/use-local-storage.hook';

type ConnectorOption = {
	type: AbstractConnector;
	name: string;
	text: string;
	image: string;
};

export namespace WalletContext {
	export type Value = {
		active: boolean;
		error: Error;
		activate: (connector: AbstractConnector, onError?: (error: Error) => void, throwErrors?: boolean) => void;
		deactivate: () => void;
		account: string;
		showWalletSelector: boolean;
		setShowWalletSelector: (show: boolean) => void;
		connectorOptions: ConnectorOption[],
		library: any;
	};
}

export const WalletContext = createContext<WalletContext.Value>({
	account: null,
	active: false,
	error: null,
	activate: noop,
	deactivate: noop,
	showWalletSelector: false,
	setShowWalletSelector: noop,
	connectorOptions: [],
	library: null,
});
WalletContext.displayName = 'WalletContext';

export const WalletProvider = ({ children }: { children: ReactNode }) => {
	const { account, active, error, activate, deactivate, library } = useWeb3React();
	const [walletConnected, setWalletConnected] = useLocalStorage<boolean>('walletConnected', false);
	const [loaded, setLoaded] = useState(false);
	const [showWalletSelector, setShowWalletSelector] = useState(false);

	const wrappedActivate = useMemo(() => (connector: AbstractConnector, onError?: (error: Error) => void, throwErrors?: boolean) => {
		activate(connector, onError, throwErrors);
		setWalletConnected(true);
	}, [activate, setWalletConnected]);

	const wrappedDeactivate = useMemo(() => () => {
		deactivate();
		setWalletConnected(false);
	}, [deactivate, setWalletConnected]);

	const connectors = useMemo(() => ({
		injected: new InjectedConnector({
			// supportedChainIds: [
			// 	7700, // Canto
			// ],
		}),
		walletConnect: new WalletConnectConnector({
			infuraId: '8d9b86071b8d4247a2a2ac11c75b2308',
			bridge: 'https://bridge.walletconnect.org',
			qrcode: true,
		}),
	}), []);

	const connectorOptions: ConnectorOption[] = useMemo(() => [
		{
			type: connectors.injected,
			name: 'injected',
			text: 'Metamask',
			image: '../../../assets/images/metamask.png',
		},
		{
			type: connectors.walletConnect,
			name: 'walletConnect',
			text: 'wallet Connect',
			image: '../../../assets/images/walletconnect.png',
		},
	], [connectors]);

	useEffect(() => {
		connectors
			.injected
			.isAuthorized()
			.then((isAuthorized) => {
				setLoaded(true);
				if (isAuthorized && !active && isNil(error) && walletConnected) {
					activate(connectors.injected);
				}
			})
			.catch(() => {
				setLoaded(true);
			});
	}, [connectors, activate, active, error, walletConnected, setWalletConnected]);

	const value = useMemo(() => ({
		account: account as string,
		active: active,
		error: error,
		activate: wrappedActivate,
		deactivate: wrappedDeactivate,
		showWalletSelector: showWalletSelector,
		setShowWalletSelector: setShowWalletSelector,
		connectorOptions: connectorOptions,
		library: library,
	}), [
		account,
		active,
		error,
		wrappedActivate,
		wrappedDeactivate,
		showWalletSelector,
		setShowWalletSelector,
		connectorOptions,
		library,
	]);

	return loaded
		? <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
		: null;
};
