// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title EtherniaV0001 Enhanced
 * @author @elgallodev
 * @notice Digital will management system for ERC20 assets
 * 
 * This contract allows users to:
 * - Register as users
 * - Create digital wills
 * - Add beneficiaries with percentage allocations
 * - Add ERC20 tokens to be distributed
 * - Provide proof of life to prevent premature execution
 * - Claim and execute wills after specific periods
 * 
 * Future improvements:
 * - Add Multi Will Support
 * - Add NFT support 
 * - Add automatic tokens discovery
 * - Add ZK Privacy Methods
 * - Add Arcana-SDK 
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Ethernia is ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    struct UserInfo {
        address wallet;
        uint256 lastLifeProof;
        bool isTestator;
    }

    struct Erc20Data {
        address tokenAddress;
        string tokenName;
        uint256 tokenBalance;
    }

    struct Beneficiaries {
        address beneficiary;
        uint256 percentage;
    }

    struct WillData {
        string name;
        uint256 creationTime;
        uint256 renewPeriod;
        uint256 claimTime;
        uint256 executionTime;
        bool isActive;
        bool isClaimed;
        bool isExecuted;
        address claimer;
        address executor;
        Beneficiaries[] beneficiaryList;
        Erc20Data[] erc20Tokens;
    }

    // Storage
    mapping(address => UserInfo) public userInfo;
    mapping(address => WillData) public willData;
    
    // Constants and configuration    
    uint256 public claimPeriod = 3 minutes; // Set to minutes for testing, days for production
    uint256 public executionFee = 2; // 2% fee
    address public owner;
    
    // Events
    event UserRegistered(address indexed user, uint256 timestamp);
    event TestatorCreated(address indexed testator, string name, uint256 renewPeriod);
    event LifeProofRenewed(address indexed testator, uint256 timestamp);
    event BeneficiaryAdded(address indexed testator, address indexed beneficiary, uint256 percentage);
    event BeneficiaryRemoved(address indexed testator, address indexed beneficiary);
    event ERC20AssetAdded(address indexed testator, address indexed tokenAddress, string tokenName);
    event WillClaimed(address indexed testator, address indexed claimer, uint256 timestamp);
    event WillExecuted(address indexed testator, address indexed executor, uint256 timestamp);
    event WillDeactivated(address indexed testator, uint256 timestamp);
    event TokenTransferred(address indexed from, address indexed to, address indexed tokenAddress, uint256 amount);
    
    // Modifiers
    modifier onlyUser() {
        require(userInfo[msg.sender].wallet != address(0), "Not registered");
        _;
    }

    modifier onlyTestator() {
        require(userInfo[msg.sender].isTestator, "Not testator");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /**
     * @notice Contract constructor
     * @dev Sets the contract owner
     */
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @notice Register a new user
     * @dev Creates a new user entry in the userInfo mapping
     */
    function registerUser() external {
        require(userInfo[msg.sender].wallet == address(0), "Already registered");
        userInfo[msg.sender].wallet = msg.sender;
        userInfo[msg.sender].lastLifeProof = block.timestamp;
        userInfo[msg.sender].isTestator = false;
        
        emit UserRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Create a new will
     * @param _name Name of the will
     * @param _renewPeriod Renewal period in units (days in production, minutes in testing)
     */
    function createWill(string calldata _name, uint256 _renewPeriod) external onlyUser {
        require(_renewPeriod > 0, "Invalid time period");
        willData[msg.sender].name = _name;
        willData[msg.sender].creationTime = block.timestamp;
        willData[msg.sender].renewPeriod = _renewPeriod * 1 minutes; // Set to minutes for testing, days for production
        willData[msg.sender].isActive = true;
        userInfo[msg.sender].isTestator = true;
        
        emit TestatorCreated(msg.sender, _name, _renewPeriod);
    }

    /**
     * @notice Deactivate a will
     * @dev Sets the will's active status to false
     */
    function deactivateWill() external onlyTestator {
        require(willData[msg.sender].isActive, "Will already inactive");
        require(!willData[msg.sender].isClaimed, "Will already claimed");
        
        willData[msg.sender].isActive = false;
        emit WillDeactivated(msg.sender, block.timestamp);
    }

    /**
     * @notice Add a beneficiary to the will
     * @param _beneficiary Address of the beneficiary
     * @param _percentage Percentage of assets to allocate to the beneficiary (1-100)
     */
    function addBeneficiary(address _beneficiary, uint256 _percentage) external onlyTestator {
        require(_beneficiary != address(0), "Invalid beneficiary address");
        require(willData[msg.sender].beneficiaryList.length < 10, "Max beneficiaries reached");
        require(_percentage > 0 && _percentage <= 100, "Percentage should be between 1-100");

        // Check if beneficiary already exists
        for (uint256 i = 0; i < willData[msg.sender].beneficiaryList.length; ++i) {
            require(willData[msg.sender].beneficiaryList[i].beneficiary != _beneficiary, "Beneficiary already exists");
        }

        // Calculate total percentage
        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < willData[msg.sender].beneficiaryList.length; ++i) {
            totalPercentage += willData[msg.sender].beneficiaryList[i].percentage;
        }
        require(totalPercentage + _percentage <= 100, "Total percentage exceeds 100");

        Beneficiaries memory beneficiary;
        beneficiary.beneficiary = _beneficiary;
        beneficiary.percentage = _percentage; 
        willData[msg.sender].beneficiaryList.push(beneficiary);
        
        emit BeneficiaryAdded(msg.sender, _beneficiary, _percentage);
    }

    /**
     * @notice Remove a beneficiary from the will
     * @param _beneficiary Address of the beneficiary to remove
     */
    function removeBeneficiary(address _beneficiary) external onlyTestator {
        require(!willData[msg.sender].isClaimed, "Will already claimed");
        
        bool found = false;
        uint256 indexToRemove;
        
        for (uint256 i = 0; i < willData[msg.sender].beneficiaryList.length; ++i) {
            if (willData[msg.sender].beneficiaryList[i].beneficiary == _beneficiary) {
                found = true;
                indexToRemove = i;
                break;
            }
        }
        
        require(found, "Beneficiary not found");
        
        // Remove by swapping with the last element and then removing the last element
        if (indexToRemove != willData[msg.sender].beneficiaryList.length - 1) {
            willData[msg.sender].beneficiaryList[indexToRemove] = 
                willData[msg.sender].beneficiaryList[willData[msg.sender].beneficiaryList.length - 1];
        }
        willData[msg.sender].beneficiaryList.pop();
        
        emit BeneficiaryRemoved(msg.sender, _beneficiary);
    }

    /**
     * @notice Update a beneficiary's percentage
     * @param _beneficiary Address of the beneficiary
     * @param _newPercentage New percentage to allocate
     */
    function updateBeneficiaryPercentage(address _beneficiary, uint256 _newPercentage) external onlyTestator {
        require(_newPercentage > 0 && _newPercentage <= 100, "Percentage should be between 1-100");
        require(!willData[msg.sender].isClaimed, "Will already claimed");
        
        // First remove the old percentage from the beneficiary
        bool found = false;
        uint256 oldPercentage = 0;
        
        for (uint256 i = 0; i < willData[msg.sender].beneficiaryList.length; ++i) {
            if (willData[msg.sender].beneficiaryList[i].beneficiary == _beneficiary) {
                oldPercentage = willData[msg.sender].beneficiaryList[i].percentage;
                willData[msg.sender].beneficiaryList[i].percentage = _newPercentage;
                found = true;
                break;
            }
        }
        
        require(found, "Beneficiary not found");
        
        // Calculate new total percentage
        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < willData[msg.sender].beneficiaryList.length; ++i) {
            totalPercentage += willData[msg.sender].beneficiaryList[i].percentage;
        }
        
        require(totalPercentage <= 100, "Total percentage exceeds 100");
        
        emit BeneficiaryAdded(msg.sender, _beneficiary, _newPercentage);
    }

    /**
     * @notice Add ERC20 tokens to the will
     * @param _tokenAddress Address of the ERC20 token contract
     * @param _tokenName Name of the token
     */
    function addERC20Assets(address _tokenAddress, string calldata _tokenName) external onlyTestator {
        require(_tokenAddress != address(0), "Invalid token address");
        require(willData[msg.sender].erc20Tokens.length < 20, "Max tokens reached");

        // Check if token already exists
        for (uint256 i = 0; i < willData[msg.sender].erc20Tokens.length; ++i) {
            require(willData[msg.sender].erc20Tokens[i].tokenAddress != _tokenAddress, "Token already added");
        }

        // Allowance must be set in dapp using token.approve(address(this), type(uint256).max)
        require(IERC20(_tokenAddress).allowance(msg.sender, address(this)) > 0, 'Must setup allowance first');
        
        Erc20Data memory erc20Data;
        erc20Data.tokenAddress = _tokenAddress;
        erc20Data.tokenName = _tokenName;
        erc20Data.tokenBalance = IERC20(_tokenAddress).balanceOf(msg.sender);
        willData[msg.sender].erc20Tokens.push(erc20Data);
        
        emit ERC20AssetAdded(msg.sender, _tokenAddress, _tokenName);
    }

    /**
     * @notice Update the token balances in the will
     * @dev Refreshes the token balances for better accuracy before execution
     */
    function updateTokenBalances() external onlyTestator {
        for (uint256 i = 0; i < willData[msg.sender].erc20Tokens.length; ++i) {
            address tokenAddress = willData[msg.sender].erc20Tokens[i].tokenAddress;
            willData[msg.sender].erc20Tokens[i].tokenBalance = IERC20(tokenAddress).balanceOf(msg.sender);
        }
    }

    /**
     * @notice Renew the life proof
     * @dev Updates the last life proof timestamp
     */
    function renewLifeProof() public onlyTestator {
        userInfo[msg.sender].lastLifeProof = block.timestamp;
        emit LifeProofRenewed(msg.sender, block.timestamp);
    }

    /**
     * @notice Check if a will is claimable
     * @param _testatorAddress Address of the testator
     * @return bool True if the will is claimable
     */
    function isWillClaimable(address _testatorAddress) public view returns (bool) {
        if (!willData[_testatorAddress].isActive) return false;
        if (willData[_testatorAddress].isClaimed) return false;
        
        uint256 lockPeriod = willData[_testatorAddress].renewPeriod + userInfo[_testatorAddress].lastLifeProof;
        return block.timestamp > lockPeriod;
    }

    /**
     * @notice Claim a will
     * @param _testatorAddress Address of the testator
     */
    function claimWill(address _testatorAddress) public onlyUser nonReentrant {
        require(willData[_testatorAddress].isActive, 'Will not active');
        require(!willData[_testatorAddress].isClaimed, 'Will already claimed');
        
        uint256 lockPeriod = willData[_testatorAddress].renewPeriod + userInfo[_testatorAddress].lastLifeProof;
        require(block.timestamp > lockPeriod, 'Lock period still active');
        
        bool isBeneficiary = false;
        for (uint256 i = 0; i < willData[_testatorAddress].beneficiaryList.length; ++i) {
            if(willData[_testatorAddress].beneficiaryList[i].beneficiary == msg.sender) {
                isBeneficiary = true;
                break;
            }
        }
        require(isBeneficiary, 'You are not a beneficiary');
        
        willData[_testatorAddress].claimTime = block.timestamp;
        willData[_testatorAddress].isClaimed = true;
        willData[_testatorAddress].claimer = msg.sender;
        
        emit WillClaimed(_testatorAddress, msg.sender, block.timestamp);
    }

    /**
     * @notice Execute a will
     * @param _testatorAddress Address of the testator
     */
    function executeWill(address _testatorAddress) public onlyUser nonReentrant {
        require(willData[_testatorAddress].isActive, 'Will not active');
        require(willData[_testatorAddress].isClaimed, 'Will not claimed');
        require(!willData[_testatorAddress].isExecuted, 'Will already executed');
        
        uint256 lockPeriod = willData[_testatorAddress].claimTime + claimPeriod;
        require(block.timestamp > lockPeriod, 'Lock period still active');

        bool isBeneficiary = false;
        for (uint256 i = 0; i < willData[_testatorAddress].beneficiaryList.length; ++i) {
            if(willData[_testatorAddress].beneficiaryList[i].beneficiary == msg.sender) {
                isBeneficiary = true;
                break;
            }
        }
        require(isBeneficiary, 'You are not a beneficiary');

        // Update token balances before execution
        for (uint256 i = 0; i < willData[_testatorAddress].erc20Tokens.length; ++i) {
            address tokenAddress = willData[_testatorAddress].erc20Tokens[i].tokenAddress;
            willData[_testatorAddress].erc20Tokens[i].tokenBalance = IERC20(tokenAddress).balanceOf(_testatorAddress);
        }

        erc20Transfer(_testatorAddress);

        willData[_testatorAddress].executionTime = block.timestamp;
        willData[_testatorAddress].isExecuted = true;
        willData[_testatorAddress].executor = msg.sender;
        
        emit WillExecuted(_testatorAddress, msg.sender, block.timestamp);
    }

    /**
     * @notice Transfer ERC20 tokens according to the will
     * @param _testatorAddress Address of the testator
     */
    function erc20Transfer(address _testatorAddress) private {
        WillData storage testament = willData[_testatorAddress];
        
        for(uint256 i = 0; i < testament.erc20Tokens.length; ++i) {
            address tokenAddress = testament.erc20Tokens[i].tokenAddress;
            uint256 tokenBalance = IERC20(tokenAddress).balanceOf(_testatorAddress);
            
            if (tokenBalance == 0) continue;
            
            uint256 tokenTransferFee = tokenBalance * executionFee / 100;
            
            // Transfer fee to contract
            IERC20(tokenAddress).safeTransferFrom(
                _testatorAddress, 
                address(this), 
                tokenTransferFee
            );
            
            emit TokenTransferred(_testatorAddress, address(this), tokenAddress, tokenTransferFee);
            
            // Calculate remaining balance after fee
            uint256 remainingBalance = tokenBalance - tokenTransferFee;
            
            // Transfer to beneficiaries
            for(uint256 j = 0; j < testament.beneficiaryList.length; ++j) {
                if (testament.beneficiaryList[j].percentage == 0) continue;
                
                uint256 tokenTransferAmount = remainingBalance * testament.beneficiaryList[j].percentage / 100;
                if (tokenTransferAmount == 0) continue;
                
                IERC20(tokenAddress).safeTransferFrom(
                    _testatorAddress, 
                    testament.beneficiaryList[j].beneficiary, 
                    tokenTransferAmount
                );
                
                emit TokenTransferred(
                    _testatorAddress, 
                    testament.beneficiaryList[j].beneficiary, 
                    tokenAddress, 
                    tokenTransferAmount
                );
            }
        }
    }

    /**
     * @notice Get the list of beneficiaries for a testator
     * @param _testatorAddress Address of the testator
     * @return Beneficiaries[] List of beneficiaries
     */
    function listBeneficiaries(address _testatorAddress) external view returns (Beneficiaries[] memory) {
        return willData[_testatorAddress].beneficiaryList;
    }

    /**
     * @notice Get the list of ERC20 tokens for a testator
     * @param _testatorAddress Address of the testator
     * @return Erc20Data[] List of ERC20 tokens
     */
    function listERC20Tokens(address _testatorAddress) external view returns (Erc20Data[] memory) {
        return willData[_testatorAddress].erc20Tokens;
    }
    
    /**
     * @notice Change the claim period
     * @param _newClaimPeriod New claim period in minutes
     */
    function setClaimPeriod(uint256 _newClaimPeriod) external onlyOwner {
        require(_newClaimPeriod > 0, "Invalid claim period");
        claimPeriod = _newClaimPeriod;
    }
    
    /**
     * @notice Change the execution fee
     * @param _newExecutionFee New execution fee percentage
     */
    function setExecutionFee(uint256 _newExecutionFee) external onlyOwner {
        require(_newExecutionFee <= 10, "Fee too high"); // Max 10%
        executionFee = _newExecutionFee;
    }
    
    /**
     * @notice Withdraw collected fees
     * @param _tokenAddress ERC20 token address
     */
    function withdrawFees(address _tokenAddress) external onlyOwner {
        uint256 balance = IERC20(_tokenAddress).balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        
        IERC20(_tokenAddress).safeTransfer(owner, balance);
        emit TokenTransferred(address(this), owner, _tokenAddress, balance);
    }
}
