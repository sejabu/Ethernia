// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@arcana/auth/contracts/IArcanaAuth.sol";
import "@arcana/storage/contracts/IArcanaStorage.sol";

contract DigitalWill is ReentrancyGuard, AccessControl {
    IArcanaAuth public arcanaAuth;
    IArcanaStorage public arcanaStorage;
    
    struct Beneficiary {
        bytes32 encryptedAddress;    // ZK-encrypted address
        uint256 percentage;          // Allocation percentage
        bool hasAccepted;           // Acceptance status
        bool hasInitiatedClaim;     // Claim status
        uint256 claimTimestamp;     // When they started their 6-month timelock
        string encryptedData;       // IPFS hash of encrypted beneficiary data
    }
    
    struct Will {
        mapping(bytes32 => Beneficiary) beneficiaries;
        bytes32[] beneficiaryList;
        string assetsData;          // IPFS hash of encrypted assets data
        uint256 lastHeartbeat;
        uint256 timelockPeriod;
        bool isActive;
        bytes32 did;               // Arcana DID for the user
    }
    
    mapping(address => Will) public wills;
    mapping(bytes32 => bool) public verifiedIdentities;
    
    uint256 constant SECONDARY_TIMELOCK = 180 days; // 6 months
    
    event WillCreated(address indexed creator, bytes32 indexed did);
    event WillModified(address indexed creator);
    event WillCancelled(address indexed creator);
    event BeneficiaryAccepted(bytes32 indexed beneficiaryHash);
    event ClaimInitiated(address indexed willCreator, bytes32 indexed beneficiaryHash);
    event AssetsClaimed(address indexed willCreator, bytes32 indexed beneficiaryHash);
    
    constructor(address _arcanaAuth, address _arcanaStorage) {
        arcanaAuth = IArcanaAuth(_arcanaAuth);
        arcanaStorage = IArcanaStorage(_arcanaStorage);
    }
    
    // Create or modify will using Arcana
    function setWill(
        bytes32[] calldata _encryptedBeneficiaries,
        uint256[] calldata _percentages,
        string calldata _assetsDataIPFS,
        uint256 _timelockPeriod,
        bytes32 _did
    ) external nonReentrant {
        require(_encryptedBeneficiaries.length == _percentages.length, "Invalid input");
        require(arcanaAuth.isAuthorized(msg.sender, _did), "Not authorized");
        
        Will storage will = wills[msg.sender];
        will.isActive = true;
        will.lastHeartbeat = block.timestamp;
        will.timelockPeriod = _timelockPeriod;
        will.did = _did;
        will.assetsData = _assetsDataIPFS;
        
        // Clear previous beneficiaries
        for(uint i = 0; i < will.beneficiaryList.length; i++) {
            delete will.beneficiaries[will.beneficiaryList[i]];
        }
        
        // Set new beneficiaries
        delete will.beneficiaryList;
        uint256 totalPercentage = 0;
        for(uint i = 0; i < _encryptedBeneficiaries.length; i++) {
            totalPercentage += _percentages[i];
            will.beneficiaries[_encryptedBeneficiaries[i]] = Beneficiary({
                encryptedAddress: _encryptedBeneficiaries[i],
                percentage: _percentages[i],
                hasAccepted: false,
                hasInitiatedClaim: false,
                claimTimestamp: 0,
                encryptedData: ""
            });
            will.beneficiaryList.push(_encryptedBeneficiaries[i]);
        }
        require(totalPercentage == 100, "Invalid percentages");
        
        emit WillCreated(msg.sender, _did);
    }
    
    // Accept beneficiary role with Arcana verification
    function acceptBeneficiaryRole(
        address willCreator,
        bytes32 _beneficiaryHash,
        bytes32 _did,
        string calldata _encryptedDataIPFS
    ) external {
        require(arcanaAuth.isAuthorized(msg.sender, _did), "Not authorized");
        
        Will storage will = wills[willCreator];
        require(will.beneficiaries[_beneficiaryHash].encryptedAddress != bytes32(0), "Not a beneficiary");
        
        Beneficiary storage beneficiary = will.beneficiaries[_beneficiaryHash];
        beneficiary.hasAccepted = true;
        beneficiary.encryptedData = _encryptedDataIPFS;
        verifiedIdentities[_beneficiaryHash] = true;
        
        emit BeneficiaryAccepted(_beneficiaryHash);
    }
    
    // Initiate claim process
    function initiateClaim(
        address willCreator,
        bytes32 _beneficiaryHash,
        bytes32 _did
    ) external {
        require(arcanaAuth.isAuthorized(msg.sender, _did), "Not authorized");
        
        Will storage will = wills[willCreator];
        require(will.isActive, "Will not active");
        require(
            block.timestamp >= will.lastHeartbeat + will.timelockPeriod,
            "First timelock not expired"
        );
        
        Beneficiary storage beneficiary = will.beneficiaries[_beneficiaryHash];
        require(beneficiary.hasAccepted, "Beneficiary not accepted");
        
        beneficiary.hasInitiatedClaim = true;
        beneficiary.claimTimestamp = block.timestamp;
        
        emit ClaimInitiated(willCreator, _beneficiaryHash);
    }
    
    // Execute claim using Arcana
    function executeClaim(
        address willCreator,
        bytes32 _beneficiaryHash,
        bytes32 _did
    ) external nonReentrant {
        require(arcanaAuth.isAuthorized(msg.sender, _did), "Not authorized");
        
        Will storage will = wills[willCreator];
        Beneficiary storage beneficiary = will.beneficiaries[_beneficiaryHash];
        
        require(beneficiary.hasInitiatedClaim, "Claim not initiated");
        require(
            block.timestamp >= beneficiary.claimTimestamp + SECONDARY_TIMELOCK,
            "Secondary timelock not expired"
        );
        
        // Grant access to assets through Arcana
        arcanaStorage.grantAccess(
            will.assetsData,
            msg.sender,
            beneficiary.percentage
        );
        
        emit AssetsClaimed(willCreator, _beneficiaryHash);
    }
}