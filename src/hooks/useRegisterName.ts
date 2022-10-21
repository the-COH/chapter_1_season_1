import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { Abi } from "abitype";
import { cnsABI } from "../constants/cnsABI";
import { useGetNamePrice } from "./useGetNamePrice";
import { BigNumber, BigNumberish } from "ethers";
const abi = cnsABI as Abi;

export function useRegisterName(name: string, yearsToRegister: number) {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS ?? "";
  const { data: price } = useGetNamePrice(name);
  const validPrice = price ?? 0;

  const adjustedPrice = BigNumber.from(validPrice).mul(yearsToRegister || 0);

  const overrides = {
    value: adjustedPrice,
  };

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "registerName",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    overrides: overrides, // eslint-disable-line
    args: [name, yearsToRegister],
  });

  const calculatedGasLimit = config?.request?.gasLimit
    ? BigNumber.from(Math.round(config?.request?.gasLimit?.toNumber() * 1.2))
    : BigNumber.from(0);

  const newOverrides = {
    value: adjustedPrice,
    gasLimit: calculatedGasLimit,
  };

  const { config: newConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "registerName",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    overrides: newOverrides, // eslint-disable-line
    args: [name, yearsToRegister],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(newConfig);

  const waitForTransaction = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
  });

  return { data, isLoading, isSuccess, write, waitForTransaction };
}
