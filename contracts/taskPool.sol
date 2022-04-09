// SPDX-License-Identifier: MIT
// Author: Linjian Li, Yue Zhang, Haofeng Feng, Yubo Wang

pragma solidity ^0.7.6;

contract TaskPool {
    address payable public _owner;
    // address[] public tasks;
    // The minimal donate amount
    uint public minimalDonateAmount = 1 ether;

    uint256 public counter;
    uint256 public activeTaskCounter; // The counter of active tasks (todoTask and ongoingTask).
    uint256 constant panelty = 1;
    uint256 reward = 1;

    constructor() payable {
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

    modifier isNotOwner {
        require(msg.sender != _owner, "Only freelancer can operate this!!!");
        _;
    }

    modifier isTaskOnGoing(uint taskId) {
        require(tasks[taskId].status == TaskStatus.ONGOING, "Task has to be Ongoing!");
        _;
    }

    modifier isTaskFinished(uint taskId) {
        require(tasks[taskId].status == TaskStatus.FINISHED, "Task has to be finished first!");
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

    modifier isSufficientBalance(uint price){
        require(msg.value >= price, "The balance is insufficient!");
        _;
    }

    modifier beforeAssignTaskTaker(uint taskId, address flId) {
        require(tasks[taskId].status < TaskStatus.ONGOING, "Task is already taken!");
        require(tasks[taskId].status != TaskStatus.NONE, "Task does not exist!");
        require(!freelancers[flId].isOccupying, "The task taker has another ongoing task, each task taker can only have one task");
        _;
    }

    /**
    Create the task by the owner.
     */
    function createTask(uint256 price, string calldata content) external payable isOwner isSufficientBalance(price)  {
        tasks[counter].taskId = counter;
        tasks[counter].taker = address(0);
        tasks[counter].description = content;
        tasks[counter].commissionFee = price;
        tasks[counter].status = TaskStatus.TODO;
        counter+=1;
        activeTaskCounter+=1;
        msg.sender.transfer(msg.value - price);
    }

    /**
    cancel the task by the owner, the task is allowed to be canceled when it is uncompleted.
    If the task is in status of ongoing, the owner shall be deducted half of the commision fee
    */
    function cancelTaskByOwner(uint taskId) external isTaskActive(taskId) isValidTaskID(taskId){
        
        TaskStatus _status = tasks[taskId].status;
        
        if (_status == TaskStatus.TODO) {
            require(address(this).balance >= tasks[taskId].commissionFee);
            _owner.transfer(tasks[taskId].commissionFee);
        } else if (_status == TaskStatus.ONGOING) {
            require(address(this).balance >= (tasks[taskId].commissionFee)/2);
            _owner.transfer(tasks[taskId].commissionFee / 2);
            freelancers[tasks[taskId].taker].isOccupying = false;
            payable(tasks[taskId].taker).transfer(tasks[taskId].commissionFee / 2);
        }
        tasks[taskId].status = TaskStatus.CLOSED;
        activeTaskCounter-=1;
    }

    /**
    Confirm the task takers of all the tasks based on the freelancers' credits
     */
    function confirmTaskTakers() external isOwner {
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
    /**
    taskId is unused, need to delete. Ask Manager Li for permission!!
     */
    function newFreelancer(address freelancer) internal {
        Freelancer storage f = freelancers[freelancer];
        f.isExistedUser = true;
        // f.appliedTasks.push(taskId);
        f.credit = 100;
        f.isOccupying = false;
    }

    /**
    Apply task by freelancer
     */
    function applyTask(uint taskId) external isNotOwner beforeAssignTaskTaker(taskId, msg.sender) {
        if (!freelancers[msg.sender].isExistedUser) {
            newFreelancer(msg.sender);
        }
        // Push the task here
        Freelancer storage f = freelancers[msg.sender];
        
        //Check if the f has applied for the same task already:
        bool doesListContainElement = false;
        for (uint i=0; i < f.appliedTasks.length; i++) {
            if (taskId == f.appliedTasks[i]) {
                doesListContainElement = true;
            }
        }

        if(!doesListContainElement){
            f.appliedTasks.push(taskId);
            Task storage task = tasks[taskId];
            task.applier.push(msg.sender);
        }
    }
    /**
    Cancel the task application by the freelancer
     */
    function cancelApplication(uint taskId) external beforeAssignTaskTaker(taskId, msg.sender) {
        Task storage task = tasks[taskId];
        for (uint i = 0; i < task.applier.length; i++) {
            if (task.applier[i] == msg.sender) {
                delete task.applier[i];
                break;
            }
        }
        uint[] storage appliedTasks = freelancers[msg.sender].appliedTasks;
        for (uint i = 0; i < appliedTasks.length; i++) {
            if (appliedTasks[i] == taskId) {
                delete appliedTasks[i];
                break;
            }
        }

    }

    /**
    Cancel the ongoing task by the freelancer, and the freelancer shall not recieve any 
    commision fee, and gain panelty on credits.
     */
    function cancelOngoingTaskByFreelancer(uint taskId) external {
        require(tasks[taskId].status == TaskStatus.ONGOING, "The task status should be ongoing.");
        Freelancer storage freelancer = freelancers[msg.sender];
        require(freelancer.currentTaskId == taskId, "The current task that this freelance is taking does not match this task.");
        freelancer.currentTaskId = 0;
        freelancer.isOccupying = false;
        freelancer.credit -= panelty;
        tasks[taskId].status = TaskStatus.TODO;
        tasks[taskId].taker = address(0);
        uint i = 0;
        while (i < tasks[taskId].applier.length) {
            if (tasks[taskId].applier[i] == msg.sender) {
                tasks[taskId].applier[i] = tasks[taskId].applier[tasks[taskId].applier.length - 1];
                tasks[taskId].applier.pop();
                break;
            }
            i++;
        }
    }

    function finishTask(uint taskId) external isValidTaskID(taskId) isTaskOnGoing(taskId) {
        require(taskId == freelancers[msg.sender].currentTaskId, "This task is taken by someone else.");
        tasks[taskId].status = TaskStatus.FINISHED;
    }

    function confirmFinishedTask(uint taskId) external isOwner isValidTaskID(taskId) isTaskFinished(taskId){
        Task storage task = tasks[taskId];
        task.status = TaskStatus.CLOSED;
        Freelancer storage freelancer = freelancers[task.taker];
        freelancer.isOccupying = false;
        freelancer.currentTaskId = 0;
        // reward the freelancer with commission fee and credit score
        freelancer.credit += reward;
        payable(task.taker).transfer(task.commissionFee);
    }

    // Return the balance of this contract
    function balanceOfContract() external view returns (uint256) {
        return address(this).balance;
    }

    // Return the applied tasks of a particular freelancer
    function getAppliedTaskFreelancer(address freelancer) public view returns(uint[] memory) {
        return freelancers[freelancer].appliedTasks;
    }

    // Return the history of a particular freelancer
    function getHistoryFreelancer(address freelancer) public view returns(uint[] memory) {
        return freelancers[freelancer].history;
    }

    // Return the appliers of a particular task
    function getApplierTasks(uint taskId) public view returns(address[] memory) {
        return tasks[taskId].applier;
    }

    function getOwnerAddress() public view returns(address) {
        return _owner;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}