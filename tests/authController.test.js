import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authController from '../src/controllers/authController.js';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';

vi.mock('../src/models/User.js');
vi.mock('bcryptjs');

describe('authController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should return 400 if email or password is missing', async () => {
      req.body = { email: 'test@test.com' }; // missing password
      await authController.register(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "L'email et le mot de passe sont requis." });
    });

    it('should return 400 if user already exists', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      User.findOne.mockResolvedValue({ id: 1 });
      await authController.register(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Cet email est déjà utilisé." });
    });

    it('should create user and return 201 on success', async () => {
      req.body = { username: 'john', email: 'test@test.com', password: 'password123' };
      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      const mockUser = { id: 1, username: 'john', email: 'test@test.com', role: 'client' };
      User.create.mockResolvedValue(mockUser);

      await authController.register(req, res, next);
      
      expect(User.create).toHaveBeenCalledWith({
        username: 'john',
        email: 'test@test.com',
        password: 'hashedPassword',
        role: 'client'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inscription réussie",
        user: mockUser
      });
    });

    it('should call next with error on failure', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      const error = new Error('Database error');
      User.findOne.mockRejectedValue(error);
      
      await authController.register(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should return 400 if email or password missing', async () => {
      req.body = { email: 'test@test.com' };
      await authController.login(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 401 if user not found', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      User.findOne.mockResolvedValue(null);
      await authController.login(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 if password does not match', async () => {
      req.body = { email: 'test@test.com', password: 'wrong' };
      User.findOne.mockResolvedValue({ id: 1, password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);
      await authController.login(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 200 and user data on success', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      const mockUser = { id: 1, username: 'john', email: 'test@test.com', role: 'client', password: 'hashedPassword' };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      
      await authController.login(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Connexion réussie",
        user: { id: 1, username: 'john', email: 'test@test.com', role: 'client' }
      });
    });

    it('should call next on error', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      const err = new Error('DB Error');
      User.findOne.mockRejectedValue(err);
      await authController.login(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('updateProfile', () => {
    it('should return 400 if missing fields', async () => {
      req.body = { userId: 1 };
      await authController.updateProfile(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if user not found', async () => {
      req.body = { userId: 1, username: 'newname' };
      User.findByPk.mockResolvedValue(null);
      await authController.updateProfile(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should update user and return 200', async () => {
      req.body = { userId: 1, username: 'newname' };
      const mockUser = { id: 1, username: 'oldname', email: 'test@test.com', role: 'client', save: vi.fn() };
      User.findByPk.mockResolvedValue(mockUser);
      
      await authController.updateProfile(req, res, next);
      expect(mockUser.username).toBe('newname');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should call next on error', async () => {
      req.body = { userId: 1, username: 'newname' };
      const err = new Error('DB Error');
      User.findByPk.mockRejectedValue(err);
      await authController.updateProfile(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
