import { expect } from 'chai';
import * as dotenv from 'dotenv';
import { ethers } from 'hardhat';
import {
	KantoDiamond,
	TokenFacet,
} from '../typechain-types';
import { deploy } from '../scripts/deploy';

dotenv.config({ path: 'tests/.env.test' });

describe('Basic', async () => {
	let kantoDiamond: KantoDiamond;
	let tokenFacet: TokenFacet;

	before(async () => {
		const KantoDiamondFactory = await ethers.getContractFactory('KantoDiamond');
		const TokenFacetFactory = await ethers.getContractFactory('TokenFacet');

		const contractAddress = await deploy();

		kantoDiamond = KantoDiamondFactory.attach(contractAddress);
		tokenFacet = TokenFacetFactory.attach(contractAddress);

		await Promise.all([
			kantoDiamond.deployed(),
			tokenFacet.deployed(),
		]);
	});

	it('Should have the right name', async () => {
		expect(await tokenFacet.name()).to.eq('Kanto');
	});

	it('Should have the right Symbol', async () => {
		expect(await tokenFacet.symbol()).to.eq('KANTO');
	});
});
