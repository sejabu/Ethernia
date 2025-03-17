import { expect } from "chai";
import { ethers, network } from "hardhat";
import { Ethernia } from "../typechain-types/contracts/EtherniaV0000.sol";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
describe("EtherniaV0000", function(){
    let ethernia: Ethernia;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    beforeEach(async function name() {
        const Ethernia = await ethers.getContractFactory("Ethernia");
        [owner, addr1, addr2] = await ethers.getSigners() as unknown as SignerWithAddress[];
        ethernia = await Ethernia.deploy() as Ethernia;
        
    })
    // Test owner set 
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await ethernia.owner()).to.equal(owner.address);
        });
    });
    /* Test Registre funtion: 
     function registerUser() external {
        require(userInfo[msg.sender].wallet == address(0), "Already registered");
        userInfo[msg.sender].wallet = msg.sender;
        userInfo[msg.sender].lastLifeProof = block.timestamp;
        userInfo[msg.sender].isTestator = false;
    }*/
    describe("Register User", function () {
        it("Should register a new user", async function () {
            await ethernia.connect(addr1).registerUser();
            const userInfo = await ethernia.userInfo(addr1.address);
            expect(userInfo.isTestator).to.be.false;
            expect(userInfo.wallet).to.equal(addr1.address);
        });
        it("Should fail if user tries to register twice", async function () {
            await ethernia.connect(addr1).registerUser();
            await expect(ethernia.connect(addr1).registerUser())
                .to.be.revertedWith("Already registered");
        });
    }
   
    );
/*Test Create Will function:
     function createWill(string memory _name, uint256 _renewPeriod) external onlyUser {
        require(_renewPeriod > 0, "Invalid time period");
        willData[msg.sender].name = _name;
        willData[msg.sender].creationTime = block.timestamp;
        willData[msg.sender].renewPeriod = _renewPeriod * 1 minutes; // Set to minutes for testing, days for production
        willData[msg.sender].isActive = true;
        userInfo[msg.sender].isTestator = true;
    }
    */
    
    describe("Creating Wills", function () {
        it("Should allow a registered user to create a will", async function () {
        await ethernia.connect(addr1).registerUser();
        await ethernia.connect(addr1).createWill("My Will", 1);
        const will = await ethernia.willData(addr1.address);
        expect(will.isActive).to.be.true;
        expect(will.name).to.equal("My Will");
    });
        it("Should prevent an unregistered user from creating a will", async function () {
        await expect(ethernia.connect(addr2).createWill("My Will", 1))
            .to.be.revertedWith("Not registered");
    });

});
    describe("Adding Beneficiaries", function () {
        beforeEach(async function() {
            await ethernia.connect(addr1).registerUser();
            await ethernia.connect(addr1).createWill("Test Will", 1);
        });
        
        it("Should allow a testator to add a beneficiary", async function () {
            await ethernia.connect(addr1).addBeneficiary(addr2.address, 100);
        
            const beneficiaries = await ethernia.listBeneficiaries(addr1.address);
            expect(beneficiaries.length).to.equal(1);
            expect(beneficiaries[0].beneficiary).to.equal(addr2.address);
            expect(beneficiaries[0].percentage).to.equal(100);
});        
        it ("Should prevent a non-testator from adding a beneficiary", async function () {
            await expect(ethernia.connect(addr2).addBeneficiary(addr1.address, 100))
                .to.be.revertedWith("Not testator");
        }); 
        it("Should prevent a testator from adding a beneficiary with a percentage greater than 100", async function () {    
            await expect(ethernia.connect(addr1).addBeneficiary(addr2.address, 101))
                .to.be.revertedWith("Percentage should be a value between 0-100");
    });
        it("Should prevent a testator from adding a beneficiary with a percentage of 0", async function () {
            await expect(ethernia.connect(addr1).addBeneficiary(addr2.address, 0))
                .to.be.revertedWith("Percentage should be a value between 0-100");  
    }
    );
        it("Should allow a testador to add multiple beneficiaries", async function () {
            await ethernia.connect(addr1).addBeneficiary(addr2.address, 50);
            await ethernia.connect(addr1).addBeneficiary(owner.address, 50);
            const beneficiaries = await ethernia.listBeneficiaries(addr1.address);
            expect(beneficiaries.length).to.equal(2);
            expect(beneficiaries[0].beneficiary).to.equal(addr2.address);
            expect(beneficiaries[0].percentage).to.equal(50);
            expect(beneficiaries[1].beneficiary).to.equal(owner.address);
            expect(beneficiaries[1].percentage).to.equal(50);       
            });
        it("Should allow a testador to add more procentage to a beneficiario already resgitred", async function () {
            await ethernia.connect(addr1).addBeneficiary(addr2.address, 50);
            await ethernia.connect(addr1).addBeneficiary(addr2.address, 40);
            const beneficiaries = await ethernia.listBeneficiaries(addr1.address);
            expect(beneficiaries.length).to.equal(1);
            expect(beneficiaries[0].beneficiary).to.equal(addr2.address);
            expect(beneficiaries[0].percentage).to.equal(90);
        });
        
}); 
    describe("Renewing Life Proofe", function () {
        beforeEach(async function() {
            await ethernia.connect(addr1).registerUser();
            await ethernia.connect(addr1).createWill("Test Will", 1);
        });
        it("Should allow a testador to renew their life proof", async function () {
            const beforeRenew = await ethernia.userInfo(addr1.address);
            await ethernia.connect(addr1).renewLifeProof();
            const afterRenew = await ethernia.userInfo(addr1.address);
            expect(afterRenew.lastLifeProof).to.be.gt(beforeRenew.lastLifeProof);
        });
});  
    describe("Claiming Will", function () {
        beforeEach(async function() {
            await ethernia.connect(addr1).registerUser();
            await ethernia.connect(addr1).createWill("Test Will", 1);
            await ethernia.connect(addr1).addBeneficiary(addr2.address, 100);
            await ethernia.connect(addr2).registerUser();
  
        });
        it  ("Should allow a beneficiary to claim a will once lock period is over", async function () {
            await network.provider.send("evm_increaseTime", [120]); // Aumentar el tiempo en 120 segundos (2 minutos)
            await network.provider.send("evm_mine"); // Minar un nuevo bloque para que el cambio de tiempo tenga efecto
            await ethernia.connect(addr2).claimWill(addr1.address);
            const will = await ethernia.willData(addr1.address);
            expect(will.isClaimed).to.be.true;
            expect(will.claimer).to.equal(addr2.address);

        });
        it("Should prevent a non-beneficiary from claiming a will", async function () {
            await network.provider.send("evm_increaseTime", [120]); // Aumentar el tiempo en 120 segundos (2 minutos)
            await network.provider.send("evm_mine")
            await expect(ethernia.connect(owner).claimWill(addr1.address))
                .to.be.revertedWith("Not registered");
        });
        it("Should prevent a beneficiary from claiming a will twice", async function () {
            await network.provider.send("evm_increaseTime", [120]); // Aumentar el tiempo en 120 segundos (2 minutos)
            await network.provider.send("evm_mine")
            await ethernia.connect(addr2).claimWill(addr1.address);
            await expect(ethernia.connect(addr2).claimWill(addr1.address))
                .to.be.revertedWith("Will already claimed");
        });

       /* Esto probarlo después de implementar la función deactivateWill
        it("Should fail to claim a will if it is not active", async function () {
            // Desactivar el testamento primero
            await ethernia.connect(addr1).deactivateWill(); // Asumiendo que existe esta función
            await expect(ethernia.connect(addr2).claimWill(addr1.address))
                .to.be.revertedWith("Will not active");
        });*/

 
        it("Should fail to claim a will if the lock period is still active", async function () {
            // Resetear el tiempo para que el período de bloqueo siga activo
            await expect(ethernia.connect(addr2).claimWill(addr1.address)) 
                .to.be.revertedWith("Lock period still active.");
        });


    
}    
    );
    describe("Delete Will", function () {
        beforeEach(async function () {
            await ethernia.connect(addr1).registerUser();
            await ethernia.connect(addr2).registerUser();
            await ethernia.connect(addr1).createWill("My Will", 1);
        });

        it("Should delete the will and reset the testator status", async function () {
            await expect(ethernia.connect(addr1).deleteWill())
                .to.emit(ethernia, "WillDeleted")
                .withArgs(addr1.address);

            const will = await ethernia.willData(addr1.address);
            const user = await ethernia.userInfo(addr1.address);

            expect(will.name).to.equal("");
            expect(user.isTestator).to.be.false;
        });

        it("Should prevent non-testators from deleting a will", async function () {
            await expect(ethernia.connect(addr2).deleteWill()).to.be.revertedWith("Not testator");
        });

    
        it("Should prevent deleting a will that is already claimed", async function () {
            await ethernia.connect(addr1).addBeneficiary(addr2.address, 50);
            await network.provider.send("evm_increaseTime", [3600]); // Aumentar el tiempo en 1 hora
            await network.provider.send("evm_mine"); // Minar un nuevo bloque para que el cambio de tiempo tenga efecto
            await ethernia.connect(addr2).claimWill(addr1.address);
            await expect(ethernia.connect(addr1).deleteWill()).to.be.revertedWith("Will already claimed");
        });
    });
    });
