import { Contract } from 'ethers';
import { Selectors } from './selectors';
import { getSignatures } from './get-signatures';

// get function selectors from ABI
export const getSelectors = (contract: Contract): Selectors => {
	const signatures = getSignatures(contract);
	return new Selectors(
		signatures
			.filter((v) => v !== 'init(bytes)')
			.map((v) => contract.interface.getSighash(v)),
		contract
	);
};
