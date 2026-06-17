import { describe, it, expect, beforeEach } from 'vitest';
import { accountService } from '../src/services/accountService.js';
import { transactionService } from '../src/services/transactionService.js';
import sequelize from '../src/config/database.js';

describe('TransactionService Unit Tests', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should retrieve transaction history mapped correctly', async () => {
    const acc1 = await accountService.createAccount({ name: 'Alice', soldeInitial: 200 });
    const acc2 = await accountService.createAccount({ name: 'Bob', soldeInitial: 50 });

    await accountService.deposit({ accountId: acc1.id, amount: 50, description: 'Paycheck' });
    await accountService.transfer({
      sourceAccountId: acc1.id,
      destinationAccountId: acc2.id,
      amount: 100,
      description: 'Rent'
    });

    const historyAlice = await transactionService.getAccountHistory(acc1.id);
    expect(historyAlice).toHaveLength(2);
    
    // First in array should be the most recent (transfer)
    expect(historyAlice[0].type).toBe('TRANSFER');
    expect(historyAlice[0].amount).toBe(100);
    expect(historyAlice[0].sourceAccountId).toBe(acc1.id);
    expect(historyAlice[0].destinationAccountId).toBe(acc2.id);
    expect(historyAlice[0].description).toBe('Rent');

    // Second in array should be the deposit
    expect(historyAlice[1].type).toBe('DEPOSIT');
    expect(historyAlice[1].amount).toBe(50);
    expect(historyAlice[1].sourceAccountId).toBeNull();
    expect(historyAlice[1].destinationAccountId).toBe(acc1.id);
    expect(historyAlice[1].description).toBe('Paycheck');
  });

  it('should retrieve all history successfully', async () => {
    const acc = await accountService.createAccount({ name: 'Charlie', soldeInitial: 100 });
    await accountService.withdraw({ accountId: acc.id, amount: 20, description: 'Snacks' });

    const allHistory = await transactionService.getAllHistory();
    // At least one transaction should be there
    expect(allHistory.length).toBeGreaterThanOrEqual(1);
    
    const withdrawal = allHistory.find(t => t.description === 'Snacks');
    expect(withdrawal).toBeDefined();
    expect(withdrawal.type).toBe('WITHDRAWAL');
    expect(withdrawal.amount).toBe(20);
    expect(withdrawal.sourceAccountId).toBe(acc.id);
    expect(withdrawal.destinationAccountId).toBeNull();
  });
});
