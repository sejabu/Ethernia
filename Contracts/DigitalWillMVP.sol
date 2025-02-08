// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

//LIBRERIAS:

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract DigitalWill is ReentrancyGuard, Pausable {

//VARIABLES:
    
    address public owner;
    
    uint256 constant LOCK_PERIOD = 180 days; // tiempo que debe pasar desde el reclamo hasta la ejecución.
    uint256 constant ALERT_PERIOD = 30 days; // 30 días de gracias para renovar prueba de vida, antes de permtir iniciar el reclamo.

    struct Will {
        address testator; // Dirección del testador.
        address claimer; // Dirección del reclamante.
        uint256 lastRenewed; // Last time the testator confirmed being alive
        uint256 renewPeriod; // Tiempo configurable que debe pasar entre cada renovación.
        uint256 claimTime; // Almacena la fecha de reclamo del testamento.
        bool isActive; // Indica si el testamento está activo.
        bool isClaimed; // Indica si el testamento ha sido reclamado.
        address[] beneficiaryList;
        address[] assetList;
        mapping(address => uint256) beneficiaries; // Porcentaje de la herencia que le corresponde a cada beneficiario.
        mapping(address => string) AssetsList; // Lista con addresses de los smart contracts de los activos que desea incluir en la herencia y la denominacion de su token.
    }

    mapping(address => Will) private Wills; // Lista de testamentos creados.
    
//EVENTOS:

    event WillCreated(address indexed creator); // Evento que se emite al crear un testamento.
    event LifeProofRenewed(address indexed creator, uint256 timestamp); // Evento que se emite al renovar la prueba de vida.
    event ClaimExecuted(address indexed testator, address indexed claimer, uint256 timestamp); // Evento que se emite al reclamar un testamento.
    event WillExecuted(address indexed creator, uint256 timestamp); // Evento que se emite al ejecutar un testamento.
    event WillDeactivated (address indexed creator, uint256 timestamp); // Evento que se emite al desactivar un testamento.
    event WillModified(address indexed testator, uint256 timestamp); // Evento que se emite al modificar un testamento.
    event BeneficiaryRevoked(address indexed testator, address indexed beneficiary, uint256 percentage); // Evento que se emite al revocar un beneficiario.
    event PercentagesRedistributed(address indexed testator); // Evento que se emite al redistribuir los porcentajes de la herencia.

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
    //    require(block.timestamp >= Wills[_testatorAddress].lastRenewed + Wills[_testatorAddress].renewPeriod + ALERT_PERIOD, "Lock period not over"); // Verifica que haya pasado el tiempo desdela última prueba de vida + el periodo de gracia.
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
        require(validatePercentages(_percentages), "Percentages must sum to 100");

        Will storage newWill = Wills[msg.sender]; // Crea un nuevo testamento.

        newWill.testator = msg.sender; // Asigna la dirección del testador.
        newWill.lastRenewed = block.timestamp;  // Asigna la fecha de creación del testamento.
        newWill.renewPeriod = _renewPeriod; // Asigna el tiempo de renovación de la prueba de vida.
        newWill.isActive = true; // Indica que el testamento está activo.

        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            require(_beneficiaries[i] != address(0), "Invalid beneficiary address");
            newWill.beneficiaries[_beneficiaries[i]] = _percentages[i]; // Asigna el porcentaje de la herencia a cada beneficiario.
            newWill.beneficiaryList.push(_beneficiaries[i]);
        }
        for (uint256 i = 0; i < _assetAddress.length; i++) {
            require(_assetAddress[i] != address(0), "Invalid asset address");
            newWill.AssetsList[_assetAddress[i]] = _tokenName[i]; // Asigna la dirección del activo y su denominación. 
            newWill.assetList.push(_assetAddress[i]);
        }
        // FALTA SOLICITAR LOS PERMISOS PARA QUE EL CONTRATO PUEDA MOVER LOS ASSETS LLEGADO EL MOMENTO
        emit WillCreated(msg.sender); // Emite el evento de creación del testamento.
    }

    function validatePercentages(uint256[] memory _percentages) internal pure returns (bool) {
    uint256 total = 0;
    for (uint256 i = 0; i < _percentages.length; i++) {
        total += _percentages[i];
    }
    return total == 100;
}

    function renewLifeProof () external onlyTestator() {
        require(Wills[msg.sender].isActive, "No active will"); // Verifica que el testamento esté activo.
        Wills[msg.sender].lastRenewed = block.timestamp; // Actualiza la fecha de la última prueba de vida.
        emit LifeProofRenewed(msg.sender, block.timestamp); // Emite el evento de renovación de la prueba de vida.
    }  

    function modifyWill(uint256 _renewPeriod, address[] memory _beneficiaries, uint256[] memory _percentages, address[] memory _assetAddress, string[] memory _tokenName) external onlyTestator {
        require(Wills[msg.sender].isActive, "No active will"); // Verifica que el testamento esté activo.
        require(_beneficiaries.length == _percentages.length, "Beneficiaries and percentages mismatch");
        require(_assetAddress.length == _tokenName.length, "Assets and names mismatch");
        require(validatePercentages(_percentages), "Percentages must sum to 100");

    
        Will storage will = Wills[msg.sender];
    
        // Update renewal period if provided
        if (_renewPeriod > 0) {
            will.renewPeriod = _renewPeriod;
        }
    
        // Update beneficiaries and percentages
        if (_beneficiaries.length > 0) {
            // FALTA CHEQUEAR QUE TODAS LAS DIRECCIONES SEAN VALIDAS ANTES DE PROCEDER A LIMPIAR LA LISTA ANTERIOR.
            for (uint256 i = 0; i < will.beneficiaryList.length; i++) {
                will.beneficiaries[will.beneficiaryList[i]] = 0;
            }
            delete will.beneficiaryList;

            for (uint256 i = 0; i < _beneficiaries.length; i++) {
                require(_beneficiaries[i] != address(0), "Invalid beneficiary address");
                will.beneficiaries[_beneficiaries[i]] = _percentages[i];
                will.beneficiaryList.push(_beneficiaries[i]);
            }
        }
    
        // Update assets list
        if (_assetAddress.length > 0) {
            for (uint256 i = 0; i < will.assetList.length; i++) {
                delete will.AssetsList[will.assetList[i]];
            }
            delete will.assetList;
            
            for (uint256 i = 0; i < _assetAddress.length; i++) {
                require(_assetAddress[i] != address(0), "Invalid asset address");
                will.AssetsList[_assetAddress[i]] = _tokenName[i];
                will.assetList.push(_assetAddress[i]);
            }
        }
    
        emit WillModified(msg.sender, block.timestamp);
    }

    function revokeBeneficiary(address _beneficiary) external onlyTestator {
        require(Wills[msg.sender].isActive, "No active will");
        require(Wills[msg.sender].beneficiaries[_beneficiary] > 0, "Not a beneficiary");
    
        Will storage will = Wills[msg.sender];
        uint256 removedPercentage = will.beneficiaries[_beneficiary];
        will.beneficiaries[_beneficiary] = 0;
    
        // Remove from beneficiaryList array
        for (uint256 i = 0; i < will.beneficiaryList.length; i++) {
            if (will.beneficiaryList[i] == _beneficiary) {
                will.beneficiaryList[i] = will.beneficiaryList[will.beneficiaryList.length - 1];
                will.beneficiaryList.pop();
                break;
            }
        }
        // FALTA IMPLEMENTAR QUE SE REDISTRIBUYA AUTOMATICAMENTE EL PORCENTAJE DE LA HERENCIA DEL BENEFICIARIO ELIMINADO.
        emit BeneficiaryRevoked(msg.sender, _beneficiary, removedPercentage);
    }

    function redistributePercentages(address[] memory _beneficiaries, uint256[] memory _newPercentages) external onlyTestator {
        require(_beneficiaries.length == _newPercentages.length, "Array length mismatch");
        require(validatePercentages(_newPercentages), "Percentages must sum to 100");
    
        Will storage will = Wills[msg.sender];
    
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            require(will.beneficiaries[_beneficiaries[i]] > 0, "Invalid beneficiary");
            will.beneficiaries[_beneficiaries[i]] = _newPercentages[i];
        }
    
        emit PercentagesRedistributed(msg.sender);
    }

    function deactivateWill () external onlyTestator(){ 
        require(Wills[msg.sender].isActive, "No active will"); // Verifica que el testamento esté activo.
        Wills[msg.sender].isActive = false; // Desactiva el testamento.
        
        emit WillDeactivated (msg.sender, block.timestamp); //Emitir evento de eliminación del testamento
    }

    function claimWill (address _testatorAddress) external nonReentrant canClaim(_testatorAddress) {
        // poner verificaciones en modificador canClaim (_testatorAddress)
        //Verificar que el testamento esté activo
        //Verificar que haya pasado el tiempo de gracia
        //Set timelock para ejecución del testamento

        Will storage will = Wills[_testatorAddress]; // Obtener el testamento del testador.
        require(!will.isClaimed, "Will already claimed"); // Verificar que el testamento no haya sido reclamado.
        require(will.beneficiaries[msg.sender] > 0, "Not a beneficiary"); // Verificar que el reclamante sea un beneficiario.
        require(block.timestamp >= will.lastRenewed + will.renewPeriod + ALERT_PERIOD, "Lock period not over"); // Verificar que haya pasado el tiempo de espera.
        will.isClaimed = true; // Marcar el testamento como reclamado.
        will.claimTime = block.timestamp; // Almacenar la fecha de reclamo.
        will.claimer = msg.sender; // Almacenar la dirección del reclamante.
        
        emit ClaimExecuted(_testatorAddress, msg.sender, block.timestamp); //Emitir evento de reclamo del testamento
    }

    function executeWill (address _testatorAddress) external nonReentrant {
        //Verificar que el testamento esté activo
        //Verificar que haya pasado el tiempo de espera
        //Ejecutar transferencia de activos
        //Desactivar el testamento
        //Emitir evento de ejecución del testamento

        address testator = _testatorAddress;
    
        Will storage will = Wills[testator];
        require(will.isActive, "Will not active");
        require(will.isClaimed, "Will not claimed");
        require(block.timestamp >= will.claimTime + LOCK_PERIOD, "Lock period not over");

        // Transfer ERC20 tokens
        for (uint256 i = 0; i < will.assetList.length; i++) {
            address asset = will.assetList[i];
            if (IERC20(asset).totalSupply() > 0) {
                uint256 balance = IERC20(asset).balanceOf(testator);
                for (uint256 j = 0; j < will.beneficiaryList.length; j++) {
                    address beneficiary = will.beneficiaryList[j];
                    uint256 amount = (balance * will.beneficiaries[beneficiary]) / 100;
                    require(IERC20(asset).transferFrom(testator, beneficiary, amount), "ERC20 transfer failed");
                }
            }
        }

        /* Transfer ERC721 tokens
        for (uint256 i = 0; i < will.assetList.length; i++) {
            address asset = will.assetList[i];
            if (address(IERC721(asset)).code.length > 0) {
                IERC721 nft = IERC721(asset);
                uint256 balance = nft.balanceOf(testator);
                require(balance > 0, "No NFTs to transfer");
            
                uint256 tokensPerBeneficiary = balance / will.beneficiaryList.length;
                uint256 tokenIndex = 0;
            
                for (uint256 j = 0; j < will.beneficiaryList.length && tokenIndex < balance; j++) {
                    for (uint256 k = 0; k < tokensPerBeneficiary; k++) {
                        uint256 tokenId = nft.tokenOfOwnerByIndex(testator, tokenIndex);
                        nft.transferFrom(testator, will.beneficiaryList[j], tokenId);
                        tokenIndex++;
                    }
                }
            }
        }
        */
        will.isActive = false;
        emit WillExecuted(msg.sender, block.timestamp);
    }
    // Función para que el owner retire fondos
    function withdraw(uint256 _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Insufficient balance in contract");
        payable(owner).transfer(_amount);
    }

    // Función para obtener el balance del contrato
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}    
