pragma solidity ^0.8.13;
//SPDX-License-Identifier: MIT

import { VRGDA } from "./VRGDA.sol";

error InvalidNameLength();

interface IVRGDAPricer {
  function getNamePrice(uint256 _startTime, uint256 _sold)
    external
    view
    returns (uint256);
}

contract CantoNameService {
  /******************************************
               DATA STRUCTURES
  ******************************************/

  struct NameDetails {
    address owner;
    address delegate;
    uint256 nameExpiry;
    uint256 delegationExpiry;
  }

  // only used when returning details for front end
  struct ViewNameDetails {
    string name;
    address owner;
    address delegate;
    uint256 nameExpiry;
    uint256 delegationExpiry;
  }

  // Contract owners, all addresses initialize as false
  mapping(address => bool) public owners;

  // Name registry
  mapping(string => NameDetails) public names;
  mapping(address => string[]) public addressToNames;
  
  // Each address' primary name
  mapping(address => string) public primaryName;

  // VRGDA initialization data struct
  struct VRDGAData {
    uint256 oneTimestamp;
    uint256 twoTimestamp;
    uint256 threeTimestamp;
    uint256 fourTimestamp;
    uint256 fiveTimestamp;
    uint256 longTimestamp;
    address onePricerAddress;
    address twoPricerAddress;
    address threePricerAddress;
    address fourPricerAddress;
    address fivePricerAddress;
    address longPricerAddress;
  }

  // Store VRGDA initialization data
  VRDGAData public vrgdaData;

  // Count of names sold
  uint256 public namesSold;

  // Fees data struct containing fees for different operations
  struct Fees {
    uint256 registration;
    uint256 delegation;
    uint256 transfer;
  }

  Fees public fees;

  /******************************************
                  CONSTRUCTOR
  ******************************************/

  constructor(
    address vrgdaOneAddress,
    address vrgdaTwoAddress,
    address vrgdaThreeAddress,
    address vrgdaFourAddress,
    address vrgdaFiveAddress,
    address vrgdaLongAddress
  ) {
    owners[msg.sender] = true;
    fees.registration = 0;
    fees.delegation = 0;
    fees.transfer = 0;

    uint256 currentTime = block.timestamp;

    vrgdaData.oneTimestamp = currentTime;
    vrgdaData.twoTimestamp = currentTime;
    vrgdaData.threeTimestamp = currentTime;
    vrgdaData.fourTimestamp = currentTime;
    vrgdaData.fiveTimestamp = currentTime;
    vrgdaData.longTimestamp = currentTime;

    // set VRGDA pricer addresses
    vrgdaData.onePricerAddress = vrgdaOneAddress;
    vrgdaData.twoPricerAddress = vrgdaTwoAddress;
    vrgdaData.threePricerAddress = vrgdaThreeAddress;
    vrgdaData.fourPricerAddress = vrgdaFourAddress;
    vrgdaData.fivePricerAddress = vrgdaFiveAddress;
    vrgdaData.longPricerAddress = vrgdaLongAddress;
  }

  /******************************************
          MODIFIERS & INTERNAL CHECKS
  ******************************************/

  ///// CONTRACT OWNERSHIP /////

  // Require msg.sender to be an owner of contract to call modified function
  modifier onlyOwner() {
    require(owners[msg.sender], "Denied: Not a contract owner");
    _;
  }

  ///// PRIMARY NAME /////

  // returns the address for a given name. Returns '0x0' if the name does not have a valid owner
  function nameOwner(string memory _name) public view returns (address) {
    address owner = names[_name].owner;
    if (owner != address(0) && isNameExpired(_name) == false) {
      return owner;
    } else {
      return address(0);
    }
  }

  // returns true if name is actively delegated
  function isNameDelegated(string memory _name) public view returns (bool) {
    return
      names[_name].delegate != address(0) &&
      names[_name].delegationExpiry > block.timestamp;
  }

  // returns the address of the current rights holder for a given name
  function nameRightsHolder(string memory _name) public view returns (address) {
    if (isNameDelegated(_name)) {
      return names[_name].delegate;
    } else if (isNameExpired(_name)) {
      return address(0);
    } else {
      return names[_name].owner;
    }
  }

  // returns the primary name of a given adddress. returns "" if there is no primary name registered
  function addressPrimaryName(address _address)
    public
    view
    returns (string memory)
  {
    // return recorded primary name
    string memory _primaryName = primaryName[_address];

    // ensure the address retains rights to the primary name
    return (nameRightsHolder(_primaryName) == _address ? _primaryName : "");
  }

  // Check if name is _address' primary
  function isAddressPrimaryName(string memory _name, address _address)
    internal
    view
    returns (bool)
  {
    return areStringsEqual(_name, addressPrimaryName(_address));
  }

  ///// NAME OWNERSHIP /////

  modifier isNameOwner(string memory _name, address _address) {
    require(nameOwner(_name) == _address, "Denied: Not name owner");
    _;
  }

  ///// NAME DELEGATION /////

  // Check if delegation time does not exceed ownership time
  function checkIfDelegationTimeAllowed(
    string memory _name,
    uint256 _requestedDelegationExpiryEpoch
  ) internal view returns (bool) {
    return (names[_name].nameExpiry > _requestedDelegationExpiryEpoch);
  }

  // Check if name is delegated
  function checkIfDelegated(string memory _name) public view returns (bool) {
    return names[_name].delegationExpiry > block.timestamp;
  }

  modifier isNotDelegated(string memory _name) {
    require(!checkIfDelegated(_name), "Denied: Name is delegated");
    _;
  }

  ///// EXPIRY /////

  // checks if a name is expired
  function isNameExpired(string memory _name) public view returns (bool) {
    return names[_name].nameExpiry < block.timestamp;
  }

  modifier isExpired(string memory _name) {
    require(isNameExpired(_name), "Denied: Name rights have not expired");
    _;
  }

  ///// NAME RIGHTS /////

  // Confirm msg.sender has rights and has not delegated them
  modifier rightsHolder(string memory _name, address _address) {
    require(nameRightsHolder(_name) == _address, "Denied: Not rights holder");
    _;
  }

  /******************************************
                VRGDA FUNCTIONS
  ******************************************/

  // returns the current price for a name
  function priceName(string calldata name) public view returns (uint256) {
    uint256 _nameLength = stringLength(name);

    if (_nameLength > 5) {
      return
        IVRGDAPricer(vrgdaData.longPricerAddress).getNamePrice(
          vrgdaData.oneTimestamp,
          namesSold
        );
    } else if (_nameLength == 5) {
      return
        IVRGDAPricer(vrgdaData.fivePricerAddress).getNamePrice(
          vrgdaData.oneTimestamp,
          namesSold
        );
    } else if (_nameLength == 4) {
      return
        IVRGDAPricer(vrgdaData.fourPricerAddress).getNamePrice(
          vrgdaData.oneTimestamp,
          namesSold
        );
    } else if (_nameLength == 3) {
      return
        IVRGDAPricer(vrgdaData.threePricerAddress).getNamePrice(
          vrgdaData.oneTimestamp,
          namesSold
        );
    } else if (_nameLength == 2) {
      return
        IVRGDAPricer(vrgdaData.twoPricerAddress).getNamePrice(
          vrgdaData.oneTimestamp,
          namesSold
        );
    } else if (_nameLength == 1) {
      return
        IVRGDAPricer(vrgdaData.onePricerAddress).getNamePrice(
          vrgdaData.oneTimestamp,
          namesSold
        );
    } else {
      revert InvalidNameLength();
    }
  }

  /******************************************
               PUBLIC FUNCTIONS
  ******************************************/

  ///// PRIMARY NAME /////

  modifier notPrimary(string memory _name) {
    require(
      !isAddressPrimaryName(_name, msg.sender),
      "Denied: Name is already primary"
    );
    _;
  }

  ///// REGISTRATION /////

  // Register name only if unregistered or expired
  function registerName(string calldata _name, uint256 _term)
    public
    payable
    isExpired(_name)
    rightsHolder(_name, address(0))
  {
    // Require name string length to be a minimum of 1 character
    require(
      stringLength(_name) > 0,
      "Denied: Name doesn't contain any characters"
    );
    // Calculate name price based off string length
    uint256 price = priceName(_name);

    // Require payment for at least price * _term in years
    uint256 totalCost = (price * _term) + fees.registration;

    require(
      msg.value >= totalCost,
      "Denied: msg.value doesnt cover term cost and registration fee"
    );

    // Register name to msg.sender
    names[_name].owner = msg.sender;
    names[_name].nameExpiry = block.timestamp + (_term * 365 days);
    names[_name].delegate = address(0);
    names[_name].delegationExpiry = 0;

    addNameToAddress(_name, msg.sender);

    emit NameRegistered(_name, msg.sender, names[_name].nameExpiry, totalCost);

    // Log any overpayment as tip
    if (msg.value > totalCost) {
      emit TipPaid(_name, msg.sender, "registerName", msg.value - totalCost);
    }

    // Increment namesSold
    namesSold++;
  }

  // Set name as primary
  function setPrimaryName(string calldata _name)
    public
    isNameOwner(_name, msg.sender)
    notPrimary(_name)
    rightsHolder(_name, msg.sender)
  {
    primaryName[msg.sender] = _name;
    emit PrimarySet(_name, msg.sender);
  }

  ///// DELEGATION /////

  // Delegate name functions (except ownership) to another address
  // ONLY CALLABLE BY name owner, and can only delegate if not already delegated
  function delegateName(
    string memory _name,
    address _delegate,
    uint256 _days
  ) public payable isNameOwner(_name, msg.sender) isNotDelegated(_name) {
    require(_delegate != msg.sender, "Denied: Cannot delegate to self");
    require(_days > 0, "Denied: Delegation must be for at least 1 day");

    uint256 expiryDate = block.timestamp + (_days * 86400);

    require(
      checkIfDelegationTimeAllowed(_name, expiryDate),
      "Denied: Delegation time exceeds ownership time"
    );

    // Require any delegation fee be paid
    require(msg.value >= fees.delegation, "Denied: Delegation fee not paid");

    // remove as primary name if the _name is the sender's primary name
    if (areStringsEqual(_name, primaryName[msg.sender])) {
      primaryName[msg.sender] = "";
    }

    // Set delegate address and expiry
    names[_name].delegate = _delegate;
    names[_name].delegationExpiry = expiryDate;

    emit NameDelegated(_name, _delegate, names[_name].delegationExpiry, 0);
  }

  ///// TRANSFER /////

  // Transfer name
  function transferName(string memory _name, address _recipient)
    public
    payable
    isNameOwner(_name, msg.sender)
    isNotDelegated(_name)
  {
    // Require any transfer fee be paid
    require(msg.value >= fees.transfer, "Denied: Transfer fee not paid");

    // remove as primary name if the _name is the sender's primary name
    if (areStringsEqual(_name, primaryName[msg.sender])) {
      primaryName[msg.sender] = "";
    }

    removeNameFromAddress(_name, msg.sender);

    addNameToAddress(_name, _recipient);

    // Apply _recipient as new owner and announce
    names[_name].owner = _recipient;

    emit NameTransferred(_name, _recipient, 0);
  }

  /// @dev should only be used from front ends as this will be very expensive
  function getAddressNameDetails(address _address)
    public
    view
    returns (ViewNameDetails[] memory)
  {
    uint256 arrayLength = addressToNames[_address].length;

    ViewNameDetails[] memory newNameDetails = new ViewNameDetails[](
      arrayLength
    );

    for (uint256 i = 0; i < arrayLength; ++i) {
      string memory _name = addressToNames[_address][i];

      newNameDetails[i].name = _name;
      newNameDetails[i].owner = names[_name].owner;
      newNameDetails[i].delegate = names[_name].delegate;
      newNameDetails[i].nameExpiry = names[_name].nameExpiry;
      newNameDetails[i].delegationExpiry = names[_name].delegationExpiry;
    }
    return newNameDetails;
  }

  /******************************************
             MANAGEMENT FUNCTIONS
  ******************************************/

  // Add additional owners to contract
  function addOwner(address _owner) public onlyOwner {
    owners[payable(_owner)] = true;

    emit OwnerAdded(_owner);
  }

  // update fees
  function updateFees(
    uint256 _registrationFee,
    uint256 _delegationFee,
    uint256 transferFee
  ) public onlyOwner {
    fees.registration = _registrationFee;
    fees.delegation = _delegationFee;
    fees.transfer = transferFee;

    emit FeesUpdated(_registrationFee, _delegationFee, transferFee);
  }

  /******************************************
              INTERNAL FUNCTIONS
  ******************************************/

  // compare two strings and return if they are equal
  function areStringsEqual(string memory _a, string memory _b)
    internal
    pure
    returns (bool)
  {
    return (keccak256(abi.encodePacked(_a)) == keccak256(abi.encodePacked(_b)));
  }

  // remove Name from addressToNames. Used when transferring a name
  function removeNameFromAddress(string memory _name, address _address)
    internal
  {
    bytes32 nameHash = keccak256(abi.encode(_name));
    uint256 nameIndex;

    // find the index of the target name
    for (uint256 i = 0; i < addressToNames[_address].length; ++i) {
      if (nameHash == keccak256(abi.encode(addressToNames[_address][i]))) {
        nameIndex = i;
        break;
      }
    }
    // move the target name to the end of the array
    addressToNames[_address][nameIndex] = addressToNames[_address][
      addressToNames[_address].length - 1
    ];
    // remove the last element of the array
    addressToNames[_address].pop();
  }

  // add Name to addressToNames. Used when registering a name
  function addNameToAddress(string memory _name, address _address) internal {
    addressToNames[_address].push(_name);
  }

  // Return string length, properly counts all Unicode characters
  function stringLength(string memory _string) internal pure returns (uint256) {
    uint256 charCount; // Number of characters in _string regardless of char byte length
    uint256 charByteCount = 0; // Number of bytes in char a = 1, € = 3
    uint256 byteLength = bytes(_string).length; // Total length of string in raw bytes

    // Determine how many bytes each character in string has
    for (charCount = 0; charByteCount < byteLength; charCount++) {
      bytes1 b = bytes(_string)[charByteCount]; // if tree uses first byte to determine length
      if (b < 0x80) {
        charByteCount += 1;
      } else if (b < 0xE0) {
        charByteCount += 2;
      } else if (b < 0xF0) {
        charByteCount += 3;
      } else if (b < 0xF8) {
        charByteCount += 4;
      } else if (b < 0xFC) {
        charByteCount += 5;
      } else {
        charByteCount += 6;
      }
    }
    return charCount;
  }

  /******************************************
                    EVENTS
  ******************************************/

  // Log when new owners are added
  event OwnerAdded(address owner);

  // Log when payable function is overpaid
  event TipPaid(string name, address tipper, string functionCall, uint256 tip);

  // Log when withdrawals happen
  event Withdrawal(address withdrawer, uint256 withdrawal);

  // Log when name is registered
  event NameRegistered(
    string name,
    address owner,
    uint256 term,
    uint256 feePaid
  );

  // Log when name is delegated
  event NameDelegated(
    string name,
    address delegate,
    uint256 term,
    uint256 feePaid
  );

  event FeesUpdated(
    uint256 registrationFee,
    uint256 delegationFee,
    uint256 transferFee
  );

  // Log when name is transferred
  event NameTransferred(string name, address recipient, uint256 feePaid);

  // Log when primary name is set
  event PrimarySet(string name, address targetAddress);

  /******************************************
               PAYMENT FUNCTIONS
  ******************************************/

  // Payment handling functions if we need them, otherwise just accept and allow withdrawal to any owner
  function withdraw() public onlyOwner {
    (bool success, ) = msg.sender.call{ value: address(this).balance }("");
    require(success);
    emit Withdrawal(msg.sender, address(this).balance);
  }

  receive() external payable {}

  fallback() external payable {}
}
