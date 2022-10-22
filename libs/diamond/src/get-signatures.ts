import { Contract } from 'ethers';

export const getSignatures = (contract: Contract): string[] =>
	Object.keys(contract.interface.functions);
