import { transactionService } from '../services/transactionService.js';

export const getAccountHistory = async (req, res, next) => {
  try {
    const history = await transactionService.getAccountHistory(req.params.accountId);
    res.status(200).json(history);
  } catch (err) {
    next(err);
  }
};
export const getAllHistory = async (req, res, next) => {
  try {
    const history = await transactionService.getAllHistory();
    res.status(200).json(history);
  } catch (err) {
    next(err);
  }
};
