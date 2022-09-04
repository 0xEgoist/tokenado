const { expect } = require("chai");
const { defaultAccounts } = require("ethereum-waffle");
const { ethers } = require("hardhat");
let accounts;
let MyTokenWithPresale;
let myTokenWithPresale;

describe("MyTokenWithPresale", function () {

  it("Contract should be successfully deployed", async function () {
    accounts = await ethers.getSigners();
    MyTokenWithPresale = await ethers.getContractFactory("MyTokenWithPresale");
    myTokenWithPresale = await MyTokenWithPresale.deploy();
    await myTokenWithPresale.deployed();
    expect(await myTokenWithPresale.owner()).to.equal(accounts[0].address);
  });

  it("The presale is not open yet, the function buyOnPresale should be reverted", async function () {
    const amount = new ethers.BigNumber.from(10).pow(18).mul(1);
    await expect(myTokenWithPresale.connect(accounts[1]).buyOnPresale({ value: amount})).to.be.revertedWith("Presale has not started yet or has already ended!");
  });

  it("Only the owner can open the presale", async function () {
    await expect(myTokenWithPresale.connect(accounts[1]).setStage(1)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("The first stage of the presale should be installed", async function () {
    await myTokenWithPresale.connect(accounts[0]).setStage(1);
    expect(await myTokenWithPresale.stage()).to.equal(1);
  });

  it("The user should successfully buy tokens on the 1st presale stage", async function () {
    const amount = new ethers.BigNumber.from(10).pow(18).mul(1);
    const balance = new ethers.BigNumber.from(10).pow(18).mul(20);
    await myTokenWithPresale.connect(accounts[1]).buyOnPresale({ value: amount });
    expect(await myTokenWithPresale.balanceOf(accounts[1].address)).to.equal(balance);
  });

  it("The second stage of the presale should be installed", async function () {
    await myTokenWithPresale.connect(accounts[0]).setStage(2);
    expect(await myTokenWithPresale.stage()).to.equal(2);
  });

  it("The user should successfully buy tokens on the 2nd presale stage", async function () {
    const amount = new ethers.BigNumber.from(10).pow(18).mul(1);
    const balance = new ethers.BigNumber.from(10).pow(18).mul(10);
    await myTokenWithPresale.connect(accounts[2]).buyOnPresale({ value: amount });
    expect(await myTokenWithPresale.balanceOf(accounts[2].address)).to.equal(balance);
  });

  it("presaleCounter should be equal 1000", async function () {
    const amount = new ethers.BigNumber.from(10).pow(18).mul(97);
    const presaleCounter = new ethers.BigNumber.from(10).pow(18).mul(1000);
    await myTokenWithPresale.connect(accounts[3]).buyOnPresale({ value: amount });
    expect(await myTokenWithPresale.presaleCounter()).to.equal(presaleCounter);
  });

  it("Function buyOnPresale should be reverted with Final presale supply reached!", async function () {
    const amount = new ethers.BigNumber.from(10).pow(18).mul(1);
    await expect(myTokenWithPresale.connect(accounts[4]).buyOnPresale({ value: amount })).to.be.revertedWith("Final presale supply reached!");
  });

});
