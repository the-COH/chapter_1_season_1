pragma solidity >=0.8.7 <0.9.0;
//SPDX-License-Identifier: MIT

// VRGDA imports
import { toDaysWadUnsafe } from "@solmate/utils/SignedWadMath.sol";
import { LinearVRGDA } from "./LinearVRGDA.sol";

contract VRGDAPricer is LinearVRGDA {
  uint256 public startTime;
  address owner;

  constructor(
    int256 _targetPrice,
    int256 _priceDecayPercent,
    int256 _perTimeUnit
  ) LinearVRGDA(_targetPrice, _priceDecayPercent, _perTimeUnit) {
    owner = msg.sender;
    startTime = block.timestamp;
  }

  // Require msg.sender to be an owner of contract to call modified function
  // todo: allow multiple owners
  modifier onlyOwner() {
    require(owner == msg.sender, "Denied: Not a contract owner");
    _;
  }

  function getNamePrice(uint256 _startTime, uint256 _sold)
    public
    view
    returns (uint256)
  {
    return getVRGDAPrice(toDaysWadUnsafe(block.timestamp - _startTime), _sold);
  }

  function setStartTime(uint256 _startTime) public onlyOwner {
    startTime = _startTime;
  }

  function setOwner(address _owner) public onlyOwner {
    owner = _owner;
  }
}
