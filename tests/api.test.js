import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import sequelize from '../src/config/database.js';

describe('API Routes Integration Tests', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should create a new account via POST /api/accounts', async () => {
    const res = await request(app)
      .post('/api/accounts')
      .send({ name: 'Marcel', currency: 'USD', soldeInitial: 2500 });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe(1);
    expect(res.body.name).toBe('Marcel');
    expect(res.body.solde).toBe(2500);
    expect(res.body.currency).toBe('USD');
  });

  it('should list accounts via GET /api/accounts', async () => {
    await request(app)
      .post('/api/accounts')
      .send({ name: 'Alice', soldeInitial: 100 });

    const res = await request(app).get('/api/accounts');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Alice');
  });

  it('should get an account by ID', async () => {
    const acc = await request(app)
      .post('/api/accounts')
      .send({ name: 'Bob', soldeInitial: 300 });

    const res = await request(app).get(`/api/accounts/${acc.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Bob');
  });

  it('should return 404 for a non-existent account ID with correct error format', async () => {
    const res = await request(app).get('/api/accounts/999');
    expect(res.status).toBe(404);
    expect(res.body.status).toBe(404);
    expect(res.body.error).toBe('Not Found');
    expect(res.body.message).toContain("Compte introuvable avec l'id : 999");
    expect(res.body.timestamp).toBeDefined();
  });

  it('should perform deposit via POST /api/accounts/deposit', async () => {
    const acc = await request(app)
      .post('/api/accounts')
      .send({ name: 'Bob', soldeInitial: 300 });

    const res = await request(app)
      .post('/api/accounts/deposit')
      .send({ accountId: acc.body.id, amount: 200, description: 'Pay' });

    expect(res.status).toBe(200);
    expect(res.text).toBe('Dépôt réussi');

    const check = await request(app).get(`/api/accounts/${acc.body.id}`);
    expect(check.body.solde).toBe(500);
  });

  it('should perform withdrawal via POST /api/accounts/withdraw', async () => {
    const acc = await request(app)
      .post('/api/accounts')
      .send({ name: 'Bob', soldeInitial: 300 });

    const res = await request(app)
      .post('/api/accounts/withdraw')
      .send({ accountId: acc.body.id, amount: 100, description: 'Cash' });

    expect(res.status).toBe(200);
    expect(res.text).toBe('Retrait réussi');

    const check = await request(app).get(`/api/accounts/${acc.body.id}`);
    expect(check.body.solde).toBe(200);
  });

  it('should perform transfer via POST /api/accounts/transfer', async () => {
    const acc1 = await request(app)
      .post('/api/accounts')
      .send({ name: 'Alice', soldeInitial: 300 });
    const acc2 = await request(app)
      .post('/api/accounts')
      .send({ name: 'Bob', soldeInitial: 100 });

    const res = await request(app)
      .post('/api/accounts/transfer')
      .send({
        sourceAccountId: acc1.body.id,
        destinationAccountId: acc2.body.id,
        amount: 150,
        description: 'Gift'
      });

    expect(res.status).toBe(200);
    expect(res.text).toBe('Virement réussi');

    const check1 = await request(app).get(`/api/accounts/${acc1.body.id}`);
    const check2 = await request(app).get(`/api/accounts/${acc2.body.id}`);
    expect(check1.body.solde).toBe(150);
    expect(check2.body.solde).toBe(250);
  });

  it('should get transaction history via GET /api/transactions/account/:id', async () => {
    const acc = await request(app)
      .post('/api/accounts')
      .send({ name: 'Alice', soldeInitial: 300 });

    await request(app)
      .post('/api/accounts/deposit')
      .send({ accountId: acc.body.id, amount: 50, description: 'Deposit' });

    const res = await request(app).get(`/api/transactions/account/${acc.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].type).toBe('DEPOSIT');
    expect(res.body[0].amount).toBe(50);
  });
});
