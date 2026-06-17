import { describe, it, expect, beforeEach, vi } from 'vitest';
import { accountRepository } from '../src/repositories/accountRepository.js';
import Account from '../src/models/Account.js';

vi.mock('../src/models/Account.js');

describe('AccountRepository unit tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('save', () => {
    it('should throw error if account id provided but not found', async () => {
      Account.findByPk.mockResolvedValue(null);
      await expect(accountRepository.save({ id: 999, name: 'Test' }))
        .rejects.toThrow('Account not found with id: 999');
    });

    it('should update account if id provided and found', async () => {
      const mockAccount = { update: vi.fn().mockResolvedValue(true) };
      Account.findByPk.mockResolvedValue(mockAccount);
      
      await accountRepository.save({ id: 1, name: 'Updated', currency: 'USD', solde: 100, soldeInitial: 100 });
      expect(mockAccount.update).toHaveBeenCalledWith({
        name: 'Updated',
        currency: 'USD',
        solde: 100,
        soldeInitial: 100
      });
    });
  });

  describe('findById', () => {
    it('should return null if database throws error', async () => {
      Account.findByPk.mockRejectedValue(new Error('DB connection failed'));
      const result = await accountRepository.findById(1);
      expect(result).toBeNull();
    });
  });

  describe('clear', () => {
    it('should call Account.destroy', async () => {
      Account.destroy.mockResolvedValue(true);
      await accountRepository.clear();
      expect(Account.destroy).toHaveBeenCalledWith({ where: {}, force: true });
    });
  });
});
