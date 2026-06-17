import { transactionRepository } from '../repositories/transactionRepository.js';

class TransactionService {
  async getAccountHistory(accountId) {
    const transactions = await transactionRepository.findBySourceAccountIdOrDestinationAccountIdOrderByTimestampDesc(accountId);
    return transactions.map(t => ({
      id: t.id,
      type: t.type,
      amount: t.amount,
      sourceAccountId: t.sourceAccount ? t.sourceAccount.id : null,
      destinationAccountId: t.destinationAccount ? t.destinationAccount.id : null,
      timestamp: t.timestamp,
      description: t.description
    }));
  }
  async getAllHistory() {
    const transactions = await transactionRepository.findAllOrderByTimestampDesc();
    return transactions.map(t => ({
      id: t.id,
      type: t.type,
      amount: t.amount,
      sourceAccountId: t.sourceAccount ? t.sourceAccount.id : null,
      destinationAccountId: t.destinationAccount ? t.destinationAccount.id : null,
      timestamp: t.timestamp,
      description: t.description
    }));
  }
}

export const transactionService = new TransactionService();
