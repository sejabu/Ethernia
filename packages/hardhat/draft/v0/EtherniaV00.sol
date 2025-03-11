// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract EtherniaV0 {

    struct UserProfile{
        uint256 id;
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

    struct WillData {
        string name;
        uint256 id;
        uint256 renewLifeProofTime;
        uint256 claimTime;
        bool isActive;
        bool isClaimed;
        bool isExecuted;
        address claimer;
        address[] beneficiaryList;
//      mapping(address => bool) isBeneficiary;
//      mapping(address => uint256) beneficiaryPercentage;
        Erc20Data[] erc20Token;
        Erc721Data[] erc721Token;
    }

    mapping(address => UserProfile) public userInfo;
    mapping(address => WillData[]) public willInfo;
    mapping(address => mapping(uint256 => mapping(address => uint256))) public beneficiaryPercentages;
    mapping(address => mapping(uint256 => mapping(address => bool))) public isBeneficiary;
    
    uint256 public userCount;
    uint256 public willCount;
    uint256 public claimPeriod;
    uint256 public executionFee;
    address public owner;

//    uint256 public constant MAX_BENEFICIARIES = 10;
//    uint256 public constant MAX_TOKENS = 20;

  
 
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyUser() {
        require(userInfo[msg.sender].wallet != address(0), "You must be registered first");
        _;
    }

    modifier onlyTestator() {
        require(userInfo[msg.sender].isTestator == true, "You must create a will first");
        _;
    }

    modifier validWillId(address testator, uint256 willId) {
        require(willId < willInfo[testator].length, "Invalid will ID");
        _;
    }

    constructor() {
        owner = msg.sender;
        claimPeriod = 30;
        executionFee = 2;
    }

    function setClaimPeriod(uint256 _claimPeriod) external onlyOwner {
        claimPeriod = _claimPeriod;
    }

    function setExecutionFee(uint256 _executionFee) external onlyOwner {
        executionFee = _executionFee;
    }

    function registerUser() external {
        require(userInfo[msg.sender].wallet == address(0), "User already registered");
        userInfo[msg.sender] = UserProfile({
            wallet: msg.sender,
            lastLifeProof: block.timestamp,
            isTestator: false,
            id: userCount
        });
        userCount++;
    }

    function createWill(string memory _name, uint256 _renewLifeProofTime) external onlyUser {
        require(_renewLifeProofTime > 0, "Invalid time period");
        userInfo[msg.sender].isTestator = true;
        userInfo[msg.sender].lastLifeProof = block.timestamp;
        willInfo[msg.sender].push(WillData({
            name: _name,
            id: willInfo[msg.sender].length,
            renewLifeProofTime: _renewLifeProofTime * 1 days,
            claimTime: 0,
            isActive : true,
            isClaimed : false,
            claimer : address(0),
            beneficiaryList: new address,
            erc20Token[].tokenAddress : new address,
            erc20Token[].tokenName : new string,
            erc721Token[].tokenAddress : new address,
            erc721Token[].tokenName : new string
        }));
        willCount++;    
    }
    
    function registerBeneficiary(address _beneficiary) public onlyUser onlyTestator {
        require(_beneficiary != address(0), "Address cannot be 0");
        require(userInfo[_beneficiary].wallet == address(0), "User already registered");

        userInfo[_beneficiary].wallet = _beneficiary;
        userInfo[_beneficiary].isTestator = false;
        userInfo[_beneficiary].id = userCount;
        userCount++;
    }

    function deleteBeneficiary(address _beneficiary) public onlyUser onlyTestator {
        require(userInfo[_beneficiary].wallet != address(0), "Beneficiary not registered");
        userInfo[_beneficiary].wallet = address(0);
    }

    function addBeneficiaryToWill(address _beneficiary, uint256 _percentage) public onlyUser onlyTestator {
        require(_percentage <= 100, "Percentage must be less than or equal to 100");
        require(_beneficiary != address(0), "Address cannot be 0");
        require(userInfo[_beneficiary].wallet != address(0), "You must register the beneficiary first");
        require(willInfo[msg.sender].isBeneficiary[_beneficiary] == false, "Beneficiary already added to the will");
        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < willInfo[msg.sender].beneficiaryList.length; i++) {
            totalPercentage += willInfo[msg.sender].beneficiaryPercentage[willInfo[msg.sender].beneficiaryList[i]];
        }
        require(totalPercentage + _percentage <= 100, "Total percentage must be less than or equal to 100");
        willInfo[msg.sender].isBeneficiary[_beneficiary] = true;
        willInfo[msg.sender].beneficiaryPercentage[_beneficiary] = _percentage;
    }

    function removeBeneficiaryFromWill(address _beneficiary) public onlyUser onlyTestator {
        require(userInfo[_beneficiary].wallet != address(0), "Beneficiary not registered");
        willInfo[msg.sender].isBeneficiary[_beneficiary] = false;
        willInfo[msg.sender].beneficiaryPercentage[_beneficiary] = 0;
    }

    function renewLifeProof() public onlyTestator {
        for (uint256 i = 0; i < willInfo[msg.sender].length; i++) {
            if (willInfo[msg.sender][i].isActive) {
                userInfo[msg.sender].lastLifeProof = block.timestamp;
            }
        }
    }

    function deactivateWill(uint256 _id) public onlyTestator {
        require(_id < willInfo[msg.sender].length, "Invalid will id");
        require(willInfo[msg.sender][_id].isActive == true, "Will is already deactivated");
        willInfo[msg.sender][_id].isActive = false;
    }

    function activateWill(uint256 _id) public onlyTestator {
        require(_id < willInfo[msg.sender].length, "Invalid will id");
        require(willInfo[msg.sender][_id].isActive == false, "Will is already activated");
        willInfo[msg.sender][_id].isActive = true;
    }
    
    function getWillInfo(uint256 _id) public onlyTestator view returns (WillData) {
        require(_id < willInfo[msg.sender].length, "Invalid will id");
        return willInfo[msg.sender][_id];
    }
    
    function getUserInfo(address _address) public onlyUser view returns (UserProfile) {
        require(_address != address(0), "Address cannot be 0");
        require(userInfo[_address].wallet != address(0), "User not registered");
        return userInfo[_address];
    }
    
    function getUserCount() public view returns (uint256) {
        return userCount;
    }
    
    function getWillCount() public view returns (uint256) {
        return willCount;
    }
    
    function addERC20(address _tokenAddress, string _tokenName, uint256 _willId) public onlyTestator {
        require(_tokenAddress != address(0), "Address cannot be 0");
        require(_tokenName != "", "Token name must be completed");
        require(_willId < willInfo[msg.sender].length, "Invalid will id");
        require(willInfo[msg.sender][_willId].isActive == true, "Will is not active");
        for (uint256 i = 0; i < willInfo[msg.sender][_willId].erc20TokenAddress.length; i++) {
            if (willInfo[msg.sender][_willId].erc20TokenAddress[i] == _tokenAddress) {
                revert("ERC20 already added to the will");
            }
        }
        IERC20(_tokenAddress).approve(msg.sender, address(this), type(uint256).max);
        willInfo[msg.sender][_willId].erc20TokenAddress.push(_tokenAddress);
        willInfo[msg.sender][_willId].erc20TokenName.push(_tokenName);   
    }

    function removeERC20(address _tokenAddress, uint256 _willId) public onlyTestator {
        require(_willId < willInfo[msg.sender].length, "Invalid will id");
        require(willInfo[msg.sender][_willId].isActive == true, "Will is not active");

        for (uint256 i = 0; i < willInfo[msg.sender][_willId].erc20TokenAddress.length; i++) {
            if (willInfo[msg.sender][_willId].erc20TokenAddress[i] != _tokenAddress) {
                revert("ERC20 already quited from the will");
            }
        }
        IERC20(_tokenAddress).approve(msg.sender, address(this), 0);
        willInfo[msg.sender][_willId].erc20TokenAddress.remove(_tokenAddress);
        willInfo[msg.sender][_willId].erc20TokenName.remove(_tokenName);
    }
    
    function getERC20(uint256 _willId) public onlyTestator view returns (address[], string[]) {
        require(_willId < willInfo[msg.sender].length, "Invalid will id");
        return (willInfo[msg.sender][_willId].erc20TokenAddress, willInfo[msg.sender][_willId].erc20TokenName);
    }

    function getERC20Count(uint256 _willId) public onlyTestator view returns (uint256) {
        require(_willId < willInfo[msg.sender].length, "Invalid will id");
        return willInfo[msg.sender][_willId].erc20TokenAddress.length;
    }

    function addERC721(address _tokenAddress, string _tokenName, uint256 _willId) public onlyTestator {
        require(_tokenAddress != address(0), "Address cannot be 0");
        require(_tokenName != "", "Token name must be completed");
        require(_willId < willInfo[msg.sender].length, "Invalid will id");
        require(willInfo[msg.sender][_willId].isActive == true, "Will is not active");

        for (uint256 i = 0; i < willInfo[msg.sender][_willId].erc721TokenAddress.length; i++) {
            if (willInfo[msg.sender][_willId].erc721TokenAddress[i] == _tokenAddress) {
                revert("ERC721 already added to the will");
            }
        }
        IERC721(_tokenAddress).setApprovalForAll(msg.sender, true);
        willInfo[msg.sender][_willId].erc721TokenAddress.push(_tokenAddress);
        willInfo[msg.sender][_willId].erc721TokenName.push(_tokenName);
    }

    function removeERC721(address _tokenAddress, uint256 _willId) public onlyTestator {
        require(_willId < willInfo[msg.sender].length, "Invalid will id");
        require(willInfo[msg.sender][_willId].isActive == true, "Will is not active");
        
        for (uint256 i = 0; i < willInfo[msg.sender][_willId].erc721TokenAddress.length; i++) {
            if (willInfo[msg.sender][_willId].erc721TokenAddress[i] != _tokenAddress) {
                revert("ERC721 already quited from the will");
            }
        }
        IERC721(_tokenAddress).setApprovalForAll(msg.sender, false);
        willInfo[msg.sender][_willId].erc721TokenAddress.remove(_tokenAddress);
        willInfo[msg.sender][_willId].erc721TokenName.remove(_tokenName);
    }   
    
    function getERC721(uint256 _willId) public onlyTestator view returns (address[], string[]) {
        require(_willId < willInfo[msg.sender].length, "Invalid will id");
        return (willInfo[msg.sender][_willId].erc721TokenAddress, willInfo[msg.sender][_willId].erc721TokenName);
    }  
    
    function getERC721Count(uint256 _willId) public onlyTestator view returns (uint256) {
        require(_willId < willInfo[msg.sender].length, "Invalid will id");
        return willInfo[msg.sender][_willId].erc721TokenAddress.length;
    }
    
    function getERC721TokenId(uint256 _willId, uint256 _tokenId) public onlyTestator view returns (uint256) {
        require(_willId < willInfo[msg.sender].length, "Invalid will id");
        return willInfo[msg.sender][_willId].erc721TokenAddress[_tokenId];
    }
    
    function getERC721TokenName(uint256 _willId, uint256 _tokenId) public onlyTestator view returns (string) {
        require(_willId < willInfo[msg.sender].length, "Invalid will id");
        return willInfo[msg.sender][_willId].erc721TokenName[_tokenId];
    }
    
    function claimWill(address _testator, uint256 _willId) public onlyUser {
        require(_willId < willInfo[_testator].length, "Invalid will id");
        
        testament = willInfo[_testator][_willId];
        
        require(testament.isActive == true, "Will is not active");
        require(block.timestamp >= testament.renewLifeProofTime + testament.lastLifeProof, "Life proof time has not passed");
        
        for(uint256 i = 0; i < testament.beneficiaryList.length; i++) {
            if (msg.sender == testament.beneficiaryList[i]){
                testament.isClaimed = true;    
                testament.claimTime = block.timestamp;
                testament.claimer = msg.sender;
                testament.isActive = false;
            }
        
        }
            
    }

    function executeWill(address _testator, uint256 _willId) public {
        require(_willId < willInfo[_testator].length, "Invalid will id");
        require(willInfo[_testator][_willId].isClaimed == true, "Will is not claimed");
        require(block.timestamp >= willInfo[msg.sender][_willId].claimTime + claimPeriod, "Claim period has not passed");
        
        erc20Transfer(_testator, _willId);
        erc721Transfer(_testator, _willId);
        willInfo[_testator][_willId].isExecuted = true;
        }

    }

    function erc20Transfer (address _testator, uint256 _willId) private {
        testament = willInfo[_testator][_willId];
        for(uint256 i = 0; i < testament.erc20TokenAddress.length; i++) {
            erc20Balance = testament.erc20TokenAddress[i].balanceOf(_testator);
            erc20Amount = erc20Balance * testament.beneficiaryPercentage[msg.sender] / 100;
            erc20Fee = erc20Amount * executionFee / 100;
            erc20Amount -= erc20Fee;
            testament.erc20TokenAddress[i].transferFrom(msg.sender, erc20Amount);
            testament.erc20TokenAddress[i].transferFrom(address.this, erc20Fee);
        }
    }

    function erc721Transfer (address _testator, uint256 _willId) private {
        testament = willInfo[_testator][_willId];
        for(uint256 i = 0; i < testament.erc721TokenAddress.length; i++) {
            erc721Balance = testament.erc721TokenAddress[i].balanceOf(_testator);
            erc721Amount = erc721Balance * testament.beneficiaryPercentage[msg.sender] / 100;
            erc721Fee = erc721Amount * executionFee / 100;
            erc721Amount -= erc721Fee;
            testament.erc721TokenAddress[i].transferFrom(msg.sender, erc721Amount);
            testament.erc721TokenAddress[i].transferFrom(address.this, erc721Fee);
        }
    }

    function balanceERC20(address _tokenAddress) public view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    function balanceERC721(address _tokenAddress) public view returns (uint256) {
        return IERC721(_tokenAddress).balanceOf(address(this));
    }

    function balanceERC721TokenId(address _tokenAddress, uint256 _tokenId) public view returns (uint256) {
        return IERC721(_tokenAddress).balanceOf(address(this), _tokenId);
    }

    function withdrawERC20(address _tokenAddress) public {
        require(msg.sender == owner, "Only owner can withdraw");
        IERC20(_tokenAddress).transfer(msg.sender, IERC20(_tokenAddress).balanceOf(address(this)));
    }    

    function withdrawERC721(address _tokenAddress, uint256 _tokenId) public {
        require(msg.sender == owner, "Only owner can withdraw");
        IERC721(_tokenAddress).transferFrom(address(this), msg.sender, _tokenId);
    }
    
}
