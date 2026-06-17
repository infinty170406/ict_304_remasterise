import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as transactionController from '../src/controllers/transactionController.js';
import { transactionService } from '../src/services/transactionService.js';

vi.mock('../src/services/transactionService.js');

describe('transactionController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe('getAccountHistory', () => {
    it('should return history and 200 on success', async () => {
      req.params.accountId = 1;
      const mockHistory = [{ id: 1, amount: 100 }];
      transactionService.getAccountHistory.mockResolvedValue(mockHistory);
      
      await transactionController.getAccountHistory(req, res, next);
      
      expect(transactionService.getAccountHistory).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockHistory);
    });

    it('should call next with error on failure', async () => {
      req.params.accountId = 1;
      const error = new Error('Database error');
      transactionService.getAccountHistory.mockRejectedValue(error);
      
      await transactionController.getAccountHistory(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllHistory', () => {
    it('should return all history and 200 on success', async () => {
      const mockHistory = [{ id: 1, amount: 100 }, { id: 2, amount: 50 }];
      transactionService.getAllHistory.mockResolvedValue(mockHistory);
      
      await transactionController.getAllHistory(req, res, next);
      
      expect(transactionService.getAllHistory).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockHistory);
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Database error');
      transactionService.getAllHistory.mockRejectedValue(error);
      
      await transactionController.getAllHistory(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
