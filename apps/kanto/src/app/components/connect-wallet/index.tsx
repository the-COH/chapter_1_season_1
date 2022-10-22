/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React, { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { providerName } from '../../../consts';
import { WalletContext } from '../../contexts/wallet-context';
import { connectorsOptions, connectors } from '../../web3/connectors';
import { CloseButton } from '../close-button';
import { Popup } from '../popup';
import './style.css';

const filterConnectots = () => {
	if (!window.ethereum) {
		return connectorsOptions.filter((c) => c.type !== connectors.injected);
	}
	return connectorsOptions;
};

interface Props {
	open: boolean;
	onClose: () => void;
}

export const SelectWallet = ({ onClose, open }: Props) => {
	const { active, error, activate } = useContext(WalletContext);

	useEffect(() => {
		if (!error) {
			return;
		}
		if (error.message === 'The user rejected the request.') {
			toast.error(error.message);
		}
	}, [error]);

	const connect = (connector: any, type: string) => {
		activate(connector);
		window.localStorage.setItem(providerName, type);
	};

	const select = (connector: any, type: string) => {
		try {
			connect(connector, type);
		} catch (error) {
			console.log(error);
		}
		onClose();
	};

	useEffect(() => {
		if (active) {
			close();
		}
	}, [active, onClose]);

	return (
		<Popup open={open} onClose={onClose} className="wallet-select">
			<>
				<div className="flex items-center p-4">
					<h3 className="grow">Select Wallet</h3>
					<CloseButton onClick={onClose} />
				</div>
				<hr className="border-top w-full" />
				<ul className="wallet-select-list">
					{filterConnectots().map((connector: any) => (
						<li
							key={connector.name}
							onClick={() => {
								select(connector.type, connector.name);
							}}
						>
							<img alt="" src={connector.image} />
							<p>{connector.text}</p>
						</li>
					))}
				</ul>
			</>
		</Popup>
	);
};
