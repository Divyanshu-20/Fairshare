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
        uint256[] everyonesShares; // [individual share, individual share, individual share]
        bool equalSplit;
    }

    Expense[] public expenses;

    event ExpenseCreated(
        uint256 indexed expenseId,
        string title,
        uint256 amount,
        address payer
    );

    function createExpense(
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

        expenses.push(
            Expense({
                title: _title,
                participants: _participants,
                amount: _amount,
                payer: _payer,
                timestamp: block.timestamp,
                settled: false,
                everyonesShares: shares,
                equalSplit: true
            })
        );

        emit ExpenseCreated(expenses.length - 1, _title, _amount, _payer);
    }

    function payShare() public {}
}
