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

    enum TaskStatus{ NONE, TODO, ONGOING, FINISHED, CLOSED }
    TaskStatus constant defaultTaksStatus = TaskStatus.NONE;

    struct Task {
        uint taskId;
        address taker;
        string description;
        uint commissionFee;
        uint256 deadline;
        TaskStatus status;
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

    uint taskCount;
    event createdTask(address _from);
    event cancel(address _from);

    modifier isOwner {
        require(msg.sender == _owner, "Only owner can operate this!!!");
        _;
    }

    modifier isTaskCompleted(uint taskId) {
<<<<<<< HEAD
        require(tasks[taskId].status == TaskStatus.FINISHED, "The task is not completed yet!!!");
=======
        require(tasks[taskId].status >= TaskStatus.FINISHED, "Task is in progress!");
        _;
    }

    modifier beforeAssignTaskTaker(uint taskId, address flId) {
        require(tasks[taskId].status <= TaskStatus.ONGOING, "Task is already taken!");
        require(tasks[taskId].status != TaskStatus.NONE, "Task does not exist!");
        require(freelancers[flId].isOccupying, "The task taker has another ongoing task, each task taker can only have one task");
>>>>>>> 0122b460b88472bade4cf27caf6425fd2a7ace73
        _;
    }

    /**
    create the task by the owner
     */
    function createTask(uint256 price, string calldata content) public isOwner returns(bool){
        tasks[counter].taskId = counter;
        tasks[counter].taker = address(0);
        tasks[counter].description = content;
        tasks[counter].commissionFee = price;
        tasks[counter].status = TaskStatus.TODO;
        counter+=1;
        return true;
    }

    /**
    cancel the task by the owner, the task is allowed to be canceled when it is uncompleted.
    If the task is in status of ongoing, the owner shall be deducted half of the commision fee
    */
    function cancelTaskByOwner(uint taskId) public isTaskCompleted(taskId) returns (bool) {
        require(taskId < counter && taskId > 0, "Invalid Task ID");
        TaskStatus _status = tasks[taskId].status;
<<<<<<< HEAD
        require(_status == TaskStatus.TODO || _status == TaskStatus.ONGOING, "The task has been closed or finished, you cannot cancel it now");
        
=======
>>>>>>> 0122b460b88472bade4cf27caf6425fd2a7ace73
        if (_status == TaskStatus.TODO) {
            require(address(this).balance >= tasks[taskId].commissionFee);
            _owner.transfer(tasks[taskId].commissionFee);
        } else if (_status == TaskStatus.ONGOING) {
            require(address(this).balance >= (tasks[taskId].commissionFee)/2);
            _owner.transfer(tasks[taskId].commissionFee / 2);
        }
        _status = TaskStatus.CLOSED;
        
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
    function confirmTaskTakers() public returns (bool) isOwner(){
        
    }

    // function getBalance() public returns (uint256) {

    // }

    /**
    Apply task by freelancer
     */
    function applyTask(uint taskId) public beforeAssignTaskTaker(taskId, msg.sender) {
        Task storage task = tasks[taskId];
        for (uint i = 0; i < task.applier.length; i++) {
            if (task.applier[i] == msg.sender) {
                delete task.applier[i];
                break;
            }
        }
    }
    /**
    Cancel the task application by the freelancer
     */
    function cancelApplication(uint taskId) public beforeAssignTaskTaker(taskId, msg.sender) returns (bool) {
        Task storage task = tasks[taskId];
        task.applier.push(msg.sender);
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