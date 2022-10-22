import { Contract } from 'ethers';
import { isUndefined } from 'lodash';

export class Selectors extends Array<string> {
	public contract: Contract;

	public constructor(values: string[], contract: Contract) {
		super(...(
			isUndefined(contract)
				? []
				: values
		));
		this.contract = contract;
	}

	public remove(functionNames: string[]): Selectors {
		const sighashes = functionNames.map((functionName) =>
			this.contract.interface.getSighash(functionName)
		);
		return new Selectors(
			this.filter((v) => !sighashes.includes(v)),
			this.contract
		);
	}

	public get(functionNames: string[]): Selectors {
		const sighashes = functionNames.map((functionName) =>
			this.contract.interface.getSighash(functionName)
		);
		return new Selectors(
			this.filter((v) => sighashes.includes(v)),
			this.contract
		);
	}

	public getArray(): string[] {
		return [...this];
	}
}
