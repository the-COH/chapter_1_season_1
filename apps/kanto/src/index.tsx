/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { App } from './app/app';
import { CustomRouter } from './app/components/common/custom-router';
import { customHistory } from './app/utils/history.utils';
import { DarkModeProvider } from './app/contexts/dark-mode-context';
import { WalletProvider } from './app/contexts/wallet-context';
import { ItemsProvider } from './app/contexts/items-context';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
	<React.StrictMode>
		<CustomRouter history={customHistory}>
			<Web3ReactProvider getLibrary={(provider) => new Web3Provider(provider)}>
				<WalletProvider>
					<ItemsProvider>
						<DarkModeProvider>
							<App />
						</DarkModeProvider>
					</ItemsProvider>
				</WalletProvider>
			</Web3ReactProvider>
		</CustomRouter>
		<ToastContainer autoClose={2000} position="top-center" />
	</React.StrictMode>
);
