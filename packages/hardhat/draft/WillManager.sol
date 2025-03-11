// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "./IWillManager.sol";
import "./BeneficiaryManager.sol";
import "./AssetManager.sol";
import "./WillStorage.sol";


contract WillManager is IWillManager, BeneficiaryManager, AssetManager, ReentrancyGuard, Pausable {
    uint256 constant LOCK_PERIOD = 180 days;
    uint256 constant ALERT_PERIOD = 30 days;
    
    address public owner;

    event WillCreated(address indexed creator);
    event LifeProofRenewed(address indexed creator, uint256 timestamp);
    event ClaimExecuted(address indexed testator, address indexed claimer, uint256 timestamp);
    event WillExecuted(address indexed creator, uint256 timestamp);
    event WillDeactivated(address indexed creator, uint256 timestamp);
    event WillModified(address indexed testator, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyTestator() {
        Will storage will = getWill(msg.sender);
        require(will.isActive, "No active will");
        require(will.testator == msg.sender, "Not the testator");
        _;
    }

    // Implement IWillManager functions here...
    // (Previous implementation logic remains the same but uses the new storage pattern)

    function validatePercentages(uint256[] memory _percentages) internal pure returns (bool) {
        uint256 total = 0;
        for (uint256 i = 0; i < _percentages.length; i++) {
            total += _percentages[i];
        }
        return total == 100;
    }

    function withdraw(uint256 _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Insufficient balance");
        payable(owner).transfer(_amount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}