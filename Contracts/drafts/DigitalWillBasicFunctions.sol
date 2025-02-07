// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

//LIBRERIAS:

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract DigitalWill is ReentrancyGuard, Pausable {

//VARIABLES:
    
    address public owner;
    uint256 public lastRenewed; // Last time the testator confirmed being alive
    uint256 constant LOCK_PERIOD = 180 days; // 6 months lock period

    struct Beneficiary {
        address beneficiary;
        uint256 percentage;
    }

    Beneficiary[] public beneficiaries;
    mapping(address => bool) public isBeneficiary;

    struct ERC20Asset {
        address tokenAddress;
        uint256 amount;
    }

    struct ERC721Asset {
        address tokenAddress;
        uint256 tokenId;
    }

    struct ERC1155Asset {
        address tokenAddress;
        uint256 tokenId;
        uint256 amount;
    }

    ERC20Asset[] public erc20Assets;
    ERC721Asset[] public erc721Assets;
    ERC1155Asset[] public erc1155Assets;


/*    struct Will {
        bytes32 encryptedBeneficiaries; // ZK-encrypted beneficiary data
        uint256 lastHeartbeat;
        uint256 timelockPeriod;
        bool isActive;
        bytes32 zkProof;
    }
    
    mapping(address => Will) public wills;
*/


//EVENTOS:

    event WillCreated(address indexed creator);
    event LifeProofUpdated(address indexed creator, uint256 timestamp);
    event WillExecuted(address indexed creator);

//MODIFICADORES:

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier canClaim() {
        require(block.timestamp >= lastRenewed + LOCK_PERIOD, "Lock period not over");
        require(isBeneficiary[msg.sender], "Not a beneficiary");
        _;
    }

//CONSTRUCTOR:

    constructor() {
        owner = msg.sender;
        lastRenewed = block.timestamp;
    }




//FUNCIONES:

// Verify ZK proof (implement with your Noir circuit)
//function verifyProof(bytes32 _zkProof) internal pure returns (bool) {
    // Implement Noir proof verification
    //  return true;
}


function createWill (bytes32 _encryptedBeneficiaries, uint256 _timelockPeriod, bytes32 _zkProof) external nonReentrant payable {
    // Verify ZK proof
    //require(verifyProof(_zkProof), "Invalid ZK proof");
    wills[msg.sender] = Will({
        encryptedBeneficiaries: _encryptedBeneficiaries,
        lastHeartbeat: block.timestamp,
        timelockPeriod: _timelockPeriod,
        isActive: true,
        zkProof: _zkProof
        //Falta el % para cada beneficiario, 
        });
        
    emit WillCreated(msg.sender);

}

function listAssets () external {

}

function includeAsset () external {

}

function removeAsset () external {

}

function configLifeProof () external {

}

function setLifeProof () external {
    require(wills[msg.sender].isActive, "No active will");
    wills[msg.sender].lastHeartbeat = block.timestamp;
    emit LifeProofUpdated(msg.sender, block.timestamp);
}

function addBeneficiary () external {

}

function removeBeneficiary () external {

}

function setPercentages () external {

}

function acceptBeneficiary () external {
//Debe ser obligatorio que acepten, o configurable segun el que crea el testamento?


}

function initClaim () external {

}

function executeWill () external nonReentrant {
    Will storage will = wills[willCreator];
    require(will.isActive, "Will not active");
    require(block.timestamp >= will.lastHeartbeat + will.timelockPeriod, "Timelock not expired");

    // Execute asset transfer based on encrypted beneficiaries
    // This would integrate with your ZK circuit
    _executeTransfers(will.encryptedBeneficiaries);
        
    will.isActive = false;
    emit WillExecuted(willCreator);
}


}
