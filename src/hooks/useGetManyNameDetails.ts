import { useContractRead } from "wagmi";
import { Abi } from "abitype";
import { cnsABI } from "../constants/cnsABI";

const abi = cnsABI as Abi;

export function useGetManyNameDetails(address?: string) {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS ?? "";

  const { data, isLoading, refetch, error, isFetched } = useContractRead({
    abi: abi,
    address: contractAddress,
    functionName: "getAddressNameDetails",
    enabled: !!address,
    args: [address],
  });

  return { data, isLoading, refetch, error, isFetched };
}
