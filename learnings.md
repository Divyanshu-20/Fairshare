# Fair Share - Solidity Learnings

This file logs the syntax and logic mistakes made during development so you can avoid them in future projects.

## 🧠 Common Solidity Mistakes & Fixes

### 1. **Undeclared Identifier**
- **Mistake:** Using `everyonesShares.push(individualShare)` without declaring `everyonesShares`
- **Fix:** Always declare arrays before use: `uint256[] memory everyonesShares = new uint256[](length);`
- **Analogy:** You can't write on a page that doesn't exist in your notebook

### 2. **Event Syntax Errors**
- **Mistake:** `event ExpenseCreated` (missing parentheses)
- **Fix:** `event ExpenseCreated(uint256 indexed expenseId, string title, uint256 amount, address payer);`
- **Analogy:** Like forgetting to label your columns in a table

### 3. **Event Emission Errors**
- **Mistake:** `emit(ExpenseCreated, )` (incorrect syntax)
- **Fix:** `emit ExpenseCreated(expenses.length - 1, _title, _amount, _payer);`
- **Analogy:** Like writing "ExpenseCreated happened" instead of the actual details

### 4. **Struct Field Access**
- **Mistake:** Trying to push to `everyonesShares` as if it's a global array
- **Fix:** Build the array locally, then assign to struct field
- **Analogy:** You can't write on someone else's page - create your own page first

### 5. **Division by Zero**
- **Risk:** `_amount / _participants.length` when participants array is empty
- **Fix:** Add require statement: `require(_participants.length > 0, "Need participants");`
- **Analogy:** Can't split a bill among zero people

### 6. **Integer Division**
- **Risk:** `_amount / _participants.length` may lose remainder
- **Fix:** Consider handling remainder or using fixed-point math
- **Analogy:** $10 split among 3 people = $3 each, $1 left over

## 🔍 Best Practices Checklist

Before writing code:
- [ ] Declare all variables before use
- [ ] Check array lengths are > 0 before division
- [ ] Use `memory` arrays for temporary data
- [ ] Test edge cases (empty arrays, zero amounts)
- [ ] Verify event syntax with parentheses
- [ ] Use proper indentation and formatting

## 📚 Quick Reference

### Event Declaration
```solidity
event EventName(type indexed param1, type param2);
```

### Array Declaration
```solidity
uint256[] memory arrayName = new uint256[](length);
```

### Struct Assignment
```solidity
StructName memory instance = StructName({
    field1: value1,
    field2: value2
});
```

## 🎯 Next Project Reminders

1. **Start with minimal viable contract**
2. **Add complexity gradually**
3. **Test every new feature immediately**
4. **Keep variable names consistent**
5. **Document decisions as you make them**

---

*Last updated: 2025-08-07*
