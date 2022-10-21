import { useContractRead } from "wagmi";
import { Abi } from "abitype";
// import cnsABI from "../constants/cnsABI.json" assert { type: "json" };
import { cnsABI } from "../constants/cnsABI";
const abi = cnsABI as Abi;

export function useGetNameDetails(name: string) {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS ?? "";

  const { data, isLoading, isError, error, refetch, isFetched } =
    useContractRead({
      abi: abi,
      address: contractAddress,
      functionName: "names",
      args: [name],
    });

  return { data, isLoading, isError, error, refetch, isFetched };
}
