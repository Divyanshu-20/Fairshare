# Fair Share - Learning Roadmap

## 🎯 Project Overview
Build a decentralized expense splitting app where users can create shared expenses, pay their portions, and settle/refund automatically.

## 📅 Phase 1: Smart Contract Foundation (Days 1-3)

### 1.1 Basic Contract Structure
**Goal**: Create the skeleton with proper structure
- [ ] Add state variables for tracking expenses
- [ ] Define structs for Expense data
- [ ] Set up basic access control patterns
- [ ] Handle lint errors (visibility, naming, etc.)

### 1.2 Create Expense Feature
**Goal**: Allow expense creation with participants
```solidity
// Learning Focus: Arrays, Structs, Events
- CreateExpense(description, amount, participants[])
- Store participant addresses
- Emit NewExpenseCreated event
- Handle equal split calculation
```

### 1.3 Payment System
**Goal**: Enable participants to pay their shares
```solidity
// Learning Focus: msg.value, mappings, require statements
- PayShare(expenseId) payable
- Track who paid with mapping(address => bool)
- Validate correct payment amount
- Prevent double payments
```

### 1.4 Settlement Logic
**Goal**: Handle fund distribution
```solidity
// Learning Focus: Fund transfer patterns, state management
- SettleExpense(expenseId) - when all paid
- RefundExpense(expenseId) - for expired/unpaid
- Withdraw pattern implementation
- Reentrancy protection
```

## 📅 Phase 2: Frontend Integration (Days 4-6)

### 2.1 Wallet Connection
**Goal**: Connect to user's wallet
- [ ] Install and configure wagmi/viem
- [ ] Create wallet connection component
- [ ] Handle network switching
- [ ] Display wallet address and balance

### 2.2 Expense Creation UI
**Goal**: Build form for creating new expenses
- [ ] Input fields: description, amount, participant addresses
- [ ] Validation for addresses and amounts
- [ ] Submit transaction to contract
- [ ] Show transaction status

### 2.3 Active Expenses Display
**Goal**: Show user's active expenses
- [ ] Read contract data for user's expenses
- [ ] Display expense details (description, amount, status)
- [ ] Show participant payment status
- [ ] Real-time updates via events

### 2.4 Payment Interface
**Goal**: Allow users to pay their shares
- [ ] Identify unpaid shares for connected wallet
- [ ] Calculate exact payment amount
- [ ] Execute payment transaction
- [ ] Update UI after payment confirmation

## 📅 Phase 3: Advanced Features (Days 7-9)

### 3.1 Custom Split Amounts
**Goal**: Support unequal splits
- [ ] Modify contract to accept custom amounts per participant
- [ ] Update UI to handle custom split input
- [ ] Validate total equals expense amount

### 3.2 Expiration Logic
**Goal**: Add time-based expiration
- [ ] Add expiration timestamp to expenses
- [ ] Implement refund logic for expired expenses
- [ ] Frontend countdown display
- [ ] Automatic refund triggering

### 3.3 History & Analytics
**Goal**: Provide transaction history
- [ ] Query past expenses from events
- [ ] Filter by created vs participated
- [ ] Calculate total amounts paid/received
- [ ] Export transaction history

## 📅 Phase 4: Testing & Security (Days 10-12)

### 4.1 Unit Testing
**Goal**: Test all contract functions
- [ ] Test happy path scenarios
- [ ] Test edge cases (double payments, wrong amounts)
- [ ] Test access control
- [ ] Test fund distribution accuracy

### 4.2 Frontend Testing
**Goal**: Test user interactions
- [ ] Test wallet connection flow
- [ ] Test expense creation with various inputs
- [ ] Test payment transactions
- [ ] Test error handling and user feedback

### 4.3 Security Review
**Goal**: Identify and fix vulnerabilities
- [ ] Reentrancy attack prevention
- [ ] Integer overflow protection
- [ ] Access control verification
- [ ] Gas optimization review

## 🔧 Daily Learning Checkpoints

### Day 1: Contract Structure
- [ ] Understand struct limitations with mappings
- [ ] Learn event emission patterns
- [ ] Practice array manipulation in Solidity

### Day 2: Payment Logic
- [ ] Master msg.value handling
- [ ] Understand payable functions
- [ ] Learn withdrawal patterns vs push patterns

### Day 3: Settlement & Refunds
- [ ] Implement state machine pattern
- [ ] Learn about reentrancy guards
- [ ] Practice fund transfer best practices

### Day 4: Frontend Setup
- [ ] Configure wagmi with your contract
- [ ] Learn viem for contract interactions
- [ ] Understand React hooks for blockchain data

### Day 5: Data Flow
- [ ] Connect frontend reads to contract
- [ ] Handle transaction states (pending, success, error)
- [ ] Implement real-time updates

### Day 6: User Experience
- [ ] Build intuitive forms with validation
- [ ] Create clear transaction feedback
- [ ] Handle edge cases in UI

## 📁 Project Structure

```
fair-share/
├── contracts/
│   ├── src/
│   │   ├── fairshare.sol          # Main contract
│   │   └── interfaces/            # Contract interfaces
│   ├── test/
│   │   └── fairshare.t.sol        # Foundry tests
│   └── foundry.toml
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Main app page
│   │   │   ├── create/page.tsx    # Create expense form
│   │   │   └── history/page.tsx   # Transaction history
│   │   ├── components/
│   │   │   ├── WalletConnect.tsx  # Wallet connection
│   │   │   ├── ExpenseCard.tsx    # Display single expense
│   │   │   └── PaymentButton.tsx  # Pay share button
│   │   ├── hooks/
│   │   │   ├── useContract.ts     # Contract interaction hooks
│   │   │   └── useExpenses.ts     # Expense data hooks
│   │   └── lib/
│   │       ├── config.ts          # Contract addresses & ABIs
│   │       └── utils.ts           # Helper functions
├── roadmap.md                     # This file
└── deployment/
    └── deploy.sh                  # Deployment script
```

## 🧪 Testing Strategy

### Contract Tests (Foundry)
```solidity
// Test structure to follow
testCreateExpense() - happy path
testCreateExpenseWithInvalidAmount() - edge case
testPayShare() - successful payment
testPayShareTwice() - prevent double payment
testSettleExpense() - when all paid
testRefundExpense() - when expired
```

### Frontend Tests
```typescript
// Component test examples
WalletConnect.test.tsx - connection flow
CreateExpense.test.tsx - form validation
PaymentFlow.test.tsx - transaction states
```

## 🚀 Next Steps After MVP

1. **ERC20 Support**: Allow payments in USDC or other tokens
2. **Group Management**: Create persistent groups for recurring splits
3. **Mobile App**: React Native version
4. **Notifications**: Email/SMS for payment reminders
5. **Analytics Dashboard**: Spending patterns and insights

## 📊 Learning Metrics

Track your understanding daily:
- [ ] Can explain how structs store data
- [ ] Can trace ETH flow through the contract
- [ ] Can identify all possible states of an expense
- [ ] Can debug transaction failures
- [ ] Can optimize gas usage

## 🔗 Helpful Resources

- **Solidity Patterns**: Withdrawal pattern, Checks-Effects-Interactions
- **Frontend Libraries**: wagmi.sh documentation, viem.sh docs
- **Testing**: Foundry book for contract tests
- **Security**: OpenZeppelin contracts for reference

## 🎯 Success Criteria

You'll know you're ready for the next phase when you can:
1. Create an expense with 3 participants
2. Have 2 participants pay their shares
3. Settle the expense successfully
4. Handle a refund scenario
5. Display everything accurately in the frontend

---

**Start with Phase 1.1 - let's build the basic contract structure first!**
