import { useState, useMemo } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { format, fromUnixTime } from "date-fns";
import { middleEllipsize } from "../../utils/ellipsize";
import SendTxButton from "../../components/SendTxButton";
import useDebounce from "../../hooks/useDebounce";
import { useSetAsPrimaryName } from "../../hooks/useSetAsPrimaryName";
import { useDelegateName } from "../../hooks/useDelegateName";
import LoadingIndicator from "../../components/LoadingIndicator";
import DelegateNameButton from "../../components/DelegateNameButton";
import { Modal } from "../../components/Modal";
import { BigNumberish, ethers } from "ethers";

//todo: refactor this mess. Pull out the modal at least!

interface cnsEntry {
  name: string;
  nameExpiry: string;
  owner: string;
  delegate: string;
  delegationExpiry: string;
}

type NameDetailsResult = [
  name: string,
  owner: string,
  delegate: string,
  nameExpiry: BigNumberish,
  delegationExpiry: BigNumberish
];

interface ShowRegisteredCNS {
  data: NameDetailsResult[];
  primaryName: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ShowRegisteredCNS: React.FC<any> = (props) => {
  //eslint-disable-line
  const columnHelper = createColumnHelper<cnsEntry>();
  const { primaryName, data } = props;
  const [newPrimaryName, setNewPrimaryName] = useState("");
  const { write, isLoading, waitForTransaction } =
    useSetAsPrimaryName(newPrimaryName);
  const [isOpen, setIsOpen] = useState(false);
  const [delegateName, setDelegateName] = useState("");
  const { isFetching } = waitForTransaction;

  function handleClickArrow(name: string) {
    setNewPrimaryName(name);
    if (!write) return;

    write();
  }

  function handleClickDelegate(name: string) {
    setDelegateName(name);
    setIsOpen(!isOpen);
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "name",
        minSize: 400,
        size: 222,
        maxSize: 422,

        cell: (info) => {
          return (
            <div className="flex justify-center">
              {info.getValue() === primaryName
                ? `* ${info.getValue()}`
                : info.getValue()}
            </div>
          );
        },
        footer: (info) => info.column.id,
      }),

      columnHelper.accessor("nameExpiry", {
        header: "name expiry",
        minSize: 275,
        size: 222,
        maxSize: 322,
        cell: (info) => {
          const formattedDate = format(
            fromUnixTime(Number(info.getValue()) ?? 0),
            "yyyy.MM.dd 'at' HH:mm"
          );

          const formattedTZ = format(
            fromUnixTime(Number(info.getValue()) ?? 0),
            "zzzz"
          );
          return (
            <span className="flex justify-center text-sm text-cantoGreen">
              {formattedDate}
              <br />
              {formattedTZ}
            </span>
          );
        },
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("delegate", {
        header: "delegate",
        minSize: 400,
        size: 222,
        maxSize: 422,
        cell: (info) => {
          if (
            info.row.original.delegate ==
            "0x0000000000000000000000000000000000000000"
          ) {
            return (
              <div className="m-1 flex items-center justify-center ">
                <span className=" text-sm text-cantoGreen">---</span>
                <DelegateNameButton
                  onClick={() => handleClickDelegate(info.row.original.name)}
                />
              </div>
            );
          } else {
            return (
              <span className="flex justify-center text-sm text-cantoGreen">
                {middleEllipsize(info.getValue())}
              </span>
            );
          }
        },
        footer: (info) => info.column.id,
      }),

      columnHelper.accessor("delegationExpiry", {
        header: "delegate expiry",
        cell: (info) => {
          if (
            info.row.original.delegate ==
            "0x0000000000000000000000000000000000000000"
          ) {
            return (
              <span className="flex justify-center text-sm text-cantoGreen">
                N/A
              </span>
            );
          }
          const formattedDate = format(
            fromUnixTime(Number(info.getValue()) ?? 0),
            "yyyy.MM.dd 'at' HH:mm (zzzz)"
          );

          return (
            <span className="flex justify-center text-sm text-cantoGreen">
              Expires {formattedDate}
            </span>
          );
        },
        footer: (info) => info.column.id,
      }),

      columnHelper.display({
        header: "",
        id: "setAsPrimary",
        cell: ({ row }) => {
          if (
            (isLoading || isFetching) &&
            row.original.name === newPrimaryName
          ) {
            return <LoadingIndicator />;
          }
          return (
            <SendTxButton onClick={() => handleClickArrow(row.original.name)} />
          );
        },
      }),
    ],
    [columnHelper, isFetching, isLoading, newPrimaryName, primaryName]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
  });

  if (!data) {
    return <h2>Error</h2>;
  }

  const inputClasses =
    "m-2 block w-full min-w-0 flex-1 rounded-none bg-gray-900 px-2 py-2 text-left align-middle text-white  placeholder-gray-500 focus:outline-none sm:text-sm";

  const DelegateInputs = (props: { name: string }) => {
    const { name } = props;

    const [delegateAddress, setDelegateAddress] = useState("");
    const [delegateDuration, setDelegateDuration] = useState(0);

    const formattedDelegateAddress = middleEllipsize(delegateAddress);

    const debouncedAddressToDelegateTo = useDebounce<string>(
      delegateAddress,
      500
    );
    const debouncedDaysToDelegateFor = useDebounce<number>(
      delegateDuration,
      500
    );

    // todo: add waiting for transaction
    const { write: delegateWrite } = useDelegateName(
      name,
      debouncedAddressToDelegateTo,
      debouncedDaysToDelegateFor
    );

    return (
      <div className="flex flex-col space-y-2">
        <h2>
          <span className="text-cantoGreenDarker">delegate</span> {name}
        </h2>
        {delegateAddress && (
          <div className="flex flex-col space-y-2">
            to: {formattedDelegateAddress}
          </div>
        )}
        {delegateDuration > 0 && delegateAddress && (
          <div className="flex flex-col space-y-2">
            for: {delegateDuration} days
          </div>
        )}
        <input
          type="text"
          className={inputClasses}
          placeholder={`delegate ${name} to:`}
          onChange={(e) => setDelegateAddress(e.target.value)}
        />
        {!ethers.utils.isAddress(delegateAddress) && delegateAddress != "" && (
          <span>Invalid Address</span>
        )}
        <input
          type="text"
          className={inputClasses}
          placeholder="delegate for (days)"
          onChange={(e) => setDelegateDuration(Number(e.target.value))}
        />

        {isNaN(delegateDuration) && <span>Invalid duration</span>}
        {delegateWrite && delegateDuration > 0 && (
          <DelegateNameButton
            onClick={() => {
              if (!delegateWrite) return;

              delegateWrite();
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} label="delegate">
        <DelegateInputs name={delegateName} />
      </Modal>
      <table className="w-full">
        <thead>
          {table.getHeaderGroups()?.map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers?.map((header) => (
                <th
                  key={header.id}
                  className="text-cantoGreen"
                  style={{
                    width:
                      header.getSize() !== 0 ? header.getSize() : undefined,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.map((row) => (
            <tr key={row.id} className="border-b-[1px] border-dashed">
              {/*
                using a temp fix for column sizing
                https://github.com/TanStack/table/discussions/4179 */}
              {row.getVisibleCells()?.map((cell) => (
                <td
                  key={cell.id}
                  className="py-4 text-cantoGreen"
                  style={{
                    width:
                      cell.column.getSize() !== 0
                        ? cell.column.getSize()
                        : undefined,
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowRegisteredCNS;
