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
    
    uint256 constant LOCK_PERIOD = 180 days; // tiempo que debe pasar desde el reclamo hasta la ejecución.
    uint256 constant ALERT_PERIOD = 30 days; // 30 días de gracias para renovar prueba de vida, antes de permtir iniciar el reclamo.

    mapping(address => string) public Assets; // Lista de addresses de los smart contracts de los activos.

    struct DigitalWill {
        address testator; // Dirección del testador.
        uint256 lastRenewed; // Last time the testator confirmed being alive
        uint256 renewPeriod; // Tiempo que debe pasar entre cada renovación.
        bool isActive; // Indica si el testamento está activo.
        mapping(address => uint256) beneficiaries; // Porcentaje de la herencia que le corresponde a cada beneficiario.

    }
    
//EVENTOS:

    event WillCreated(address indexed creator); // Evento que se emite al crear un testamento.
    event LifeProofRenewed(address indexed creator, uint256 timestamp); // Evento que se emite al renovar la prueba de vida.
    event ClaimExecuted(address indexed creator); // Evento que se emite al reclamar un testamento.
    event WillExecuted(address indexed creator); // Evento que se emite al ejecutar un testamento.

//MODIFICADORES:

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier canClaim() {
        require(isBeneficiary[msg.sender], "Not a beneficiary");
        require(isActive, "Will not active");
        require(block.timestamp >= lastRenewed + renewPeriod + ALERT_PERIOD, "Lock period not over");
        _;
    }

//CONSTRUCTOR:

    constructor() {
        owner = msg.sender;
    }



//FUNCIONES:

    function createWill (uint256 _renewPeriod, address[] memory _beneficiaries, uint256[] memory _percentages) external nonReentrant payable {
        require(_beneficiaries.length == _percentages.length, "Beneficiaries and percentages length mismatch"); // Verifica que la cantidad de beneficiarios sea igual a la cantidad de porcentajes.
        require(_beneficiaries.length > 0, "No beneficiaries"); // Verifica que haya al menos un beneficiario.
        require(msg.value > 0, "No value sent"); // Verifica que se pague la tarifa por realizar el testamento, valor a definir.

        DigitalWill[msg.sender] = DigitalWill({
            testator: msg.sender,
            lastRenewed: block.timestamp,
            renewPeriod: _renewPeriod,
            isActive: true
    });

    for (uint256 i = 0; i < _beneficiaries.length; i++) {
        DigitalWill[msg.sender].beneficiaries[_beneficiaries[i]] = _percentages[i];
    }

    emit WillCreated(msg.sender);
} 
    
/*

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

*/

}
