import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from './api';

// Mock global fetch
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('auth.login', () => {
    it('should successfully login a user', async () => {
      const mockResponse = { token: 'mock-token', user: { id: 1, email: 'test@test.com' } };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.auth.login('test@test.com', 'password123');
      
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error on failed login', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' }),
      });

      await expect(api.auth.login('test@test.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('auth.register', () => {
    it('should register a new user', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await api.auth.register('John', 'john@test.com', 'pwd123', 'client');
      
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'John', email: 'john@test.com', password: 'pwd123', role: 'client' }),
      });
    });
  });

  describe('Accounts API', () => {
    it('getAccounts should return a list of accounts', async () => {
      const mockAccounts = [{ id: 1, name: 'Compte Courant' }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAccounts,
      });

      const result = await api.getAccounts();
      expect(result).toEqual(mockAccounts);
    });

    it('createAccount should make a POST request', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 2 }),
      });

      await api.createAccount({ name: 'Livret A', currency: 'EUR' });
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/accounts'), expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Livret A', currency: 'EUR' })
      }));
    });
  });

  describe('Transactions API', () => {
    it('transfer should make a POST request and return text', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'Transfer successful',
      });

      const result = await api.transfer({ sourceAccountId: 1, destinationAccountId: 2, amount: 100 });
      expect(result).toBe('Transfer successful');
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/accounts/transfer'), expect.objectContaining({
        method: 'POST'
      }));
    });

    it('should throw an error if transfer fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.transfer({ sourceAccountId: 1, destinationAccountId: 2, amount: 1000000 }))
        .rejects.toThrow('Erreur lors du virement');
    });
  });
});
