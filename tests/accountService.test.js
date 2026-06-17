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

  it('should throw error when creating account without name', async () => {
    await expect(accountService.createAccount({})).rejects.toThrow("Le nom du compte est obligatoire.");
  });

  it('should throw error when getting account with null id', async () => {
    await expect(accountService.getAccountById(null)).rejects.toThrow("L'identifiant du compte est obligatoire.");
  });

  it('should throw error when depositing with invalid account id or amount', async () => {
    await expect(accountService.deposit({ amount: 50 })).rejects.toThrow("L'identifiant du compte est obligatoire.");
    const acc = await accountService.createAccount({ name: 'Bob', soldeInitial: 100 });
    await expect(accountService.deposit({ accountId: acc.id, amount: -10 })).rejects.toThrow("Le montant du dépôt doit être supérieur à zéro.");
  });

  it('should throw error when withdrawing with invalid account id or amount', async () => {
    await expect(accountService.withdraw({ amount: 50 })).rejects.toThrow("L'identifiant du compte est obligatoire.");
    const acc = await accountService.createAccount({ name: 'Bob', soldeInitial: 100 });
    await expect(accountService.withdraw({ accountId: acc.id, amount: -10 })).rejects.toThrow("Le montant du retrait doit être supérieur à zéro.");
  });

  it('should throw error when transferring with invalid fields', async () => {
    await expect(accountService.transfer({ destinationAccountId: 2, amount: 50 })).rejects.toThrow("Le compte source est obligatoire.");
    await expect(accountService.transfer({ sourceAccountId: 1, amount: 50 })).rejects.toThrow("Le compte destination est obligatoire.");
    await expect(accountService.transfer({ sourceAccountId: 1, destinationAccountId: 2, amount: -50 })).rejects.toThrow("Le montant du virement doit être supérieur à zéro.");
    await expect(accountService.transfer({ sourceAccountId: 1, destinationAccountId: 1, amount: 50 })).rejects.toThrow("Les comptes source et destination doivent être différents.");
    
    const acc1 = await accountService.createAccount({ name: 'A', soldeInitial: 10 });
    const acc2 = await accountService.createAccount({ name: 'B', soldeInitial: 10 });
    await expect(accountService.transfer({ sourceAccountId: acc1.id, destinationAccountId: acc2.id, amount: 50 })).rejects.toThrow("Solde insuffisant pour effectuer le virement.");
  });
});
