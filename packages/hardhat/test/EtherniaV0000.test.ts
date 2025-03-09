import { expect } from "chai";
import { ethers } from "hardhat";
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

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await ethernia.owner()).to.equal(owner.address);
        });
    });

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



});