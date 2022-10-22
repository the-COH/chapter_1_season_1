import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { getSelectors, FacetCut, getSignatures } from 'diamond';
import { BytesLike } from 'ethers';
import { IDiamondWritable } from '../typechain-types/@solidstate/contracts/proxy/diamond/ISolidStateDiamond';

dotenv.config();

export const deploy = async () => {
	const [owner] = await ethers.getSigners();

	// Deploy Diamond
	const KantoDiamond = await ethers.getContractFactory('KantoDiamond');
	// const kantoDiamond = await KantoDiamond.deploy();
	const kantoDiamond = KantoDiamond.attach('0x95E897C9EB0E36C56fF14E8278E75c89E3523876');
	await kantoDiamond.deployed();
	console.log(`KantoDiamond deployed: ${kantoDiamond.address}`);

	// Deploy KantoInit (Initializer)
	const KantoInit = await ethers.getContractFactory('KantoInit');
	// const kantoInit = await KantoInit.deploy();
	const kantoInit = KantoInit.attach('0xabafC820ac706eF26e85672784279B1C4F129C27');
	await kantoInit.deployed();
	console.log(`KantoInit deployed:, ${kantoInit.address}`);

	// Deploy facets
	const facetArtifacts = [
		(await import('../artifacts/src/facets/GameFacet.sol/GameFacet.json')).default,
		(await import('../artifacts/src/facets/TokenFacet.sol/TokenFacet.json')).default,
	];

	const facetAddresses = [
		'0x405415Cfa21e148f81E2B70586A3Cba376c0c559',
		'0xf7875bAF6719f3b1C992B7AD7720b8d786388EeC',
	];

	// Deploy the rest of the functions on DiamondLoupeFacet
	const cuts: IDiamondWritable.FacetCutStruct[] = [];

	for (const facetArtifact of facetArtifacts) {
		const Facet = await ethers.getContractFactory(facetArtifact.abi, facetArtifact.bytecode);
		// const facet = await Facet.deploy();
		const facet = Facet.attach(facetAddresses[facetArtifacts.findIndex((artifact) => artifact.contractName === facetArtifact.contractName)]);

		await facet.deployed();
		console.log(`Facet ${facetArtifact.contractName} deployed: ${facet.address}`);

		let selectors: BytesLike[];
		if (facetArtifact.contractName === 'GameFacet') {
			selectors = getSelectors(facet).remove([
				'acceptOwnership()',
				'nomineeOwner()',
				'owner()',
				'transferOwnership(address)',
			]).getArray();
		} else if (facetArtifact.contractName === 'TokenFacet') {
			selectors = getSelectors(facet).remove([
				'supportsInterface(bytes4)',
				'acceptOwnership()',
				'nomineeOwner()',
				'owner()',
				'transferOwnership(address)',
			]).getArray();
		}

		cuts.push({
			target: facet.address,
			action: FacetCut.Action.Add,
			selectors: selectors,
		});
	}

	console.log(cuts);

	const diamondCut = await ethers.getContractAt('ISolidStateDiamond', kantoDiamond.address);
	const initCall = kantoInit.interface.encodeFunctionData('init');
	const transaction = await diamondCut.diamondCut(cuts, kantoInit.address, initCall);
	console.log(`Diamond cut transaction: ${transaction.hash}`);
	const receipt = await transaction.wait();

	if (!receipt.status) {
		throw Error(`Diamond upgrade failed: ${transaction.hash}`);
	}

	console.log('Completed diamond cut');
	return kantoDiamond.address;
};

if (require.main === module) {
	deploy()
		.then(() => process.exit(0))
		.catch((error) => {
			console.error(error);
			process.exit(1);
		});
}
