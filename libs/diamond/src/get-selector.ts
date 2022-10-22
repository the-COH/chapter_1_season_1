import { ethers } from 'ethers';

// get function selector from function signature
export const getSelector = (functionName: string): string => {
	const abiInterface = new ethers.utils.Interface([functionName]);
	return abiInterface.getSighash(ethers.utils.Fragment.from(functionName));
};
