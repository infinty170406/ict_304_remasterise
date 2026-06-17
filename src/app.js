import express from 'express';
import cors from 'cors';
import * as accountController from './controllers/accountController.js';
import * as transactionController from './controllers/transactionController.js';
import * as authController from './controllers/authController.js';

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.put('/api/auth/profile', authController.updateProfile);

// Account routes
app.post('/api/accounts', accountController.createAccount);
app.get('/api/accounts', accountController.getAllAccounts);
app.get('/api/accounts/:id', accountController.getAccountById);
app.post('/api/accounts/deposit', accountController.deposit);
app.post('/api/accounts/withdraw', accountController.withdraw);
app.post('/api/accounts/transfer', accountController.transfer);

// Transaction routes
app.get('/api/transactions', transactionController.getAllHistory);
app.get('/api/transactions/account/:accountId', transactionController.getAccountHistory);

// Global Error Handler (matches Spring Boot global exception handler)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  
  let errorPhrase = "Internal Server Error";
  if (status === 400) errorPhrase = "Bad Request";
  else if (status === 401) errorPhrase = "Unauthorized";
  else if (status === 403) errorPhrase = "Forbidden";
  else if (status === 404) errorPhrase = "Not Found";

  const message = status === 500 ? "Une erreur interne est survenue." : err.message;

  res.status(status).json({
    timestamp: new Date().toISOString(),
    status: status,
    error: errorPhrase,
    message: message
  });
});

export default app;
