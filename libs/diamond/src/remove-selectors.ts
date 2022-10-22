import { ethers } from 'ethers';
import { Selectors } from './selectors';

// remove selectors using an array of signatures
export const removeSelectors = (selectors: Selectors, signatures: string[]): Selectors => {
	const iface = new ethers.utils.Interface(signatures.map((v) => `function ${v}`));
	const removedSelectors = signatures.map((v) => iface.getSighash(v));

	return new Selectors(
		selectors.filter((v) => !removedSelectors.includes(v)),
		selectors.contract
	);
};
