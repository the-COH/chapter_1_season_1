import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { isNil, range } from 'lodash';
import { BigNumber, ethers } from 'ethers';
import { toast } from 'react-toastify';
import { WalletContext } from './wallet-context';
import { default as gameFacetAbi } from '../../assets/contract-artifacts/game-facet-abi.json';
import { default as tokenFacetAbi } from '../../assets/contract-artifacts/token-facet-abi.json';
import { default as itemJson } from '../../assets/items.json';
import { default as pokemonJson } from '../../assets/pokemon.json';

export namespace ItemsContext {
	export type Item = {
		id: number
		name: string
		description: string
		price: number
	};

	export type Pokemon = {
		id: number
		name: string
		tradePrice: number
	};

	export type InventoryItem = {
		id: number
		quantity: number
	}

	export type Value = {
		items: Item[],
		itemQuantities: number[],
		pokemon: Pokemon[],
		pokemonQuantities: number[],
		viewContract: ethers.Contract,
		signContract: ethers.Contract,
		reloadData: () => void,
		purchase: (items: InventoryItem[]) => Promise<void>;
		tradeback: (pokemon: InventoryItem[]) => Promise<void>;
	};
}

const CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

export const ItemsContext = createContext<ItemsContext.Value>({} as ItemsContext.Value);
ItemsContext.displayName = 'ItemContext';

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
	const { account, library } = useContext(WalletContext);
	const [items] = useState<ItemsContext.Item[]>([
		{
			id: 1,
			name: 'POKÉ BALL',
			description: 'A ball thrown to catch a wild Pokémon. It is designed in a capsule style.',
			price: itemJson[0].price,
		},
		{
			id: 2,
			name: 'GREAT BALL',
			description: 'A good, quality ball that offers a higher Pokémon catch rate than a standard Poké Ball.',
			price: itemJson[1].price,
		},
		{
			id: 3,
			name: 'ULTRA BALL',
			description: 'A better Ball with a higher catch rate than a Great Ball.',
			price: itemJson[2].price,
		},
		{
			id: 4,
			name: 'MASTER BALL',
			description: 'The best Ball with the ultimate performance. It will catch any wild Pokémon without fail.',
			price: itemJson[3].price,
		},
		// {
		// 	id: 5,
		// 	name: 'OLD ROD',
		// 	description: 'An old and beat-up fishing rod. Use it by any body of water to fish for wild Pokémon.',
		// 	price: 8000,
		// 	count: 0,
		// },
		// {
		// 	id: 6,
		// 	name: 'GOOD ROD',
		// 	description: 'A new, good-quality fishing rod. Use it by any body of water to fish for wild Pokémon.',
		// 	price: 16_000,
		// 	count: 0,
		// },
		// {
		// 	id: 7,
		// 	name: 'SUPER ROD',
		// 	description: 'An awesome, high-tech fishing rod. Use it by any body of water to fish for wild Pokémon.',
		// 	price: 32_000,
		// 	count: 0,
		// },
	]);

	const [pokemon] = useState(pokemonJson.map((p, index) => ({
		id: index + 1,
		name: p.name,
		tradePrice: 1000,
	})));

	const [itemQuantities, setItemQuantities] = useState([0, 0, 0, 0]);
	const [pokemonQuantities, setPokemonQuantities] = useState(Array(151).fill(0));

	const viewContract = useMemo(() =>
		!isNil(library)
			? new ethers.Contract(CONTRACT_ADDRESS, gameFacetAbi, library)
			: null, [library]);
	const tokenViewContract = useMemo(() =>
		!isNil(library)
			? new ethers.Contract(CONTRACT_ADDRESS, tokenFacetAbi, library)
			: null, [library]);
	const signContract = useMemo(() =>
		!isNil(library)
			? new ethers.Contract(CONTRACT_ADDRESS, gameFacetAbi, library.getSigner())
			: null, [library]);

	const reloadData = useMemo(() => async () => {
		if (!account) return;

		if (!isNil(viewContract)) {
			const result = await viewContract.getInventoryQuantities(items.map(({ id }) => id));
			setItemQuantities(result);
		}

		if (!isNil(tokenViewContract)) {
			const accounts = Array(151).fill(account);
			const result = await tokenViewContract.balanceOfBatch(accounts, range(0, 151));
			console.log(result.map((quantity: BigNumber) => quantity.toNumber()));
			setPokemonQuantities(result.map((quantity: BigNumber) => quantity.toNumber()));
		}
	}, [account, items, tokenViewContract, viewContract]);

	useEffect(() => {
		reloadData();
	}, [account, reloadData]);

	const purchase = useCallback(async (items: ItemsContext.InventoryItem[]) => {
		if (!isNil(signContract)) {
			const itemIds = items.map(({ id }) => id);
			const quantities = items.map(({ quantity }) => quantity);
			try {
				const transaction = await signContract.purchase(itemIds, quantities);
				await transaction.wait();
				reloadData();
			} catch (e) {
				console.log(e);
				toast.error(e.toString());
			}
		}
	}, [reloadData, signContract]);

	const tradeback = useCallback(async (pokemon: ItemsContext.InventoryItem[]) => {
		if (!isNil(signContract)) {
			const pokemonIds = pokemon.map(({ id }) => id);
			const quantities = pokemon.map(({ quantity }) => quantity);
			try {
				console.log(pokemonIds, quantities);
				const transaction = await signContract.tradeBack(account, pokemonIds, quantities);
				await transaction.wait();
				reloadData();
			} catch (e) {
				console.log(e);
				toast.error(e.toString());
			}
		}
	}, [account, reloadData, signContract]);

	const value = useMemo<ItemsContext.Value>(
		() => ({
			items,
			itemQuantities,
			pokemon,
			pokemonQuantities,
			viewContract,
			signContract,
			reloadData,
			purchase,
			tradeback,
		}),
		[
			items,
			itemQuantities,
			pokemon,
			pokemonQuantities,
			viewContract,
			signContract,
			reloadData,
			purchase,
			tradeback,
		]
	);
	return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
};
