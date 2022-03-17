// SPDX-License-Identifier: MIT
// Author: Linjian Li, Yue Zhang, Haofeng Feng, Yubo Wang

pragma solidity ^0.7.6;

contract TaskPool {
    address payable public _owner;
    // address[] public tasks;
    // The minimal donate amount
    uint public minimalDonateAmount = 1 ether;

    uint256 counter;
    uint256 activeTaskCounter; // The counter of active tasks (todoTask and ongoingTask).

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
        require(tasks[taskId].status >= TaskStatus.FINISHED, "Task is done!");
        _;
    }

    modifier isTaskActive(uint taskId) {
        require(tasks[taskId].status == TaskStatus.TODO || tasks[taskId].status == TaskStatus.ONGOING , "Task is not active!");
        _;
    }

    modifier isValidTaskID(uint taskId){
        require(taskId <= counter && taskId > 0, "Invalid Task ID");
        _;
    }
    

    modifier beforeAssignTaskTaker(uint taskId, address flId) {
        require(tasks[taskId].status <= TaskStatus.ONGOING, "Task is already taken!");
        require(tasks[taskId].status != TaskStatus.NONE, "Task does not exist!");
        require(freelancers[flId].isOccupying, "The task taker has another ongoing task, each task taker can only have one task");
        _;
    }

    /**
    Create the task by the owner.
     */
    function createTask(uint256 price, string calldata content) public payable isOwner {
        tasks[counter].taskId = counter;
        tasks[counter].taker = address(0);
        tasks[counter].description = content;
        tasks[counter].commissionFee = price;
        tasks[counter].status = TaskStatus.TODO;
        counter+=1;
        activeTaskCounter+=1;
    }

    /**
    cancel the task by the owner, the task is allowed to be canceled when it is uncompleted.
    If the task is in status of ongoing, the owner shall be deducted half of the commision fee
    */
    function cancelTaskByOwner(uint taskId) public isTaskCompleted(taskId) {
        require(taskId < counter && taskId > 0, "Invalid Task ID");
        TaskStatus _status = tasks[taskId].status;
        
        if (_status == TaskStatus.TODO) {
            require(address(this).balance >= tasks[taskId].commissionFee);
            _owner.transfer(tasks[taskId].commissionFee);
        } else if (_status == TaskStatus.ONGOING) {
            require(address(this).balance >= (tasks[taskId].commissionFee)/2);
            _owner.transfer(tasks[taskId].commissionFee / 2);
        }
        tasks[taskId].status = TaskStatus.CLOSED;
        activeTaskCounter-=1;
    }

    /**
    Confirm the task takers of all the tasks based on the freelancers' credits
     */
    function confirmTaskTakers() public isOwner {
        
        // Note that task ID starts from 1.
        for(uint i=1; i<=counter; i++){
            TaskStatus _status = tasks[i].status;

            // Only confirm takers when the task status is "to do".
            if(_status == TaskStatus.TODO){
                address[] storage curApplier = tasks[i].applier;
                if(curApplier.length > 0){
                    uint highestCreditSoFar = 0;
                    address bestApplier = address(0);
                    // Looking for the best applier with the highest credit to be the task taker.
                    for(uint j=0; j<curApplier.length; j++){
                        Freelancer storage f = freelancers[curApplier[j]];
                        // Only when the applier is not occupied:
                        if(!f.isOccupying && f.credit > highestCreditSoFar){
                            highestCreditSoFar = f.credit;
                            bestApplier = curApplier[j];
                        }
                        // Remove the tasks[i] from the all the appliers' applied tasks.
                        uint[] storage curApplierTasks = f.appliedTasks;
                        for (uint k = 0; k < curApplierTasks.length;k++) {
                            if(curApplierTasks[k] == tasks[i].taskId) {
                                delete curApplierTasks[k];
                                break;
                            }
                        }
                    }

                    //Update the task's attributes.
                    //TODO: Handling due date.
                    tasks[i].taker = bestApplier;
                    tasks[i].status = TaskStatus.ONGOING;
    

                    // Update the taker's attributes.

                    freelancers[bestApplier].isOccupying = true;
                    freelancers[bestApplier].currentTaskId = i;
                    freelancers[bestApplier].history.push(tasks[i].taskId);
                }
            }
        }
        
        
    }

    function newFreelancer(uint taskId, address freelancer) internal {
        Freelancer storage f = freelancers[freelancer];
        f.isExistedUser = true;
        f.appliedTasks.push(taskId);
        f.credit = 100;
        f.isOccupying = false;
    }

    /**
    Apply task by freelancer
     */
    function applyTask(uint taskId) public beforeAssignTaskTaker(taskId, msg.sender) {
        Task storage task = tasks[taskId];
        task.applier.push(msg.sender);
    }
    /**
    Cancel the task application by the freelancer
     */
    function cancelApplication(uint taskId) public beforeAssignTaskTaker(taskId, msg.sender) {
        Task storage task = tasks[taskId];
        for (uint i = 0; i < task.applier.length; i++) {
            if (task.applier[i] == msg.sender) {
                delete task.applier[i];
                break;
            }
        }
    }

    /**
    Cancel the ongoing task by the freelancer, and the freelancer shall not recieve any 
    commision fee, and gain panelty on credits.
     */
    function cancelOngoingTaskByFreelancer(uint taskId) public {
        require(tasks[taskId].status == TaskStatus.ONGOING, "The task status should be ongoing.");
        Freelancer storage freelancer = freelancers[msg.sender];
        require(freelancer.currentTaskId == taskId, "The current task that this freelance is taking does not match this task.");
        freelancer.currentTaskId = 0;
        freelancer.isOccupying = false;
        freelancer.credit -= panelty;
        tasks[taskId].status = TaskStatus.CLOSED;
    }

    function balanceOfContract() public view returns (uint256) {
        return address(this).balance;
    }

    // function getOngoingTasks() public returns (Task[] memory) {

    // }

    // function getCompletedTasks() public returns (Task[] memory) {

    // }

    // function getAllTasks() public returns (Task[] memory) {

    // }

    // function getTodoTasks() public returns (Task[] memory) {

    // }

    // function getBalance() public returns (uint256) {

    // }
}