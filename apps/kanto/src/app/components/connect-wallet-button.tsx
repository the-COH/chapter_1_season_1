import React, { useContext, useState } from 'react';
import { WalletContext } from '../contexts/wallet-context';
import { SelectWallet } from './connect-wallet';

export const ConnectWalletButton = () => {
	const [showConnect, setShowConnect] = useState(false);
	const { account, deactivate } = useContext(WalletContext);

	console.log(account);

	return (
		<div>
			{account ? (
				<div>
					<button
						type="button"
						className="text-white text-[15px] font-semibold bg-[#161616] dark:bg-neutral-800 rounded-[10px] h-[50px] w-[220px]"
						onClick={() => deactivate()}
					>
						Disconnect
					</button>
				</div>

			) : (
				<>
					<SelectWallet open={showConnect} onClose={() => setShowConnect(false)} />
					<button
						type="button"
						className="text-white text-[15px] font-semibold bg-[#161616] dark:bg-neutral-800 rounded-[10px] h-[50px] w-[220px]"
						onClick={() => setShowConnect(true)}
					>
						Connect Wallet
					</button>
				</>
			)}
		</div>
	);
};
