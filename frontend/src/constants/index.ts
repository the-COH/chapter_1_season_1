export const CONTRACT_ADDRESS="0xb333c85AB0b1193a03EB47149C37DFe382339e78";

const TWO_PARTY_ABI = require("./TwoPartyContract.json")

export const getTwoPartyConfig = (chainId: number | undefined) => ({
    addressOrName: CONTRACT_ADDRESS,
    abi: TWO_PARTY_ABI,
    chainId: chainId
})