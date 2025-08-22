//SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Fairshare {
    struct Expense {
        string title;
        address[] participants;
        uint256 amount;
        address payer;
        uint256 timestamp;
        bool settled;
        uint256[] everyonesShares;
        bool equalSplit;
    }

    Expense[] public expenses;
    mapping(address => Expense[]) public expensesByPayer;
    mapping(uint256 => mapping(address => uint256)) public shareOf;
    //ExpenseId => address => share

    event ExpenseCreated(
        uint256 indexed expenseId,
        string title,
        uint256 amount,
        address payer
    );

    event ExpenseSettled(
        uint256 indexed expenseId,
        string title,
        uint256 amount,
        bool settled
    );

    function createExpenseWithEqualSplit(
        string calldata _title,
        address[] calldata _participants,
        uint256 _amount,
        address _payer
    ) public {
        uint256 individualShare = _amount / _participants.length;
        uint256[] memory shares = new uint256[](_participants.length);
        for (uint256 i = 0; i < _participants.length; i++) {
            shares[i] = individualShare;
        }

        _createExpense(_title, _participants, _amount, _payer, shares, true);
    }

    function createExpenseWithCustomSplit(
        string calldata _title,
        address[] calldata _participants,
        uint256 _amount,
        address _payer,
        uint256[] calldata customShares
    ) public {
        require(
            customShares.length == _participants.length,
            "Custom shares length mismatch"
        );
        uint256 total;
        for (uint256 i = 0; i < customShares.length; i++) {
            total += customShares[i];
        }
        require(total == _amount, "Custom shares must sum to total amount");

        _createExpense(
            _title,
            _participants,
            _amount,
            _payer,
            customShares,
            false
        );
    }

    function _createExpense(
        string calldata _title,
        address[] calldata _participants,
        uint256 _amount,
        address _payer,
        uint256[] memory _shares,
        bool _equalSplit
    ) private {
        uint256 expenseId = expenses.length;
        expenses.push(
            Expense({
                title: _title,
                participants: _participants,
                amount: _amount,
                payer: _payer,
                timestamp: block.timestamp,
                settled: false,
                everyonesShares: _shares,
                equalSplit: _equalSplit
            })
        );

        // Need to always populate mappings
        for (uint256 i = 0; i < _participants.length; i++) {
            shareOf[expenseId][_participants[i]] = _shares[i];
        }

        emit ExpenseCreated(expenseId, _title, _amount, _payer);
    }

    function payShare(uint256 _expenseId) public payable {
        Expense storage currentExpense = expenses[_expenseId];
        uint256 senderShare = shareOf[_expenseId][msg.sender];
        address payable payer = payable(currentExpense.payer);
        require(!currentExpense.settled, "Expense already settled");
        require(senderShare > 0, "You are not a participant");
        require(
            senderShare == msg.value,
            "Incorrect amount: Pay your exact share"
        );

        (bool success, ) = payer.call{value: senderShare}("");
        require(success, "Payment to payer failed");

        shareOf[_expenseId][msg.sender] = 0;
    }

    function hasEveryonePaid(uint256 _expenseId) public view returns (bool) {
        Expense storage expense = expenses[_expenseId];
        for (uint i = 0; i < expense.participants.length; i++) {
            if (shareOf[_expenseId][expense.participants[i]] > 0) {
                return false; // Found someone who hasn't paid
            }
        }
        return true; // All shares are 0, meaning everyone paid
    }

    modifier onlyPayer(uint256 _expenseId) {
        require(expenses[_expenseId].payer == msg.sender, "Only payer can call this");
        _;
    }

    function settleExpense(uint256 _expenseId) public onlyPayer(_expenseId) {
        Expense storage currentExpense = expenses[_expenseId];
        require(!currentExpense.settled, "Expense already settled");
        require(
            hasEveryonePaid(_expenseId),
            "Not everyone has paid their share"
        );

        // Mark as settled and handle the rest...
        currentExpense.settled = true;
        // Add event emission here
        emit ExpenseSettled(
            _expenseId, 
            currentExpense.title, 
            currentExpense.amount, 
            true  
        );
    }
}
