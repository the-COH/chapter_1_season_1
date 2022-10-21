import { useContractRead } from "wagmi";
import { Abi } from "abitype";
import { cnsABI } from "../constants/cnsABI";

const abi = cnsABI as Abi;

const GetNameOwnedByAddress = (props: { address: string; index: number }) => {
  const { address, index } = props;

  const { data } = useContractRead({
    abi,
    address: "0x5f6f7e8cc7346a11ca2def8f827b7a0b612c56a1",
    functionName: "addressToNames",
    args: [address, index],
  });

  return data;
};

export default GetNameOwnedByAddress;
