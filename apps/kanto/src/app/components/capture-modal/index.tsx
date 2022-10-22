/* eslint-disable no-nested-ternary */

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Dialog } from '@mui/material';
import { delay, isNil } from 'lodash';
import { BigNumber, ethers } from 'ethers';
import { toast } from 'react-toastify';
import characterImage from '../../../assets/images/character-back.png';
import pokeballImage from '../../../assets/images/poke-ball.png';
import grassTopImage from '../../../assets/images/grass-top.svg';
import grassBottomImage from '../../../assets/images/grass-bottom.svg';
import mysteryBallImage from '../../../assets/images/mystery-ball.svg';
import capturingImage from '../../../assets/images/capturing.gif';
import openBallImage from '../../../assets/images/open-ball.svg';
import './style.css';
import { ItemsContext } from '../../contexts/items-context';
import { default as tokenFacetAbi } from '../../../assets/contract-artifacts/token-facet-abi.json';
import { WalletContext } from '../../contexts/wallet-context';

type Props = {
	open: boolean;
	terrainId: number;
	onCaught: () => void;
	showStore: () => void;
}

export const CaptureModal = ({ open, terrainId, onCaught, showStore }: Props) => {
	const { items, itemQuantities, reloadData } = useContext(ItemsContext);

	const [caught, setCaught] = useState(false);
	const [captureComplete, setCaptureComplete] = useState(false);
	const [capturing, setCapturing] = useState(false);
	const [pokemonId, setPokemonId] = useState<number>(null);

	const { library } = useContext(WalletContext);
	const CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

	const signContract = useMemo(() =>
		!isNil(library)
			? new ethers.Contract(CONTRACT_ADDRESS, tokenFacetAbi, library.getSigner())
			: null, [library]);

	const capture = async (ballId: number) => {
		if (itemQuantities[ballId - 1] === 0) {
			toast.error('You do not have any of this ball in your inventory');
			return;
		}
		if (!isNil(signContract)) {
			setCapturing(true);
			try {
				const transaction = await signContract.mint(terrainId, ballId);
				const rc = await transaction.wait();
				console.log(rc);

				const event = rc.events.find(({ event }) => event === 'TransferSingle');

				if (event) {
					const pokemonId = event.args[3] as BigNumber;
					const captured = event.args[4] as BigNumber;
					console.log(pokemonId.toNumber());
					console.log(captured.toNumber());

					setCaptureComplete(true);
					setCaught(captured.toNumber() === 1);
					setPokemonId(pokemonId.toNumber());
					reloadData();
				} else {
					toast.error('An error occurred during capture');
				}
			} catch (e) {
				console.log(e);
				toast.error('An error occurred during capture');
				setCapturing(false);
				return;
			}

			delay(() => {
				onCaught();
			}, 5000);
		}
	};

	useEffect(() => {
		setCaught(false);
		setCaptureComplete(false);
		setCapturing(false);
	}, [open]);

	return (
		<Dialog
			open={open}
			fullScreen
		>
			<div className="flex flex-col font-[Pixel] capture">
				<div className={`relative h-screen overflow-hidden ${window.innerWidth / window.innerHeight > 1.8 ? 'w-screen' : 'w-screen'}`}>
					<img className="absolute top-[20%] right-[10%] w-1/3" src={grassTopImage} alt="" />
					<img className="absolute top-[10%] right-[17%] w-1/5" src={captureComplete ? `/images/pokemon/${pokemonId}.png` : mysteryBallImage} alt="" />

					<img className="absolute bottom-0 left-0 w-1/2" src={grassBottomImage} alt="" />
					<img className="absolute bottom-0 left-[5%] w-1/3" src={characterImage} alt="" />

					<div className="absolute bottom-0 right-0 flex bg-white rounded-md grow m-8 w-1/3 h-[320px]">
						{caught ? (
							<div className="flex flex-col w-full items-center justify-center">
								<img className="h-32 w-32 mb-1" src={openBallImage} alt="" />
								<img className="absolute inset-1/2 -translate-y-[70%] -translate-x-[45%] h-32 w-32" src={`/images/pokemon/${pokemonId}.png`} alt="" />
								<div className="font-bold text-xl">CAPTURE COMPLETED</div>
							</div>
						) : captureComplete && !caught ? (
							<div className="flex flex-col w-full items-center justify-center">
								<img className="h-32 w-32 mb-1" src={openBallImage} alt="" />
								<div className="font-bold text-xl">CAPTURE FAILED</div>
							</div>
						) : capturing ? (
							<div className="flex flex-col w-full items-center justify-center">
								<img className="h-32 w-32 mb-1" src={capturingImage} alt="" />
								<div className="font-bold text-xl">CAPTURE IN PROGRESS</div>
							</div>
						) : (
							<div className="flex-col px-4 pt-1">
								<div className="flex pt-8 pb-6 border-b-2 items-center">
									<div className="text-5xl ml-2 grow font-bold whitespace-nowrap">Select Ball</div>
									<button
										type="button"
										className="px-4 pt-1 pb-2 mr-2 text-3xl store-button"
										onClick={showStore}
									>
										STORE
									</button>
								</div>
								<div className="flex flex-wrap gap-8 p-6 overflow-scroll hide-scrollbar h-[200px]">
									{items.slice(0, 4).map((ball) => (
										<div
											key={ball.id}
											className="flex-col items-center cursor-pointer"
											onClick={() => capture(ball.id)}
										>
											<div className="flex flex-row">
												<img className="h-[96px]" src={pokeballImage} alt="" />
												<div className="mt-[75px] text-lg font-bold">
													x
													{itemQuantities[ball.id - 1]}
												</div>
											</div>
											<div className="ml-1 font-bold text-lg">{ball.name}</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</Dialog>
	);
};
