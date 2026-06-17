import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as accountController from '../src/controllers/accountController.js';
import { accountService } from '../src/services/accountService.js';

vi.mock('../src/services/accountService.js');

describe('accountController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn()
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should call next with error if service throws', async () => {
      const error = new Error('Service error');
      accountService.createAccount.mockRejectedValue(error);
      
      await accountController.createAccount(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllAccounts', () => {
    it('should call next with error if service throws', async () => {
      const error = new Error('Service error');
      accountService.getAllAccounts.mockRejectedValue(error);
      
      await accountController.getAllAccounts(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAccountById', () => {
    it('should call next with error if service throws', async () => {
      const error = new Error('Service error');
      accountService.getAccountById.mockRejectedValue(error);
      
      await accountController.getAccountById(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deposit', () => {
    it('should call next with error if service throws', async () => {
      const error = new Error('Service error');
      accountService.deposit.mockRejectedValue(error);
      
      await accountController.deposit(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('withdraw', () => {
    it('should call next with error if service throws', async () => {
      const error = new Error('Service error');
      accountService.withdraw.mockRejectedValue(error);
      
      await accountController.withdraw(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('transfer', () => {
    it('should call next with error if service throws', async () => {
      const error = new Error('Service error');
      accountService.transfer.mockRejectedValue(error);
      
      await accountController.transfer(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
