// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

//LIBRERIAS:

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract Will is ReentrancyGuard, Pausable {

//VARIABLES:
    
    address public owner;
    
    uint256 constant LOCK_PERIOD = 180 days; // tiempo que debe pasar desde el reclamo hasta la ejecución.
    uint256 constant ALERT_PERIOD = 30 days; // 30 días de gracias para renovar prueba de vida, antes de permtir iniciar el reclamo.

    struct Will {
        address testator; // Dirección del testador.
        uint256 lastRenewed; // Last time the testator confirmed being alive
        uint256 renewPeriod; // Tiempo configurable que debe pasar entre cada renovación.
        bool isActive; // Indica si el testamento está activo.
        mapping(address => uint256) beneficiaries; // Porcentaje de la herencia que le corresponde a cada beneficiario.
        mapping(address => string) AssetsList; // Lista con addresses de los smart contracts de los activos que desea incluir en la herencia y la denominacion de su token.
    }

    mapping(address => Will) private Wills; // Lista de testamentos creados.
    
//EVENTOS:

    event WillCreated(address indexed creator); // Evento que se emite al crear un testamento.
    event LifeProofRenewed(address indexed creator, uint256 timestamp); // Evento que se emite al renovar la prueba de vida.
    event ClaimExecuted(address indexed testator, address indexed claimer, uint256 timestamp); // Evento que se emite al reclamar un testamento.
    event WillExecuted(address indexed creator); // Evento que se emite al ejecutar un testamento.
    event WillDeactivated (address indexed creator, uint256 timestamp); // Evento que se emite al desactivar un testamento.

//MODIFICADORES:

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized"); // Verifica que el que llama a la función sea el dueño del contrato.
        _;
    }

    modifier onlyTestator() {
        require(Wills[msg.sender].isActive, "No active will");
        require(Wills[msg.sender].testator == msg.sender, "Not the testator");
        _;
    }

    modifier canClaim(address _testatorAddress) {
        require(Wills[_testatorAddress].isActive, "Will not active"); // Verifica que el testamento esté activo.
    //    require(wills[_testatorAddress].beneficiaries[msg.sender] > 0, "Not a beneficiary");
        require(block.timestamp >= Wills[_testatorAddress].lastRenewed + Wills[_testatorAddress].renewPeriod + ALERT_PERIOD, "Lock period not over"); // Verifica que haya pasado el tiempo desdela última prueba de vida + el periodo de gracia.
        _;
    }

//CONSTRUCTOR:

    constructor() {
        owner = msg.sender;
    }



//FUNCIONES:

    function createWill (uint256 _renewPeriod, address[] memory _beneficiaries, uint256[] memory _percentages, address[] memory _assetAddress, string[] memory _tokenName) external payable nonReentrant {
        require(_beneficiaries.length == _percentages.length, "Beneficiaries and percentages length mismatch"); // Verifica que la cantidad de beneficiarios sea igual a la cantidad de porcentajes.
        require(_beneficiaries.length > 0, "No beneficiaries"); // Verifica que haya al menos un beneficiario.
        require(_assetAddress.length == _tokenName.length, "Each asset address must have a denomination"); // Verifica que la cantidad de activos sea igual a la cantidad de denominaciones.
        require(_assetAddress.length > 0, "No assets"); // Verifica que haya al menos un activo.
        require(msg.value > 0, "No value sent"); // Verifica que se pague la tarifa por realizar el testamento, valor a definir.

        Will storage newWill = Wills[msg.sender]; // Crea un nuevo testamento.

        newWill.testator = msg.sender; // Asigna la dirección del testador.
        newWill.lastRenewed = block.timestamp;  // Asigna la fecha de creación del testamento.
        newWill.renewPeriod = _renewPeriod; // Asigna el tiempo de renovación de la prueba de vida.
        newWill.isActive = true; // Indica que el testamento está activo.

        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            newWill.beneficiaries[_beneficiaries[i]] = _percentages[i]; // Asigna el porcentaje de la herencia a cada beneficiario.
        }
        for (uint256 i = 0; i < _assetAddress.length; i++) {
            newWill.AssetsList[_assetAddress[i]] = _tokenName[i]; // Asigna la dirección del activo y su denominación. 
        }

        emit WillCreated(msg.sender); // Emite el evento de creación del testamento.
    } 

    function renewLifeProof () external onlyTestator() {
        require(Wills[msg.sender].isActive, "No active will"); // Verifica que el testamento esté activo.
        Wills[msg.sender].lastRenewed = block.timestamp; // Actualiza la fecha de la última prueba de vida.
        emit LifeProofRenewed(msg.sender, block.timestamp); // Emite el evento de renovación de la prueba de vida.
    }  

    function modifyWill () external onlyTestator(){
        require(Wills[msg.sender].isActive, "No active will"); // Verifica que el testamento esté activo.
        //Modificar beneficiarios

        //Modificar porcentajes
        //Modificar activos        
    }

    function deactivateWill () external onlyTestator(){ 
        require(Wills[msg.sender].isActive, "No active will"); // Verifica que el testamento esté activo.
        Wills[msg.sender].isActive = false; // Desactiva el testamento.
        
        emit WillDeactivated (msg.sender, block.timestamp); //Emitir evento de eliminación del testamento
    }

    function claimWill (address _testatorAddress) external canClaim (_testatorAddress) {
        //Verificar que el testador esté muerto
        //Verificar que el testamento esté activo
        //Verificar que haya pasado el tiempo de gracia
        //Verificar que el que llama sea un beneficiario
        //Verificar que el testamento no haya sido reclamado
        //Verificar que el testamento no haya sido ejecutado
        //Verificar que el testamento no haya sido reclamado por otro beneficiario
        //Set timelock para ejecución del testamento
        
        emit ClaimExecuted(_testatorAddress, msg.sender, block.timestamp); //Emitir evento de reclamo del testamento
    }

    function executeWill () external nonReentrant {
        //Verificar que el testamento esté activo
        //Verificar que haya pasado el tiempo de espera
        //Ejecutar transferencia de activos
        //Desactivar el testamento
        //Emitir evento de ejecución del testamento
    }
}    
