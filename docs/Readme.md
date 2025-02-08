# Digital Will Smart Contract Documentation

## Overview
The Digital Will smart contract enables users to create and manage digital wills for cryptocurrency assets. It allows testators to specify beneficiaries, distribute assets, and requires periodic proof-of-life confirmations.

## Core Features
- Will creation and management
- Periodic life proof verification
- Beneficiary management
- Asset distribution
- Multi-token support (ERC20, ERC1155)

## Contract Details
- License: MIT
- Solidity Version: ^0.8.26
- Dependencies: OpenZeppelin contracts (ReentrancyGuard, Pausable, IERC20, IERC1155)

## Key Constants
- `LOCK_PERIOD`: 180 days (time between claim and execution)
- `ALERT_PERIOD`: 30 days (grace period for life proof renewal)

## Data Structures

### Will Struct
```solidity
struct Will {
    address testator;           // Will creator's address
    address claimer;           // Address that initiated the claim
    uint256 lastRenewed;       // Last life proof timestamp
    uint256 renewPeriod;       // Time between required renewals
    uint256 claimTime;         // Timestamp of will claim
    bool isActive;             // Will status
    bool isClaimed;           // Claim status
    address[] beneficiaryList; // List of beneficiary addresses
    address[] assetList;       // List of asset contract addresses
    mapping(address => uint256) beneficiaries;     // Beneficiary share percentages
    mapping(address => string) beneficiariesNames; // Beneficiary names
    mapping(address => string) AssetsList;         // Asset tokens and denominations
}
```

## Core Functions

### Creating and Managing Wills

#### `createWill`
```solidity
function createWill(
    uint256 _renewPeriod,
    address[] memory _beneficiaries,
    uint256[] memory _percentages,
    address[] memory _assetAddress,
    string[] memory _tokenName
) external payable nonReentrant
```
Creates a new will with specified beneficiaries and assets.

Requirements:
- Valid renewal period
- At least one beneficiary
- At least one asset
- Percentages must sum to 100
- Payment for will creation

#### `modifyWill`
```solidity
function modifyWill(
    uint256 _renewPeriod,
    address[] memory _beneficiaries,
    uint256[] memory _percentages,
    address[] memory _assetAddress,
    string[] memory _tokenName
) external
```
Modifies an existing will's parameters.

### Beneficiary Management

#### `registerBeneficiary`
```solidity
function registerBeneficiary(
    address _beneficiaryAddress,
    string memory _name
) public
```
Registers a new beneficiary with their name.

#### `revokeBeneficiary`
```solidity
function revokeBeneficiary(address _beneficiary) external
```
Removes a beneficiary from the will.

#### `redistributePercentages`
```solidity
function redistributePercentages(
    address[] memory _beneficiaries,
    uint256[] memory _newPercentages
) external
```
Updates inheritance percentages among beneficiaries.

### Life Proof and Will Execution

#### `renewLifeProof`
```solidity
function renewLifeProof() external
```
Confirms testator is alive, resetting the renewal period.

#### `claimWill`
```solidity
function claimWill(address _testatorAddress) external nonReentrant
```
Initiates will claim process after renewal period expiration.

#### `executeWill`
```solidity
function executeWill(address _testatorAddress) external nonReentrant
```
Executes will distribution after lock period.

## Events

```solidity
event WillCreated(address indexed creator)
event LifeProofRenewed(address indexed creator, uint256 timestamp)
event ClaimExecuted(address indexed testator, address indexed claimer, uint256 timestamp)
event WillExecuted(address indexed creator, uint256 timestamp)
event WillDeactivated(address indexed creator, uint256 timestamp)
event WillModified(address indexed testator, uint256 timestamp)
event BeneficiaryRevoked(address indexed testator, address indexed beneficiary, uint256 percentage)
event PercentagesRedistributed(address indexed testator)
event BeneficiaryRegistered(address indexed creator, address indexed beneficiaryAddress, string beneficiaryName)
```

## Security Considerations

1. Reentrancy Protection
   - Uses OpenZeppelin's ReentrancyGuard
   - Implements checks-effects-interactions pattern

2. Access Control
   - Modifier `onlyOwner` for administrative functions
   - Modifier `onlyTestator` for will management
   - Modifier `canClaim` for will execution

3. Time Locks
   - LOCK_PERIOD prevents immediate execution after claim
   - ALERT_PERIOD provides grace period for life proof

## Known Limitations

1. ERC721 support is currently commented out
2. No automatic redistribution after beneficiary revocation
3. Requires manual approval for token transfers
4. Fixed percentage-based distribution system

## Usage Guidelines

1. Will Creation
   - Set appropriate renewal period
   - Verify beneficiary addresses
   - Ensure asset contracts are valid
   - Include sufficient payment

2. Maintenance
   - Regular life proof renewal
   - Update beneficiary information as needed
   - Monitor asset approvals

3. Execution
   - Verify lock period completion
   - Ensure sufficient gas for all transfers
   - Check token approvals before execution

## Owner Functions

#### `withdraw`
```solidity
function withdraw(uint256 _amount) external onlyOwner
```
Allows owner to withdraw contract funds.

#### `getBalance`
```solidity
function getBalance() external view returns (uint256)
```
Returns contract balance.
