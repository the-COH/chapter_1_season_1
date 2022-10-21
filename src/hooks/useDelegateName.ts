import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { Abi } from "abitype";
import { cnsABI } from "../constants/cnsABI";
const abi = cnsABI as Abi;

export function useDelegateName(
  name: string,
  delegateAddress: string,
  daysToDelegate: number
) {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS ?? "";

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "delegateName",
    args: [name, delegateAddress, daysToDelegate],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const waitForTransaction = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
  });

  return { data, isLoading, isSuccess, write, waitForTransaction };
}
