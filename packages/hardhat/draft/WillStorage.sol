// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract WillStorage {
    struct Will {
        address testator;
        address claimer;
        uint256 lastRenewed;
        uint256 renewPeriod;
        uint256 claimTime;
        bool isActive;
        bool isClaimed;
        address[] beneficiaryList;
        address[] assetList;
        mapping(address => uint256) beneficiaries;
        mapping(address => string) beneficiariesNames;
        mapping(address => string) AssetsList;
    }

    mapping(address => Will) private wills;

    function getWill(address _testator) internal view returns (Will storage) {
        return wills[_testator];
    }

    function setWill(address _testator, Will storage _will) internal {
        wills[_testator] = _will;
    }
}