import { Dialog } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';
import pokeballImage from '../../../assets/images/poke-ball.png';
import emptyPokeballImage from '../../../assets/images/empty-pokeball.svg';
import closeImage from '../../../assets/images/close-button.svg';
import './style.scss';
import { ItemsContext } from '../../contexts/items-context';

type Props = {
	open: boolean;
	onClose: () => void;
}

export const Store = ({ onClose, open }: Props) => {
	const { items, itemQuantities, pokemon, pokemonQuantities, purchase, tradeback } = useContext(ItemsContext);
	const [cartItems, setCartItems] = useState<Record<number, number>>({});
	const [showStore, setShowStore] = useState(true);

	const formatPrice = (price: number) => `${price / 1000}K`;

	const cartTotal = useMemo(() => Object.keys(cartItems).reduce((total, itemId) => {
		const item = items.find((item) => item.id === parseInt(itemId, 10));
		return total + item.price * cartItems[itemId];
	}, 0), [cartItems, items]);

	const updateCart = (id: number, newQuantity: number) => {
		let newCart = {
			...cartItems,
			[id]: newQuantity,
		};
		newCart = Object
			.keys(newCart)
			.filter((key) => newCart[key] > 0)
			.reduce((newObj, key) => ({ ...newObj, [key]: newCart[key] }), {});
		setCartItems(newCart);
	};

	const checkout = async () => {
		const items = Object.keys(cartItems).map((id) => ({
			id: parseInt(id, 10),
			quantity: cartItems[id],
		}));
		await purchase(items);
	};

	return (
		<Dialog
			className="store"
			onClose={onClose}
			open={open}
			fullWidth
			maxWidth="xl"
		>
			<div className="flex flex-col overflow-hidden font-[Pixel]">
				<div className="flex mx-8 pt-8 pb-6 border-b-2 items-center">
					<div className={`text-5xl ${showStore ? 'font-bold' : 'font-normal'} cursor-pointer`} onClick={() => setShowStore(true)}>Kanto Store | </div>
					<div className={`text-5xl ${!showStore ? 'font-bold' : 'font-normal'} grow ml-[10px] cursor-pointer`} onClick={() => setShowStore(false)}>Tradeback</div>
					<button type="button" className="text-5xl" onClick={onClose}>
						<img className="w-[64px]" src={closeImage} alt="" />
					</button>
				</div>
				{showStore ? (
					<div className="flex overflow-hidden">
						<div className="p-8 flex flex-wrap overflow-y-scroll height-[700px] w-9/12 hide-scrollbar">
							{items.map((item) => {
								const quantityInCart = cartItems[item.id] ?? 0;
								return (
									<div key={item.id} className="flex w-[535px] items-center pr-4 pb-8">
										<img className="shrink-0 w-[120px] mr-6" src={pokeballImage} alt="" />
										<div className="flex flex-col">
											<div className="text-4xl">{item.name}</div>
											<div className="text-2xl">{item.description}</div>
											<div className="flex mt-1">
												{quantityInCart > 0 ? (
													<div className="flex px-4 pb-2 text-3xl mr-2 buy-button justify-center items-center">
														<button
															type="button"
															className="mr-2"
															onClick={() => updateCart(item.id, cartItems[item.id] - 1)}
														>
															{'<'}
														</button>
														<div className="">{quantityInCart}</div>
														<button
															type="button"
															className="mx-2"
															onClick={() => updateCart(item.id, cartItems[item.id] + 1)}
														>
															{'>'}
														</button>
														<div className="">IN CART</div>
													</div>
												) : (
													<button
														type="button"
														className="px-4 pt-1 pb-2 mr-2 text-3xl buy-button"
														onClick={() => updateCart(item.id, 1)}
													>
														BUY FOR
														{' '}
														{formatPrice(item.price)}
													</button>
												)}
												<div className="px-1 text-center inventory-button">
													<div className="text-md mt-2 -mb-2">INVENTORY</div>
													<div className="text-2xl">{itemQuantities[item.id - 1]}</div>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
						<div className="flex flex-col border-l p-4 w-3/12">
							<div className="text-4xl font-bold">Cart</div>
							{Object.keys(cartItems).length === 0 ? (
								<div className="flex flex-col grow justify-center items-center">
									<img className="w-[120px] mb-2" src={emptyPokeballImage} alt="" />
									<div className="text-2xl text-[#E4E4E4]">Your cart is empty</div>
								</div>
							) : (
								<>
									<div className="grow overflow-y-scroll height-[700px] hide-scrollbar">
										{Object.keys(cartItems).map((itemId) => {
											const item = items.find((item) => item.id === parseInt(itemId, 10));
											return (
												<div key={itemId} className="flex items-center my-4">
													<img className="w-[80px] mr-4 shrink-0" src={pokeballImage} alt="" />
													<div className="flex flex-col">
														<div className="text-lg">{item.name}</div>
														<div className="text-lg">
															{cartItems[itemId]}
															{' '}
															Unit x
															{' '}
															{formatPrice(item.price)}
														</div>
													</div>
												</div>
											);
										})}
									</div>
									<div className="flex flex-col py-2 border-t">
										<div className="flex">
											<div className="text-lg grow">TOTAL</div>
											<div className="text-lg">{formatPrice(cartTotal)}</div>
										</div>
									</div>
								</>
							)}
							<button
								type="button"
								className={`shrink-0 pb-1 text-3xl ${Object.keys(cartItems).length === 0 ? 'checkout-empty-button text-[#E4E4E4]' : 'checkout-button'}`}
								onClick={checkout}
							>
								CHECKOUT
							</button>
						</div>
					</div>
				) : (
					<div className="flex overflow-hidden">
						<div className="p-8 flex flex-wrap overflow-y-scroll height-[700px] w-full hide-scrollbar">
							{pokemon.filter((p) => pokemonQuantities[p.id] > 0).map((p) => (
								<div key={p.id} className="flex w-[535px] items-center pr-4 pb-8">
									<img className="shrink-0 w-[120px] mr-6" src={`/images/pokemon/${p.id}.png`} alt="" />
									<div className="flex flex-col">
										<div className="text-4xl">{p.name}</div>
										<div className="flex mt-2">
											<button
												type="button"
												className="px-4 pt-1 pb-2 mr-2 text-3xl buy-button"
												onClick={() => tradeback([{ id: p.id, quantity: 1 }])}
											>
												SELL FOR
												{' '}
												{formatPrice(p.tradePrice)}
											</button>
											<div className="px-1 text-center inventory-button">
												<div className="text-md mt-2 -mb-2">INVENTORY</div>
												<div className="text-2xl">{pokemonQuantities[p.id]}</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</Dialog>
	);
};
