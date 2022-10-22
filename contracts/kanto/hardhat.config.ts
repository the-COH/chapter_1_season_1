import * as dotenv from 'dotenv';
import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'hardhat-contract-sizer';

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	accounts.forEach((account) => {
		console.log(account.address);
	});
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
	solidity: '0.8.8',
	paths: {
		sources: './src',
		tests: './tests',
		cache: './cache',
		artifacts: './artifacts',
	},
	networks: {
		goerli: {
			url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
			accounts: [process.env.CONTRACT_OWNER_PRIVATE_KEY],
		},
		hardhat: {
			chainId: 1337,
			accounts: [{
				privateKey: process.env.CONTRACT_OWNER_PRIVATE_KEY,
				balance: '1000000000000000000',
			}],
		},
		canto: {
			// url: 'https://canto.evm.chandrastation.com',
			url: 'https://jsonrpc.canto.nodestake.top/',
			chainId: 7700,
			accounts: [
				process.env.CONTRACT_OWNER_PRIVATE_KEY,
			],
		},
		mainnet: {
			url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
			accounts: [
				process.env.CONTRACT_OWNER_PRIVATE_KEY,
			],
		},
		rinkeby: {
			url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
			accounts: [
				process.env.CONTRACT_OWNER_PRIVATE_KEY,
			],
		},
		ropsten: {
			url: process.env.ROPSTEN_URL || '',
			accounts: [
				process.env.CONTRACT_OWNER_PRIVATE_KEY,
			],
		},
	},
	gasReporter: {
		enabled: process.env.REPORT_GAS !== undefined,
		currency: 'USD',
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY,
	},
};

export default config;
