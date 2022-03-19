const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
beforeEach(async function() {
  const TaskPool = await hre.ethers.getContractFactory("TaskPool");
  taskPool = await TaskPool.deploy();
  await taskPool.deployed();
  [owner, signer1] = await ethers.getSigners();
  owner.sendTransaction({
    to: taskPool.address,
    value: ethers.utils.parseEther("100.0")
  })
  
})

describe("Task Pool Creation and Tasks Creation", function () {
  it("Should not be reverted when the balance is enough.", async function() {
    await expect(taskPool.createTask(5, "Test Task", {from: owner.address, value:ethers.utils.parseEther("100.0")}))
    .to.be.not.reverted;
    expect(await taskPool.tasks(1)).to.be.not.null;
    let task = await taskPool.tasks(1);
    expect(task.taskId).to.equal(1);
    expect(task.description).to.equal("Test Task");
    expect(task.commissionFee).to.equal(5);
    expect(task.status).to.equal(1);
    expect(task.applier).to.be.undefined;
  });

  it("Should be reverted when the balance is not enough.", async function() {
    await expect(taskPool.createTask(5, "Test Task")).to.be.reverted;
  });

  it("Should be reverted when the task creater is not the owner of this contract.", async function() {
    await expect(taskPool.createTask(5, "Test Task", {from: signer1.address, value:ethers.utils.parseEther("100.0")})).to.be.reverted;
  });
});


describe("Task cancellation", function () {
  it("Should be reverted when the task is not active i.e the task is in status of NONE or CLOSED.", async function() {
    await expect(taskPool.cancelTaskByOwner(0)).to.be.reverted;
    await expect(taskPool.cancelTaskByOwner(1)).to.be.reverted;
  });

  it("Should be reverted when the task ID is not valid.", async function() {
    await taskPool.createTask(5, "Test Task", {from: owner.address, value:ethers.utils.parseEther("100.0")});
    await expect(taskPool.cancelTaskByOwner(2)).to.be.reverted;
  });

  it("Should not be reverted when the task is at the right status and the task ID is valid.", async function() {
    await taskPool.createTask(5, "Test Task", {value:ethers.utils.parseEther("100.0")});
    await taskPool.connect(signer1).applyTask(1);
    let task = await taskPool.tasks(1);
    expect(task.status).to.equal(1);
    await taskPool.confirmTaskTakers();
    task = await taskPool.tasks(1);
    expect(task.status).to.equal(2);
    await expect(taskPool.cancelTaskByOwner(1)).to.be.not.reverted;
  });
});


describe("Confirm Tasks", function () {
  it("Should be reverted when the sender is not the owner.", async function() {
    await taskPool.createTask(5, "Test Task", {value:ethers.utils.parseEther("100.0")});
    await expect(taskPool.confirmTaskTakers({from:signer1.getAddress()})).to.be.reverted;
  });

  it("When the sender is ther owner, applier and task should remove each other", async function() {
    await taskPool.createTask(5, "Test Task", {value:ethers.utils.parseEther("100.0")});
    await taskPool.connect(signer1).applyTask(1);
    await expect(taskPool.confirmTaskTakers()).to.not.be.reverted;
    let task = await taskPool.tasks(1);
    expect(task.taker).to.equal(await signer1.getAddress());
    expect(task.status).to.equal(2);
    let freelancer = await taskPool.freelancers(signer1.getAddress());
    expect(freelancer.isOccupying).to.be.true;
    expect(freelancer.currentTaskId).to.equal(1);
  });

  it("When the sender is ther owner, applier and task should remove each other", async function() {
    await taskPool.createTask(5, "Test Task", {value:ethers.utils.parseEther("100.0")});
    await taskPool.connect(signer1).applyTask(1);
    await expect(taskPool.confirmTaskTakers()).to.not.be.reverted;
    let task = await taskPool.tasks(1);
    expect(task.taker).to.equal(await signer1.getAddress());
    expect(task.status).to.equal(2);
  });
});

describe("Apply Task", function () {
  it("The freelancer should have 100 credit scores, and should be able to apply.", async function() {
    await expect(taskPool.createTask(5, "Test Task", {from: owner.address, value:ethers.utils.parseEther("100.0")}))
    .to.be.not.reverted;
    let task = await taskPool.tasks(1);
    await expect(task.taskId).to.equal(1);
    await expect(taskPool.connect(signer1).applyTask(1)).to.be.not.reverted;
    let addr = await signer1.getAddress();
    let fl = await taskPool.freelancers(addr);
    await expect(fl.credit).to.equal(100);
  });
});


// TODO
describe("Cancel Application", function () {
  it("Should be reverted when the task is not active i.e the task is in status of NONE or CLOSED.", async function() {
    await expect(taskPool.cancelTaskByOwner(0)).to.be.reverted;
    await expect(taskPool.cancelTaskByOwner(1)).to.be.reverted;
  });
});

describe("Cancel Ongoing Task By Freelancer", function () {
  it("Should be reverted when the task is not active i.e the task is in status of NONE or CLOSED.", async function() {
    await expect(taskPool.cancelTaskByOwner(0)).to.be.reverted;
    await expect(taskPool.cancelTaskByOwner(1)).to.be.reverted;
  });
});

