// SPDX-License-Identifier: MIT
// Author: Linjian Li, Yue Zhang, Haofeng Feng, Yubo Wang

pragma solidity ^0.7.6;

contract TaskPool {
    address payable public _owner;
    // address[] public tasks;
    // The minimal donate amount
    uint public minimalDonateAmount = 1 ether;

    constructor() payable{
        _owner = msg.sender;
    }

    // The Item that waiting for auction
    struct Task {
        uint taskId;
        address taker;
        string description;
        uint commissionFee;
        uint256 deadline;
        bool isFinished;
        address[] applier;
    }

    // The credit system
    struct Freelancer {
        bool isExistedUser;
        bool isOccupying;
        uint currentTaskId;
        uint credit;
        uint[] history;
        uint[] appliedTasks;
    }

    // The task taker for each task
    mapping (address => Freelancer) public freelancers;
    mapping (uint => Task) public tasks;

    event createdTask(address _from);
    event cancel(address _from);

    /**
    create the task by the owner
     */
    function createTask(uint256 price, string content) public returns (bool) {

    }

    /**
    cancel the task by the owner, the task is allowed to be canceled when it is uncompleted.
    If the task is in status of ongoing, the owner shall be deducted half of the commision fee
    */
    function cancelTaskByOwner(uint taksId) public returns (bool) {

    }
    
    function getOngoingTasks() public returns (Task[]) {

    }

    function getCompletedTasks() public returns (Task[]) {

    }

    function getAllTasks() public returns (Task[]) {

    }


    function getTodoTasks() public returns (Task[]) {

    }

    /**
    Confirm the task takers of all the tasks based on the freelancers' credits
     */
    function confirmTaskTakers() public returns (bool){

    }

    function getBalance() public returns (uint256) {

    }

    /**
    Apply task by freelancer
     */
    function applyTask(uint taskId) public {

    }

    /**
    Cancel the task application by the freelancer
     */
    function cancelApplication(uint taskId) public returns (bool) {

    }

    /**
    Cancel the ongoing task by the freelancer, and the freelancer shall not recieve any 
    commision fee, and gain panelty on credits.
     */
    function cancelOngoingTaskByFreelancer(uint taskId) public returns (Task[]) {

    }



}