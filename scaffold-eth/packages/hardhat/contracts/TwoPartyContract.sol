// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract TwoPartyContract {
  /******************************************
               DATA STRUCTURES
  ******************************************/

  mapping(address => bool) public owners; // Contract owners, all addresses initialize as false

  /* "multidimensional" mapping allows for one party to sign different contracts (even each contract multiple times but only once per block) with different people
     Can only sign one iteration of a specific contract between two parties once per block as we use block.number as nonce
     Originator/Initiator + Counterparty + IPFS Hash + Block Number Contract Proposed In = Contract Hash */
  mapping(address => 
    mapping(address => 
      mapping(string => 
        mapping(uint256 => bytes32)))) public contractHashes;
  
  // Keep an array of contractHashes related to each address
  mapping(address => bytes32[]) public relatedContracts;
  
  // Contract struct will hold all contract data
  struct Contract {
    string description;
    address initiator;
    string initiatorName;
    address counterparty;
    string counterpartyName;
    string ipfsHash;
    uint256 blockProposed;
    uint256 blockExecuted;
    bool executed;
    bytes initiatorSig;
    bytes counterpartySig;
    Fees paidFees;
  }

  // Store contract structs in mapping paired to contract hash
  mapping(bytes32 => Contract) public contracts;

  // Data structures used by fee mechanisms, also used to track fees paid for each contract
  struct Fees {
    uint256 createFee; // Create fee fee in USD ($1.00 = 1 * 10**18)
    uint256 signFee; // Signer fee in USD ($1.00 = 1 * 10**18)
    uint256 executeFee; // Executor fee in USD ($1.00 = 1 * 10**18)
  }
  Fees public fees;

  /******************************************
                    EVENTS
  ******************************************/

  // Log when new owners are added
  event OwnerAdded(address indexed owner);
  // Log when withdrawals happen
  event Withdrawal(address indexed withdrawer, uint256 withdrawal);

  // Log contract hash, initiator address, counterparty address, ipfsHash/Pointer string, and blockNumber agreement is in
  // counterparty is the only unindexed parameter because EVM only allows for three and I found counterparty to be the least relevant
  event ContractCreated(
    bytes32 contractHash,
    address initiator,
    address counterparty,
    string ipfsHash,
    uint256 blockNumber);
  // Log contract hashes on their own as all contrct details in ContractCreated can be obtianed by querying granular contract data mappings (contractParties, ...)
  event ContractHashed(bytes32 indexed contractHash);
  // Log contract signatures, contractHash used in verification, and the signer address to validate against
  event ContractSigned(bytes32 indexed contractHash, address indexed signer, bytes indexed signature);
  // Log contract execution using hash and the block it executed in
  event ContractExecuted(bytes32 indexed contractHash, address indexed executor, uint256 indexed blockNumber);
  
  // Log when any fee is paid
  event CreateFeePaid(bytes32 indexed contractHash, address indexed payer, uint256 fee);
  event SignFeePaid(bytes32 indexed contractHash, address indexed payer, uint256 fee);
  event ExecuteFeePaid(bytes32 indexed contractHash, address indexed payer, uint256 fee);
  // Log whenever any fee is changed
  event CreateFeeChanged(uint256 fee);
  event SignFeeChanged(uint256 fee);
  event ExecuteFeeChanged(uint256 fee);
  // Log whenever all fees are cleared
  event FeesCleared();

  /******************************************
                  CONSTRUCTOR
  ******************************************/

  // Set owners and fees at deployment
  constructor() {
    owners[payable(msg.sender)] = true;
    fees.createFee = 0;
    fees.signFee = 0;
    fees.executeFee = 0;
  }

  /******************************************
                   MODIFIERS
  ******************************************/

  // Require msg.sender to be an owner of contract to call modified function
  modifier onlyOwner() {
    require(owners[msg.sender], "Not a contract owner");
    _;
  }

  // Check for absence of contrash hash to make sure agreement hasn't been initialized
  modifier notCreated(address _counterparty, string memory _ipfsHash) {
    require(bytes32(contractHashes[msg.sender][_counterparty][_ipfsHash][block.number]) == 0, "Contract already initiated in this block");
    _;
  }

  // Require function call by contract initiator
  modifier onlyInitiator(bytes32 _contractHash) {
    require(contracts[_contractHash].initiator == msg.sender, "Not contract initiator");
    _;
  }

  // Require function call by counterparty, mainly for calling execute contract
  modifier onlyCounterparty(bytes32 _contractHash) {
    require(contracts[_contractHash].counterparty == msg.sender, "Not contract counterparty");
    _;
  }

  // Require caller is part of an initiated contract
  modifier validParty(bytes32 _contractHash) {
    require(contracts[_contractHash].initiator == msg.sender || contracts[_contractHash].counterparty == msg.sender, "Not a contract party");
    _;
  }

  // Require contract is not executed
  modifier notExecuted(bytes32 _contractHash) {
    require(!contracts[_contractHash].executed, "Contract already executed");
    _;
  }

  // Require contract execution has occured by all parties signing
  modifier hasExecuted(bytes32 _contractHash) {
    require(contracts[_contractHash].executed, "Contract hasnt executed");
    _;
  }

  /******************************************
             MANAGEMENT FUNCTIONS
  ******************************************/

  // Add additional owners to contract
  function addOwner(address _owner) public onlyOwner {
    owners[payable(_owner)] = true;
    emit OwnerAdded(_owner);
  }

  // Set create fee
  function setCreateFee(uint256 _fee) public onlyOwner {
    fees.createFee = _fee;
    emit CreateFeeChanged(_fee);
  }

  // Set sign fee
  function setSignFee(uint256 _fee) public onlyOwner {
    fees.signFee = _fee;
    emit SignFeeChanged(_fee);
  }

  // Set execute fee
  function setExecuteFee(uint256 _fee) public onlyOwner {
    fees.executeFee = _fee;
    emit ExecuteFeeChanged(_fee);
  }

  // Clear all fees at once
  function clearFees() public onlyOwner {
    fees.createFee = fees.signFee = fees.executeFee = 0;
    emit FeesCleared();
  }

  /******************************************
              INTERNAL FUNCTIONS
  ******************************************/

  // Use DEX liquidity to determine on-chain price of native token in USD to calculate fee in USD
  function getPrice() internal view {
    
  }

  // Hash of: Initiator Address + Counterparty Address + IPFS Hash + Block Number Agreement Proposed In
  function getMessageHash(address _initiator, address _counterparty, string memory _ipfsHash, uint256 _blockNum) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked(_initiator, _counterparty, _ipfsHash, _blockNum));
  }

  /* Hash all relevant contract data
     We prevent _counterparty from hashing because switching party address order will change hash 
     The contract hash is what each party needs to sign */
  function hashContract(address _counterparty, string memory _ipfsHash, uint256 _blockNum) internal returns (bytes32) {
    // Generate contract hash
    bytes32 contractHash = getMessageHash(msg.sender, _counterparty, _ipfsHash, _blockNum);

    // Save same contract hash for both parties. Relate hash to address in relatedContracts
    // Initiator must be only caller as changing the address order changes the hash
    contractHashes[msg.sender][_counterparty][_ipfsHash][_blockNum] = contractHash;
    relatedContracts[msg.sender].push(contractHash);
    contractHashes[_counterparty][msg.sender][_ipfsHash][_blockNum] = contractHash;
    relatedContracts[_counterparty].push(contractHash);

    emit ContractHashed(contractHash);
    return contractHash;
  }

  // Verify if signature was for messageHash and that the signer is valid, public because interface might want to use this
  function verifySignature(
    address _signer,
    bytes32 _contractHash,
    bytes memory _signature
  ) internal pure returns (bool) {
    bytes32 ethSignedMessageHash = ECDSA.toEthSignedMessageHash(_contractHash);
    return ECDSA.recover(ethSignedMessageHash, _signature) == _signer;
  }

  // Created to validate both parties have signed with validated signatures
  // Will need to be adapted if multi-party signing is ever implemented
  function verifyAllSignatures(bytes32 _contractHash) internal view returns (bool) {
    bool initiatorSigValid = verifySignature(contracts[_contractHash].initiator, _contractHash, contracts[_contractHash].initiatorSig);
    bool counterpartySigValid = verifySignature(contracts[_contractHash].counterparty, _contractHash, contracts[_contractHash].counterpartySig);
    return (initiatorSigValid == counterpartySigValid);
  }

  /******************************************
               PUBLIC FUNCTIONS
  ******************************************/

  // Instantiate two party contract, hash critical contract data, return block number of agreement proposal
  // notCreated() prevents duplicate calls from msg.sender or the counterparty by checking for existence of contract hash
  function createTwoPartyContract(
    string memory _description,
    string memory _signerName,
    address _counterparty,
    string memory _counterpartyName,
    string memory _ipfsHash
  ) public payable notCreated(_counterparty, _ipfsHash) returns (bytes32) {
    // Ensure any create fee is paid
    require(msg.value >= fees.createFee, "msg.value less than createFee");

    // Generate contract hash with msg.sender, counterparty address, ipfs hash, and block number confirmed in
    bytes32 contractHash = hashContract(_counterparty, _ipfsHash, block.number);

    // Begin populating Contract data struct
    // Set description
    contracts[contractHash].description = _description;
    // Save contract party addresses and names
    contracts[contractHash].initiator = msg.sender;
    contracts[contractHash].initiatorName = _signerName;
    contracts[contractHash].counterparty = _counterparty;
    contracts[contractHash].counterpartyName = _counterpartyName;
    // Save contract IPFS hash/pointer
    contracts[contractHash].ipfsHash = _ipfsHash;
    // Save block number agreement proposed in
    contracts[contractHash].blockProposed = block.number;

    emit ContractCreated(contractHash, msg.sender, _counterparty, _ipfsHash, block.number);
    if (fees.createFee > 0) {
      contracts[contractHash].paidFees.createFee = msg.value;
      emit CreateFeePaid(contractHash, msg.sender, msg.value);
    }
    return contractHash;
  }

  // Commit signature to blockchain storage after verifying it is correct and that msg.sender hasn't already called signContract()
  function signContract(bytes32 _contractHash, bytes memory _signature) public payable validParty(_contractHash) notExecuted(_contractHash) {
    // Ensure any signer fee is paid
    require(msg.value >= fees.signFee);
    // Confirm signature is valid
    require(verifySignature(msg.sender, _contractHash, _signature), "Signature not valid");

    // Save initiator signature
    if (contracts[_contractHash].initiator == msg.sender) {
      // Check if already signed
      require(keccak256(contracts[_contractHash].initiatorSig) != keccak256(_signature), "Already signed");
      // Save signature
      contracts[_contractHash].initiatorSig = _signature;
      emit ContractSigned(_contractHash, msg.sender, _signature);
      if (fees.signFee > 0) {
        contracts[_contractHash].paidFees.signFee = msg.value;
        emit SignFeePaid(_contractHash, msg.sender, msg.value);
      }

    // Save counterparty signature
    } else if (contracts[_contractHash].counterparty == msg.sender) {
      // Check if already signed
      require(keccak256(contracts[_contractHash].counterpartySig) != keccak256(_signature), "Already signed");
      // Save signature
      contracts[_contractHash].counterpartySig = _signature;
      emit ContractSigned(_contractHash, msg.sender, _signature);
      if (fees.signFee > 0) {
        contracts[_contractHash].paidFees.signFee = msg.value;
        emit SignFeePaid(_contractHash, msg.sender, msg.value);
      }

    // Shouldn't ever be hit but will leave anyways
    } else {
      revert("Not a contract party");
    }
  }

  // Execute contract if all have signed and any execute fee paid
  // Only allows contract parties to execute
  function executeContract(bytes32 _contractHash) public payable validParty(_contractHash) notExecuted(_contractHash) {
    // Ensure any execute fee is paid
    require(msg.value >= fees.executeFee);
    // Check if all signatures are received
    require(contracts[_contractHash].initiatorSig.length > 0 && contracts[_contractHash].counterpartySig.length > 0, "Signature(s) missing");
    // Double check all signatures are valid
    require(verifyAllSignatures(_contractHash));
    
    contracts[_contractHash].executed = true;
    contracts[_contractHash].blockExecuted = block.number;
    emit ContractExecuted(_contractHash, msg.sender, block.number);
    if (fees.executeFee > 0) {
      contracts[_contractHash].paidFees.executeFee = msg.value;
      emit ExecuteFeePaid(_contractHash, msg.sender, msg.value);
    }
  }

  /******************************************
               PAYMENT FUNCTIONS
  ******************************************/

  // Payment handling functions if we need them, otherwise just accept and allow withdrawal to any owner
  function withdraw() public onlyOwner {
    (bool success, ) = msg.sender.call{value: address(this).balance}("");
    require(success);
    emit Withdrawal(msg.sender, address(this).balance);
  }
  receive() external payable {}
  fallback() external payable {}
}