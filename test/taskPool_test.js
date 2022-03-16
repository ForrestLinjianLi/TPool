const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Task Pool Creation and Tasks Creation", function () {
  it("Should return the new greeting once it's changed", async function () {
    const TaskPool = await hre.ethers.getContractFactory("TaskPool");
    const taskPool = await TaskPool.deploy();
    await taskPool.deployed();

    const temp = await taskPool.createTask(5, "Test Task");
    // assert(temp === true, "Wrong");
    await temp.wait();
    console.log(temp)
    //expect(temp).to.be.true;
    // expect(await taskPool.tasks.call(1).isFinished).to.be.false;

    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});