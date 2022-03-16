// SPDX-License-Identifier: MIT
// Author: Linjian Li, Yue Zhang, Haofeng Feng, Yubo Wang

pragma solidity ^0.7.6;

contract TaskPool {
    address payable public _owner;
    // address[] public tasks;
    // The minimal donate amount
    uint public minimalDonateAmount = 1 ether;

    uint256 counter;

    constructor() payable{
        _owner = msg.sender;
        counter = 1;
    }

   
    /**
    status = 0 means the task is available 
    status = 1 means the task is ongoing
    status = 2 means the task is completed
     */
    struct Task {
        uint taskId;
        address taker;
        string description;
        uint commissionFee;
        uint256 deadline;
        uint status;
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

    modifier isOwner {
        require(msg.sender == _owner, "Only owner can create tasks!!!");
        _;
    }

    modifier isTaskCompleted {
        
    }

    /**
    create the task by the owner
     */
    function createTask(uint256 price, string calldata content) public isOwner returns(bool){
        tasks[counter].taskId = counter;
        tasks[counter].taker = address(0);
        tasks[counter].description = content;
        tasks[counter].commissionFee = price;
        tasks[counter].status = 0;
        // tasks[counter].applier = [];
        return true;
    }

    /**
    cancel the task by the owner, the task is allowed to be canceled when it is uncompleted.
    If the task is in status of ongoing, the owner shall be deducted half of the commision fee
    */
    function cancelTaskByOwner(uint taskId) public returns (bool) {
        const _status = tasks[taskId].status;
        require(_status != 2, "The task has been completed, you cannot cancel it now");
        if (_status == 0) {
            require(address(this).balance >= tasks[taskId].commissionFee);
            _owner.transfer(tasks[taskId].commissionFee);
        } else {
            require(address(this).balance >= (tasks[taskId].commissionFee)*0.5);
            _owner.transfer(tasks[taskId].commissionFee * 0.5);
        }
        return true;
    }
    
    // function getOngoingTasks() public returns (Task[] memory) {

    // }

    // function getCompletedTasks() public returns (Task[] memory) {

    // }

    // function getAllTasks() public returns (Task[] memory) {

    // }


    // function getTodoTasks() public returns (Task[] memory) {

    // }

    /**
    Confirm the task takers of all the tasks based on the freelancers' credits
     */
    function confirmTaskTakers() public returns (bool){

    }

    // function getBalance() public returns (uint256) {

    // }

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
    function cancelOngoingTaskByFreelancer(uint taskId) public {

    }

    function balanceOfContract() public view returns (uint256) {
        return address(this).balance;
    }



}