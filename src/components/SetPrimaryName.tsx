import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useGetManyNameDetails } from "../hooks/useGetManyNameDetails";
import { BigNumberish } from "ethers";

const SetPrimaryName = () => {
  const { address } = useAccount();
  const [_address, _setAddress] = useState("");

  useEffect(() => {
    _setAddress(address ?? "");
  }, [address]);

  const nameDetails = useGetManyNameDetails(_address);

  type NameDetailsResult = [
    name: string,
    owner: string,
    delegate: string,
    nameExpiry: BigNumberish,
    delegationExpiry: BigNumberish
  ];

  const nameData = nameDetails.data as NameDetailsResult[];

  const parsedNameDetails = nameData?.map((name) => {
    return {
      name: name[0],
      owner: name[1],
      delegate: name[2],
      nameExpiry: name[3],
      delegationExpiry: name[4],
    };
  });

  return (
    <>
      {parsedNameDetails?.map((name) => (
        <>
          <p key={name.owner}>Owner: {name.owner}</p>
          <p key={name.delegate}>Delegate: {name.delegate}</p>
          <p key={name.nameExpiry.toString()}>
            Expiry: {name.nameExpiry.toString()}
          </p>
        </>
      ))}
    </>
  );
};

export default SetPrimaryName;
