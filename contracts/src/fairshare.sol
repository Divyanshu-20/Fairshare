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

    event ExpenseCreated(
        uint256 indexed expenseId,
        string title,
        uint256 amount,
        address payer
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
        require(customShares.length == _participants.length, "Custom shares length mismatch");
        uint256 total;
        for (uint256 i = 0; i < customShares.length; i++) {
            total += customShares[i];
        }
        require(total == _amount, "Custom shares must sum to total amount");

        _createExpense(_title, _participants, _amount, _payer, customShares, false);
    }

    function _createExpense(
        string calldata _title,
        address[] calldata _participants,
        uint256 _amount,
        address _payer,
        uint256[] memory _shares,
        bool _equalSplit
    ) private {
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

        emit ExpenseCreated(expenses.length - 1, _title, _amount, _payer);
    }
}
