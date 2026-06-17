import { describe, it, expect, vi, beforeEach } from 'vitest';
import { transactionRepository } from '../src/repositories/transactionRepository.js';
import Transaction from '../src/models/Transaction.js';

vi.mock('../src/models/Transaction.js');

describe('transactionRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('clear', () => {
    it('should call Transaction.destroy with force true', async () => {
      Transaction.destroy.mockResolvedValue(true);
      await transactionRepository.clear();
      expect(Transaction.destroy).toHaveBeenCalledWith({ where: {}, force: true });
    });
  });
});
