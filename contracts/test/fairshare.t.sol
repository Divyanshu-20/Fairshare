//SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import {Fairshare} from "../src/fairshare.sol";

contract FairshareTest is Test {
    Fairshare public fairshare;
    
    address public alice = address(0x1);
    address public bob = address(0x2);
    address public charlie = address(0x3);
    address public dave = address(0x4);
    
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

    function setUp() public {
        fairshare = new Fairshare();
        
        // Fund test accounts
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(charlie, 100 ether);
        vm.deal(dave, 100 ether);
    }

    // Test expense creation with equal split
    function testCreateExpenseWithEqualSplit() public {
        address[] memory participants = new address[](3);
        participants[0] = alice;
        participants[1] = bob;
        participants[2] = charlie;
        
        vm.expectEmit(true, false, false, true);
        emit ExpenseCreated(0, "Dinner", 3 ether, alice);
        
        fairshare.createExpenseWithEqualSplit("Dinner", participants, 3 ether, alice);
        
        // Check expense details using individual calls since struct getter is complex
        // We'll test the mapping directly instead of the struct getter
        assertEq(fairshare.shareOf(0, alice) > 0, true); // Alice has a share
        assertEq(fairshare.shareOf(0, bob) > 0, true);   // Bob has a share
        assertEq(fairshare.shareOf(0, charlie) > 0, true); // Charlie has a share
        
        // Check individual shares
        assertEq(fairshare.shareOf(0, alice), 1 ether);
        assertEq(fairshare.shareOf(0, bob), 1 ether);
        assertEq(fairshare.shareOf(0, charlie), 1 ether);
    }

    // Test expense creation with custom split
    function testCreateExpenseWithCustomSplit() public {
        address[] memory participants = new address[](3);
        participants[0] = alice;
        participants[1] = bob;
        participants[2] = charlie;
        
        uint256[] memory customShares = new uint256[](3);
        customShares[0] = 1.5 ether;
        customShares[1] = 1 ether;
        customShares[2] = 0.5 ether;
        
        fairshare.createExpenseWithCustomSplit("Groceries", participants, 3 ether, bob, customShares);
        
        // Check shares
        assertEq(fairshare.shareOf(0, alice), 1.5 ether);
        assertEq(fairshare.shareOf(0, bob), 1 ether);
        assertEq(fairshare.shareOf(0, charlie), 0.5 ether);
    }

    // Test custom split validation
    function testCreateExpenseWithCustomSplitInvalidLength() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        
        uint256[] memory customShares = new uint256[](3); // Wrong length
        customShares[0] = 1 ether;
        customShares[1] = 1 ether;
        customShares[2] = 1 ether;
        
        vm.expectRevert("Custom shares length mismatch");
        fairshare.createExpenseWithCustomSplit("Test", participants, 3 ether, alice, customShares);
    }

    function testCreateExpenseWithCustomSplitInvalidSum() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        
        uint256[] memory customShares = new uint256[](2);
        customShares[0] = 1 ether;
        customShares[1] = 1 ether; // Sum is 2 ether, but total is 3 ether
        
        vm.expectRevert("Custom shares must sum to total amount");
        fairshare.createExpenseWithCustomSplit("Test", participants, 3 ether, alice, customShares);
    }

    // Test paying shares
    function testPayShare() public {
        // Create expense
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        
        fairshare.createExpenseWithEqualSplit("Lunch", participants, 2 ether, alice);
        
        // Bob pays his share
        uint256 aliceBalanceBefore = alice.balance;
        
        vm.prank(bob);
        fairshare.payShare{value: 1 ether}(0);
        
        // Check that alice received the payment
        assertEq(alice.balance, aliceBalanceBefore + 1 ether);
        
        // Check that bob's share is now 0
        assertEq(fairshare.shareOf(0, bob), 0);
    }

    function testPayShareIncorrectAmount() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        
        fairshare.createExpenseWithEqualSplit("Lunch", participants, 2 ether, alice);
        
        vm.prank(bob);
        vm.expectRevert("Incorrect amount: Pay your exact share");
        fairshare.payShare{value: 0.5 ether}(0); // Wrong amount
    }

    function testPayShareNotParticipant() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        
        fairshare.createExpenseWithEqualSplit("Lunch", participants, 2 ether, alice);
        
        vm.prank(dave); // Dave is not a participant
        vm.expectRevert("You are not a participant");
        fairshare.payShare{value: 1 ether}(0);
    }

    function testPayShareAlreadySettled() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        
        fairshare.createExpenseWithEqualSplit("Lunch", participants, 2 ether, alice);
        
        // Pay all shares
        vm.prank(alice);
        fairshare.payShare{value: 1 ether}(0);
        
        vm.prank(bob);
        fairshare.payShare{value: 1 ether}(0);
        
        // Settle expense
        vm.prank(alice);
        fairshare.settleExpense(0);
        
        // Try to pay again after settlement
        vm.prank(alice);
        vm.expectRevert("Expense already settled");
        fairshare.payShare{value: 1 ether}(0);
    }

    // Test hasEveryonePaid function
    function testHasEveryonePaid() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        
        fairshare.createExpenseWithEqualSplit("Lunch", participants, 2 ether, alice);
        
        // Initially, not everyone has paid
        assertEq(fairshare.hasEveryonePaid(0), false);
        
        // Alice pays
        vm.prank(alice);
        fairshare.payShare{value: 1 ether}(0);
        
        // Still not everyone has paid
        assertEq(fairshare.hasEveryonePaid(0), false);
        
        // Bob pays
        vm.prank(bob);
        fairshare.payShare{value: 1 ether}(0);
        
        // Now everyone has paid
        assertEq(fairshare.hasEveryonePaid(0), true);
    }

    // Test settling expense
    function testSettleExpense() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        
        fairshare.createExpenseWithEqualSplit("Lunch", participants, 2 ether, alice);
        
        // Pay all shares
        vm.prank(alice);
        fairshare.payShare{value: 1 ether}(0);
        
        vm.prank(bob);
        fairshare.payShare{value: 1 ether}(0);
        
        // Settle expense
        vm.expectEmit(true, false, false, true);
        emit ExpenseSettled(0, "Lunch", 2 ether, true);
        
        vm.prank(alice);
        fairshare.settleExpense(0);
        
        // Check that expense is settled by trying to pay again (should revert)
        vm.prank(alice);
        vm.expectRevert("Expense already settled");
        fairshare.payShare{value: 1 ether}(0);
    }

    function testSettleExpenseNotEveryone() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        
        fairshare.createExpenseWithEqualSplit("Lunch", participants, 2 ether, alice);
        
        // Only alice pays
        vm.prank(alice);
        fairshare.payShare{value: 1 ether}(0);
        
        // Try to settle without everyone paying
        vm.prank(alice);
        vm.expectRevert("Not everyone has paid their share");
        fairshare.settleExpense(0);
    }

    function testSettleExpenseNotPayer() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        
        fairshare.createExpenseWithEqualSplit("Lunch", participants, 2 ether, alice);
        
        // Pay all shares
        vm.prank(alice);
        fairshare.payShare{value: 1 ether}(0);
        
        vm.prank(bob);
        fairshare.payShare{value: 1 ether}(0);
        
        // Try to settle as non-payer
        vm.prank(bob);
        vm.expectRevert("Only payer can call this");
        fairshare.settleExpense(0);
    }

    function testSettleExpenseAlreadySettled() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        
        fairshare.createExpenseWithEqualSplit("Lunch", participants, 2 ether, alice);
        
        // Pay all shares
        vm.prank(alice);
        fairshare.payShare{value: 1 ether}(0);
        
        vm.prank(bob);
        fairshare.payShare{value: 1 ether}(0);
        
        // Settle expense
        vm.prank(alice);
        fairshare.settleExpense(0);
        
        // Try to settle again
        vm.prank(alice);
        vm.expectRevert("Expense already settled");
        fairshare.settleExpense(0);
    }

    // Test multiple expenses
    function testMultipleExpenses() public {
        address[] memory participants1 = new address[](2);
        participants1[0] = alice;
        participants1[1] = bob;
        
        address[] memory participants2 = new address[](2);
        participants2[0] = bob;
        participants2[1] = charlie;
        
        // Create two expenses
        fairshare.createExpenseWithEqualSplit("Expense 1", participants1, 2 ether, alice);
        fairshare.createExpenseWithEqualSplit("Expense 2", participants2, 4 ether, bob);
        
        // Check that shares are tracked separately
        assertEq(fairshare.shareOf(0, alice), 1 ether);
        assertEq(fairshare.shareOf(0, bob), 1 ether);
        assertEq(fairshare.shareOf(1, bob), 2 ether);
        assertEq(fairshare.shareOf(1, charlie), 2 ether);
        
        // Alice is not in expense 1
        assertEq(fairshare.shareOf(1, alice), 0);
    }

    // Test edge case: zero amount expense
    function testZeroAmountExpense() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        
        fairshare.createExpenseWithEqualSplit("Free meal", participants, 0, alice);
        
        // Shares should be 0
        assertEq(fairshare.shareOf(0, alice), 0);
        assertEq(fairshare.shareOf(0, bob), 0);
        
        // Should be able to settle immediately
        assertEq(fairshare.hasEveryonePaid(0), true);
    }

    // Test large number of participants
    function testManyParticipants() public {
        address[] memory participants = new address[](10);
        for (uint i = 0; i < 10; i++) {
            participants[i] = address(uint160(i + 1));
            vm.deal(participants[i], 100 ether);
        }
        
        fairshare.createExpenseWithEqualSplit("Big party", participants, 10 ether, participants[0]);
        
        // Each participant should owe 1 ether
        for (uint i = 0; i < 10; i++) {
            assertEq(fairshare.shareOf(0, participants[i]), 1 ether);
        }
        
        // Pay all shares
        for (uint i = 0; i < 10; i++) {
            vm.prank(participants[i]);
            fairshare.payShare{value: 1 ether}(0);
        }
        
        // Should be able to settle
        assertEq(fairshare.hasEveryonePaid(0), true);
        
        vm.prank(participants[0]);
        fairshare.settleExpense(0);
    }
}
