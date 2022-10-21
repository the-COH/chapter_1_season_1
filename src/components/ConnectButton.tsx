import { Button } from "./Button";
import { useConnect, useDisconnect, useAccount } from "wagmi";
import { Modal } from "./Modal";
import { useState } from "react";
import { middleEllipsize } from "../utils/ellipsize";
import { useEffect } from "react";
import { useGetAddressPrimaryName } from "../hooks/useGetAddressPrimaryName";

const defaultClass =
  "border border-cantoGreenDark bg-black px-6 py-1 lowercase text-cantoGreenDark hover:bg-cantoGreen hover:text-black";

export function ConnectButton() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const [_userAddress, _setUserAddress] = useState("");
  const { address, isConnected } = useAccount();
  const [_isConnected, _setIsConnected] = useState(false);

  const { data: primaryNameData } = useGetAddressPrimaryName(_userAddress);

  const displayName = !primaryNameData
    ? middleEllipsize(_userAddress)
    : (primaryNameData as string);

  _userAddress;
  useEffect(() => {
    _setIsConnected(isConnected);
  }, [isConnected]);

  useEffect(() => {
    _setUserAddress(address?.toString() ?? "");
  }, [address]);

  const { disconnect } = useDisconnect();

  const [isOpen, setIsOpen] = useState(false);

  const IsConnected = () => {
    return (
      <div>
        <div className="my-2 flex  flex-col justify-center">
          <Button
            text={`disconnect ${displayName}`}
            important={true}
            disabled={false}
            type="button"
            onClick={() => disconnect()}
          />
        </div>
      </div>
    );
  };

  const Connectors = () => {
    return (
      <div className="flex flex-col space-y-2">
        {connectors.map((connector) => (
          <button
            className={defaultClass}
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {!connector.ready && " (unsupported)"}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              "(connecting)"}
          </button>
        ))}

        {error && <div>{error.message}</div>}
      </div>
    );
  };

  return (
    <div>
      <Button
        text={_isConnected ? displayName : "Connect Wallet"}
        type="button"
        disabled={isLoading}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        label={middleEllipsize(_userAddress)}
      >
        {_isConnected ? <IsConnected /> : <Connectors />}
      </Modal>
    </div>
  );
}
