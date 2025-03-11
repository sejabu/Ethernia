// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./WillStorage.sol";

contract BeneficiaryManager is WillStorage {
    event BeneficiaryRegistered(address indexed creator, address indexed beneficiaryAddress, string benficiaryName);
    event BeneficiaryRevoked(address indexed testator, address indexed beneficiary, uint256 percentage);
    event PercentagesRedistributed(address indexed testator);

    function registerBeneficiary(address _beneficiaryAddress, string memory _name) external {
        Will storage will = getWill(msg.sender);
        require(bytes(will.beneficiariesNames[_beneficiaryAddress]).length == 0, "Wallet already registered");
        
        will.beneficiariesNames[_beneficiaryAddress] = _name;
        emit BeneficiaryRegistered(msg.sender, _beneficiaryAddress, _name);
    }

    function revokeBeneficiary(address _beneficiary) external {
        Will storage will = getWill(msg.sender);
        require(will.isActive, "No active will");
        require(will.beneficiaries[_beneficiary] > 0, "Not a beneficiary");

        uint256 removedPercentage = will.beneficiaries[_beneficiary];
        will.beneficiaries[_beneficiary] = 0;

        for (uint256 i = 0; i < will.beneficiaryList.length; i++) {
            if (will.beneficiaryList[i] == _beneficiary) {
                will.beneficiaryList[i] = will.beneficiaryList[will.beneficiaryList.length - 1];
                will.beneficiaryList.pop();
                break;
            }
        }

        emit BeneficiaryRevoked(msg.sender, _beneficiary, removedPercentage);
    }
}
