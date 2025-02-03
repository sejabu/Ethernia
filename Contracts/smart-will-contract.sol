// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface ISmartWallet {
    function approveTransfer(address token, address to, uint256 amount) external;
    function revokeTransfer(address token, address to) external;
}

interface ICrossChainBridge {
    function bridgeAsset(address token, uint256 chainId, address recipient, uint256 amount) external;
}

contract DigitalWill is ReentrancyGuard, AccessControl {
    struct Asset {
        address token;
        uint256 chainId;
        uint256 amount;
    }
    
    struct Beneficiary {
        bytes32 encryptedAddress;    // ZK-encrypted address
        uint256 percentage;          // Allocation percentage
        bool hasAccepted;           // Acceptance status
        bool hasInitiatedClaim;     // Claim status
        uint256 claimTimestamp;     // When they started their 6-month timelock
    }
    
    struct Will {
        mapping(bytes32 => Beneficiary) beneficiaries;
        bytes32[] beneficiaryList;
        Asset[] assets;
        uint256 lastHeartbeat;
        uint256 timelockPeriod;
        bool isActive;
        address smartWallet;
    }
    
    mapping(address => Will) public wills;
    mapping(bytes32 => bool) public verifiedIdentities;
    
    uint256 constant SECONDARY_TIMELOCK = 180 days; // 6 months
    
    event WillCreated(address indexed creator);
    event WillModified(address indexed creator);
    event WillCancelled(address indexed creator);
    event BeneficiaryAccepted(bytes32 indexed beneficiaryHash);
    event ClaimInitiated(address indexed willCreator, bytes32 indexed beneficiaryHash);
    event AssetsClaimed(address indexed willCreator, bytes32 indexed beneficiaryHash);
    
    modifier onlyWillOwner() {
        require(wills[msg.sender].isActive, "No active will");
        _;
    }
    
    // Create or modify will
    function setWill(
        bytes32[] calldata _encryptedBeneficiaries,
        uint256[] calldata _percentages,
        Asset[] calldata _assets,
        uint256 _timelockPeriod,
        address _smartWallet
    ) external nonReentrant {
        require(_encryptedBeneficiaries.length == _percentages.length, "Invalid input");
        
        Will storage will = wills[msg.sender];
        will.isActive = true;
        will.lastHeartbeat = block.timestamp;
        will.timelockPeriod = _timelockPeriod;
        will.smartWallet = _smartWallet;
        
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
                claimTimestamp: 0
            });
            will.beneficiaryList.push(_encryptedBeneficiaries[i]);
        }
        require(totalPercentage == 100, "Invalid percentages");
        
        // Update assets
        delete will.assets;
        for(uint i = 0; i < _assets.length; i++) {
            will.assets.push(_assets[i]);
        }
        
        emit WillModified(msg.sender);
    }
    
    // Cancel will
    function cancelWill() external onlyWillOwner {
        delete wills[msg.sender];
        emit WillCancelled(msg.sender);
    }
    
    // Beneficiary accepts inclusion and verifies identity
    function acceptBeneficiaryRole(
        bytes32 _beneficiaryHash,
        bytes calldata _identityProof
    ) external {
        require(verifyIdentityProof(_identityProof), "Invalid identity proof");
        Will storage will = wills[msg.sender];
        require(will.beneficiaries[_beneficiaryHash].encryptedAddress != bytes32(0), "Not a beneficiary");
        
        will.beneficiaries[_beneficiaryHash].hasAccepted = true;
        verifiedIdentities[_beneficiaryHash] = true;
        
        emit BeneficiaryAccepted(_beneficiaryHash);
    }
    
    // Beneficiary initiates claim after first timelock
    function initiateClaim(address willCreator, bytes32 _beneficiaryHash) external {
        Will storage will = wills[willCreator];
        require(will.isActive, "Will not active");
        require(
            block.timestamp >= will.lastHeartbeat + will.timelockPeriod,
            "First timelock not expired"
        );
        require(
            will.beneficiaries[_beneficiaryHash].hasAccepted,
            "Beneficiary not accepted"
        );
        
        will.beneficiaries[_beneficiaryHash].hasInitiatedClaim = true;
        will.beneficiaries[_beneficiaryHash].claimTimestamp = block.timestamp;
        
        // Notify all beneficiaries
        emit ClaimInitiated(willCreator, _beneficiaryHash);
    }
    
    // Claim assets after secondary timelock
    function claimAssets(
        address willCreator,
        bytes32 _beneficiaryHash
    ) external nonReentrant {
        Will storage will = wills[willCreator];
        Beneficiary storage beneficiary = will.beneficiaries[_beneficiaryHash];
        
        require(beneficiary.hasInitiatedClaim, "Claim not initiated");
        require(
            block.timestamp >= beneficiary.claimTimestamp + SECONDARY_TIMELOCK,
            "Secondary timelock not expired"
        );
        
        ISmartWallet wallet = ISmartWallet(will.smartWallet);
        ICrossChainBridge bridge = ICrossChainBridge(address(0)); // Add your bridge address
        
        // Process transfers for each asset
        for(uint i = 0; i < will.assets.length; i++) {
            Asset memory asset = will.assets[i];
            uint256 beneficiaryAmount = (asset.amount * beneficiary.percentage) / 100;
            
            if(asset.chainId == block.chainid) {
                // Same chain transfer
                wallet.approveTransfer(asset.token, msg.sender, beneficiaryAmount);
            } else {
                // Cross-chain transfer
                bridge.bridgeAsset(asset.token, asset.chainId, msg.sender, beneficiaryAmount);
            }
        }
        
        emit AssetsClaimed(willCreator, _beneficiaryHash);
    }
    
    // Verify ZK identity proof
    function verifyIdentityProof(bytes calldata _proof) internal pure returns (bool) {
        // Implement with your Noir circuit
        return true;
    }
}
