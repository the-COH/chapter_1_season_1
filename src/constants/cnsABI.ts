export const cnsABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "vrgdaOneAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "vrgdaTwoAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "vrgdaThreeAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "vrgdaFourAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "vrgdaFiveAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "vrgdaLongAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidNameLength",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "registrationFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "delegationFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "transferFee",
        type: "uint256",
      },
    ],
    name: "FeesUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "delegate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "term",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feePaid",
        type: "uint256",
      },
    ],
    name: "NameDelegated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "term",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feePaid",
        type: "uint256",
      },
    ],
    name: "NameRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feePaid",
        type: "uint256",
      },
    ],
    name: "NameTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "NameUndelegated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnerAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "targetAddress",
        type: "address",
      },
    ],
    name: "PrimarySet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tipper",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "functionCall",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tip",
        type: "uint256",
      },
    ],
    name: "TipPaid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "withdrawer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "withdrawal",
        type: "uint256",
      },
    ],
    name: "Withdrawal",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "addOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "addressPrimaryName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "addressToNames",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "checkIfDelegated",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "address",
        name: "_delegate",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_days",
        type: "uint256",
      },
    ],
    name: "delegateName",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "fees",
    outputs: [
      {
        internalType: "uint256",
        name: "registration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "delegation",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "transfer",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "getAddressNameCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "getAddressNameDetails",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "delegate",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nameExpiry",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "delegationExpiry",
            type: "uint256",
          },
        ],
        internalType: "struct CantoNameServiceContract.ViewNameDetails[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "isNameDelegated",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "isNameExpired",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "nameOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "nameRightsHolder",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "names",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "delegate",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nameExpiry",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "delegationExpiry",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "namesSold",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "owners",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "priceName",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "primaryName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_term",
        type: "uint256",
      },
    ],
    name: "registerName",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "setPrimaryName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "transferName",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_registrationFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_delegationFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "transferFee",
        type: "uint256",
      },
    ],
    name: "updateFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "vrgdaData",
    outputs: [
      {
        internalType: "uint256",
        name: "oneTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "twoTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "threeTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fourTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fiveTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "longTimestamp",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onePricerAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "twoPricerAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "threePricerAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "fourPricerAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "fivePricerAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "longPricerAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];
