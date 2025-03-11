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
    - Clean code, realice gas optimization
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EtherniaV000 is ReentrancyGuard, Pausable, {

    struct UserInfo {
        address wallet;
        uint256 lastLifeProof;
        bool isTestator;
    }

    struct Erc20Data {
        address tokenAddress;
        string tokenName;
    }

    struct Erc721Data {
        address tokenAddress;
        string tokenName;
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
        Erc721Data[] erc721Tokens;
    }

    mapping(address => UserProfile) public userInfo;
    mapping(address => WillData[]) public willInfo;
    
    uint256 public claimPeriod = 3 minutes;  // Set to minutes for testing, days for production
    uint256 public executionFee = 2;
    uint256 public constant MAX_BENEFICIARIES = 10;
    uint256 public constant MAX_TOKENS = 20;

    event WillCreated(address indexed testator, uint256 indexed willId);
    event WillClaimed(address indexed testator, uint256 indexed willId, address indexed claimer);
    event WillExecuted(address indexed testator, uint256 indexed willId);
    
    modifier onlyUser() {
        require(userInfo[msg.sender].wallet != address(0), "Not registered");
        _;
    }

    modifier onlyTestator() {
        require(userInfo[msg.sender].isTestator, "Not a testator");
        _;
    }

    modifier isValidWill(address _testator, uint256 _willId) {
        require(_willId < willInfo[_testator].length, "Invalid will ID");
        _;
    }

    constructor() {
        _transferOwnership(msg.sender);
    }

    function registerUser() external {
        address memory user = msg.sender;
        require(userInfo[user].wallet == address(0), "Already registered");
        userInfo[user].wallet = msg.sender;
        userInfo[user].lastLifeProof = block.timestamp;
        userInfo[user].isTestator = false;
       
    }

    function createWill(string calldata _name, uint256 _renewPeriod) external onlyUser whenNotPaused {
        require(_renewPeriod > 0, "Invalid time period");
        
        userInfo[msg.sender].isTestator = true;
        userInfo[msg.sender].lastLifeProof = block.timestamp;
        
        WillData storage newWill = willInfo[msg.sender].push();
        newWill.name = _name;
        newWill.id = willInfo[msg.sender].length - 1;
        newWill.renewLifeProofTime = _renewLifeProofTime * 1 days;
        newWill.isActive = true;
        
        emit WillCreated(msg.sender, newWill.id);
        willCount++;
    }

    function addBeneficiary(uint256 _willId, address _beneficiary, uint256 _percentage) 
        external 
        onlyTestator 
        validWillId(msg.sender, _willId)
        whenNotPaused 
    {
        WillData storage will = willInfo[msg.sender][_willId];
        require(will.isActive, "Will not active");
        require(_beneficiary != address(0), "Invalid address");
        require(_percentage > 0 && _percentage <= 100, "Invalid percentage");
        require(!isBeneficiary[msg.sender][_willId][_beneficiary], "Already beneficiary");
        require(will.beneficiaryList.length < MAX_BENEFICIARIES, "Too many beneficiaries");

        uint256 totalPercentage = _percentage;
        for (uint256 i = 0; i < will.beneficiaryList.length; i++) {
            totalPercentage += beneficiaryPercentages[msg.sender][_willId][will.beneficiaryList[i]];
        }
        require(totalPercentage <= 100, "Exceeds 100%");

        will.beneficiaryList.push(_beneficiary);
        isBeneficiary[msg.sender][_willId][_beneficiary] = true;
        beneficiaryPercentages[msg.sender][_willId][_beneficiary] = _percentage;
    }

    function claimWill(address _testator, uint256 _willId) 
        external 
        onlyUser 
        validWillId(_testator, _willId)
        whenNotPaused
        nonReentrant 
    {
        WillData storage will = willInfo[_testator][_willId];
        require(will.isActive, "Will not active");
        require(!will.isClaimed, "Already claimed");
        require(isBeneficiary[_testator][_willId][msg.sender], "Not beneficiary");
        require(
            block.timestamp >= userInfo[_testator].lastLifeProof + will.renewLifeProofTime,
            "Cannot claim yet"
        );

        will.isClaimed = true;
        will.claimTime = block.timestamp;
        will.claimer = msg.sender;
        will.isActive = false;

        emit WillClaimed(_testator, _willId, msg.sender);
    }

    function executeWill(address _testator, uint256 _willId)
        external
        onlyUser
        validWillId(_testator, _willId)
        whenNotPaused
        nonReentrant
    {
        WillData storage will = willInfo[_testator][_willId];
        require(will.isClaimed, "Not claimed");
        require(!will.isExecuted, "Already executed");
        require(
            block.timestamp >= will.claimTime + claimPeriod,
            "Claim period not over"
        );

        will.isExecuted = true;
        _executeErc20Transfers(_testator, _willId);
        _executeErc721Transfers(_testator, _willId);

        emit WillExecuted(_testator, _willId);
    }

    function _executeErc20Transfers(address _testator, uint256 _willId) private {
        WillData storage will = willInfo[_testator][_willId];
        
        for (uint256 i = 0; i < will.erc20Tokens.length; i++) {
            IERC20 token = IERC20(will.erc20Tokens[i].tokenAddress);
            uint256 balance = token.balanceOf(_testator);
            
            for (uint256 j = 0; j < will.beneficiaryList.length; j++) {
                address beneficiary = will.beneficiaryList[j];
                uint256 percentage = beneficiaryPercentages[_testator][_willId][beneficiary];
                
                if (percentage > 0) {
                    uint256 amount = (balance * percentage) / 100;
                    uint256 fee = (amount * executionFee) / 100;
                    uint256 transferAmount = amount - fee;
                    
                    require(
                        token.transferFrom(_testator, beneficiary, transferAmount),
                        "ERC20 transfer failed"
                    );
                    require(
                        token.transferFrom(_testator, address(this), fee),
                        "Fee transfer failed"
                    );
                }
            }
        }
    }

    function _executeErc721Transfers(address _testator, uint256 _willId) private {
        WillData storage will = willInfo[_testator][_willId];
        
        for (uint256 i = 0; i < will.erc721Tokens.length; i++) {
            IERC721 token = IERC721(will.erc721Tokens[i].tokenAddress);
            uint256 balance = token.balanceOf(_testator);
            
            for (uint256 j = 0; j < will.beneficiaryList.length; j++) {
                address beneficiary = will.beneficiaryList[j];
                uint256 percentage = beneficiaryPercentages[_testator][_willId][beneficiary];
                
                if (percentage > 0) {
                    uint256 tokenCount = (balance * percentage) / 100;
                    for (uint256 k = 0; k < tokenCount; k++) {
                        uint256 tokenId = token.tokenOfOwnerByIndex(_testator, k);
                        token.transferFrom(_testator, beneficiary, tokenId);
                    }
                }
            }
        }
    }

    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function setClaimPeriod(uint256 _claimPeriod) external onlyOwner {
        require(_claimPeriod > 0, "Invalid period");
        claimPeriod = _claimPeriod * 1 days;
    }

    function setExecutionFee(uint256 _executionFee) external onlyOwner {
        require(_executionFee <= 10, "Fee too high");
        executionFee = _executionFee;
    }

    // Emergency functions
    function emergencyWithdraw(address _token) external onlyOwner {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        require(IERC20(_token).transfer(owner(), balance), "Withdraw failed");
    }

    function emergencyWithdrawNFT(address _token, uint256 _tokenId) external onlyOwner {
        IERC721(_token).transferFrom(address(this), owner(), _tokenId);
    }
}