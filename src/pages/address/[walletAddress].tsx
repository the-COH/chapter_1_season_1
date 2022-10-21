import React, { Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ShowRegisteredCNS from "./ShowRegisteredCNS";
import ShowPrimaryCNS from "./ShowPrimaryCNS";
import { Layout } from "../../components/layout";
import { middleEllipsize } from "../../utils/ellipsize";
import { useGetManyNameDetails } from "../../hooks/useGetManyNameDetails";
import { useGetAddressPrimaryName } from "../../hooks/useGetAddressPrimaryName";
import { BigNumberish } from "ethers";

export default function WalletAddress() {
  const router = useRouter();
  const walletAddress = router.query.walletAddress as string;

  const { data } = useGetAddressPrimaryName(walletAddress);

  const primaryName = data ?? "not set";

  const nameDetails = useGetManyNameDetails(walletAddress);

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

  const primaryNameObject = {
    primaryName: primaryName,
  };

  const registeredCNSObject = {
    data: parsedNameDetails,
    primaryName: primaryName,
  };

  return (
    <>
      <Layout>
        <main className="m-4 p-4">
          <div className="py-4">
            <h1 className="text-2xl font-semibold text-cantoGreen">
              {middleEllipsize(walletAddress)}
            </h1>
            <Link
              href={`https://evm.explorer.canto.io/address/${walletAddress} `}
            >
              <a target="_blank">View on canto explorer</a>
            </Link>
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="py-4">
              <ShowPrimaryCNS {...primaryNameObject} />
            </div>
          </div>
          <ShowRegisteredCNS {...registeredCNSObject} />
        </main>
      </Layout>
    </>
  );
}
