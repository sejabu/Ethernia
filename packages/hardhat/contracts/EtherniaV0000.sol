// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
 * @title EtherniaV0000 MVP
 * @author @elgallodev
 * @notice Scroll Open Hackaton - Ethernia MVP
 * 
 * TO-DO List:
    - Add Events
    - Add Multi Will Support
    - Add NFT support 
    - Add automatic tokens discover
    - Add ZK Privacy Methods
    - Add Arcana-SDK 
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Ethernia {
    
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

    mapping(address => UserInfo) public userInfo;
    mapping(address => WillData) public willData;
        
    uint256 public claimPeriod = 3 minutes; // Set to minutes for testing, days for production
    uint256 public executionFee = 2;
    address public owner;
    event WillDeleted(address indexed testatorAddress);
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

    constructor() {
        owner = msg.sender;
    }
    
    function registerUser() external {
        require(userInfo[msg.sender].wallet == address(0), "Already registered");
        userInfo[msg.sender].wallet = msg.sender;
        userInfo[msg.sender].lastLifeProof = block.timestamp;
        userInfo[msg.sender].isTestator = false;
    }
    
    function createWill(string memory _name, uint256 _renewPeriod) external onlyUser {
        require(_renewPeriod > 0, "Invalid time period");
        willData[msg.sender].name = _name;
        willData[msg.sender].creationTime = block.timestamp;
        willData[msg.sender].renewPeriod = _renewPeriod * 1 minutes; // Set to minutes for testing, days for production
        willData[msg.sender].isActive = true;
        userInfo[msg.sender].isTestator = true;
    }

    function addBeneficiary(address _beneficiary, uint256 _percentage) external onlyTestator {
        require(willData[msg.sender].beneficiaryList.length < 10, "Max beneficiaries reached");
        require (_percentage > 0 && _percentage <=100, "Percentage should be a value between 0-100");

    // CORREGIR ACUMULACION CUANDO CARGO EL MISMO USUARIO CON UN DIFERENTE PORCENTAJE, NO CAMBIA, ACUMULA
        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < willData[msg.sender].beneficiaryList.length; i++) {
            totalPercentage += willData[msg.sender].beneficiaryList[i].percentage;
        }
        require(totalPercentage + _percentage <= 100, "Total percentage exceeds 100");

        Beneficiaries memory beneficiary;
        beneficiary.beneficiary = _beneficiary;
        beneficiary.percentage = _percentage; 
        willData[msg.sender].beneficiaryList.push(beneficiary);
    }

    function addERC20Assets (address _tokenAddress, string memory _tokenName) external onlyTestator {
        require(willData[msg.sender].erc20Tokens.length < 20, "Max tokens reached");

        // allowance must be doit in dapp token.approve(address(this), type(uint256).max)
        require(IERC20(_tokenAddress).allowance(msg.sender, address(this)) == type(uint256).max, 'Must setup allowance first');
        
        Erc20Data memory erc20Data;
        erc20Data.tokenAddress = _tokenAddress;
        erc20Data.tokenName = _tokenName;
        erc20Data.tokenBalance = IERC20(_tokenAddress).balanceOf(msg.sender);
        willData[msg.sender].erc20Tokens.push(erc20Data);
    }

    function renewLifeProof () public onlyTestator {
        userInfo[msg.sender].lastLifeProof = block.timestamp;
    }

    function claimWill (address _testatorAddress) public onlyUser {
        require(willData[_testatorAddress].isActive == true, 'Will not active');
        require(willData[_testatorAddress].isClaimed == false, 'Will already claimed');
        
        uint256 lockPeriod;
        lockPeriod = willData[_testatorAddress].renewPeriod + userInfo[_testatorAddress].lastLifeProof;
        require(block.timestamp > lockPeriod, 'Lock period still active.');
        
        bool isBeneficiary = false;
        for (uint256 i = 0; i < willData[_testatorAddress].beneficiaryList.length; i++){
            if(willData[_testatorAddress].beneficiaryList[i].beneficiary == msg.sender){
            isBeneficiary = true;
            }
        }
        require(isBeneficiary==true, 'You are not a beneficiary');
        
        willData[_testatorAddress].claimTime = block.timestamp;
        willData[_testatorAddress].isClaimed = true;
        willData[_testatorAddress].claimer = msg.sender;
    }

    function executeWill (address _testatorAddress) public onlyUser {
        require(willData[_testatorAddress].isActive == true, 'Will not active');
        require(willData[_testatorAddress].isClaimed == true, 'Will not claimed');
        require(willData[_testatorAddress].isExecuted == false, 'Will already executed');
        
        uint256 lockPeriod;
        lockPeriod = willData[_testatorAddress].claimTime + claimPeriod;
        require(block.timestamp > lockPeriod, 'Lock period still active.');

        bool isBeneficiary = false;
        for (uint256 i = 0; i < willData[_testatorAddress].beneficiaryList.length; i++){
            if(willData[_testatorAddress].beneficiaryList[i].beneficiary == msg.sender){
            isBeneficiary = true;
            }
        }
        require(isBeneficiary==true, 'You are not a beneficiary');

        erc20Transfer(_testatorAddress);

        willData[_testatorAddress].executionTime = block.timestamp;
        willData[_testatorAddress].isExecuted = true;
        willData[_testatorAddress].executor = msg.sender;

    }

    function erc20Transfer (address _testatorAddress) private {
        WillData memory testament = willData[_testatorAddress];
        for(uint256 i = 0; i < testament.erc20Tokens.length; i++) {
            address tokenAddress = testament.erc20Tokens[i].tokenAddress;
            uint256 tokenBalance = IERC20(tokenAddress).balanceOf(_testatorAddress);
            uint256 tokenTransferFee = tokenBalance * executionFee / 100;
            require(IERC20(tokenAddress).transferFrom(_testatorAddress, address(this), tokenTransferFee), 'Fee cannot be transfer');
            tokenBalance -= tokenTransferFee;
            for(uint256 j = 0; j < testament.beneficiaryList.length; j++){
                uint256 tokenTransferAmount = tokenBalance * testament.beneficiaryList[j].percentage /100;
                require(IERC20(tokenAddress).transferFrom(_testatorAddress, testament.beneficiaryList[j].beneficiary, tokenTransferAmount), 'Token transfer fail');
            }
        }
    }

    function listBeneficiaries (address _testatorAddress) external view returns (Beneficiaries[] memory){
        return willData[_testatorAddress].beneficiaryList;
    }

    function listERC20Tokens (address _testatorAddress) external view returns (Erc20Data[] memory){
        return willData[_testatorAddress].erc20Tokens;
    }
    
    function deleteWill () external onlyTestator {
        require(willData[msg.sender].isActive == true, 'Will not active');
        require(willData[msg.sender].isClaimed == false, 'Will already claimed'); 
        delete willData[msg.sender];
        userInfo[msg.sender].isTestator = false;
        emit WillDeleted(msg.sender);

    }

  
}