import { describe, it, expect, beforeEach } from 'vitest';
import { accountService } from '../src/services/accountService.js';
import { transactionRepository } from '../src/repositories/transactionRepository.js';
import sequelize from '../src/config/database.js';

describe('AccountService Unit Tests', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should create an account successfully', async () => {
    const acc = await accountService.createAccount({ name: 'John Doe', soldeInitial: 1000 });
    expect(acc.id).toBe(1);
    expect(acc.name).toBe('John Doe');
    expect(acc.solde).toBe(1000);
    expect(acc.currency).toBe('XAF');
  });

  it('should get account by id', async () => {
    const acc = await accountService.createAccount({ name: 'Alice', soldeInitial: 500 });
    const fetched = await accountService.getAccountById(acc.id);
    expect(fetched.name).toBe('Alice');
  });

  it('should throw error when getting non-existent account', async () => {
    await expect(accountService.getAccountById(999)).rejects.toThrow("Compte introuvable avec l'id : 999");
  });

  it('should deposit successfully', async () => {
    const acc = await accountService.createAccount({ name: 'Bob', soldeInitial: 100 });
    await accountService.deposit({ accountId: acc.id, amount: 50, description: 'Deposit' });
    
    const updated = await accountService.getAccountById(acc.id);
    expect(updated.solde).toBe(150);

    const history = await transactionRepository.findBySourceAccountIdOrDestinationAccountIdOrderByTimestampDesc(acc.id);
    expect(history).toHaveLength(1);
    expect(history[0].type).toBe('DEPOSIT');
    expect(history[0].amount).toBe(50);
  });

  it('should withdraw successfully', async () => {
    const acc = await accountService.createAccount({ name: 'Bob', soldeInitial: 100 });
    await accountService.withdraw({ accountId: acc.id, amount: 40, description: 'Withdrawal' });
    
    const updated = await accountService.getAccountById(acc.id);
    expect(updated.solde).toBe(60);
  });

  it('should throw error on withdrawal with insufficient funds', async () => {
    const acc = await accountService.createAccount({ name: 'Bob', soldeInitial: 100 });
    await expect(accountService.withdraw({ accountId: acc.id, amount: 150, description: 'Withdrawal' }))
      .rejects.toThrow('Solde insuffisant pour effectuer le retrait.');
  });

  it('should transfer successfully between two accounts', async () => {
    const acc1 = await accountService.createAccount({ name: 'Alice', soldeInitial: 200 });
    const acc2 = await accountService.createAccount({ name: 'Bob', soldeInitial: 50 });

    await accountService.transfer({
      sourceAccountId: acc1.id,
      destinationAccountId: acc2.id,
      amount: 100,
      description: 'Cadeau'
    });

    const updatedAcc1 = await accountService.getAccountById(acc1.id);
    const updatedAcc2 = await accountService.getAccountById(acc2.id);

    expect(updatedAcc1.solde).toBe(100);
    expect(updatedAcc2.solde).toBe(150);
  });
});
