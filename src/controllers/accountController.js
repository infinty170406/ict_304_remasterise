import { accountService } from '../services/accountService.js';

export const createAccount = async (req, res, next) => {
  try {
    const account = await accountService.createAccount(req.body);
    res.status(201).json(account);
  } catch (err) {
    next(err);
  }
};

export const getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await accountService.getAllAccounts();
    res.status(200).json(accounts);
  } catch (err) {
    next(err);
  }
};

export const getAccountById = async (req, res, next) => {
  try {
    const account = await accountService.getAccountById(req.params.id);
    res.status(200).json(account);
  } catch (err) {
    next(err);
  }
};

export const deposit = async (req, res, next) => {
  try {
    await accountService.deposit(req.body);
    res.status(200).send("Dépôt réussi");
  } catch (err) {
    next(err);
  }
};

export const withdraw = async (req, res, next) => {
  try {
    await accountService.withdraw(req.body);
    res.status(200).send("Retrait réussi");
  } catch (err) {
    next(err);
  }
};

export const transfer = async (req, res, next) => {
  try {
    await accountService.transfer(req.body);
    res.status(200).send("Virement réussi");
  } catch (err) {
    next(err);
  }
};
