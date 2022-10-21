import { useContractRead } from "wagmi";
import { Abi } from "abitype";
import { cnsABI } from "../constants/cnsABI";
const abi = cnsABI as Abi;

export function useGetAddressPrimaryName(address: string) {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS ?? "";

  const { data, isLoading, isError, error, refetch } = useContractRead({
    abi: abi,
    address: contractAddress,
    functionName: "primaryName",
    args: [address],
  });

  return { data, isLoading, isError, error, refetch, contractAddress };
}
