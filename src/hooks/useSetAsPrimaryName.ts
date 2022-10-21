import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { Abi } from "abitype";
import { cnsABI } from "../constants/cnsABI";
const abi = cnsABI as Abi;

export function useSetAsPrimaryName(name: string) {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS ?? "";

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "setPrimaryName",
    args: [name],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const waitForTransaction = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
  });

  return { data, isLoading, isSuccess, write, waitForTransaction };
}
