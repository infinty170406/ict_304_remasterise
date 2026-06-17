import { Op } from 'sequelize';
import Transaction from '../models/Transaction.js';

class TransactionRepository {
  async save(transactionData) {
    return await Transaction.create({
      type: transactionData.type,
      amount: Number(transactionData.amount),
      sourceAccountId: transactionData.sourceAccount ? Number(transactionData.sourceAccount.id) : null,
      destinationAccountId: transactionData.destinationAccount ? Number(transactionData.destinationAccount.id) : null,
      timestamp: transactionData.timestamp || new Date(),
      description: transactionData.description || null
    });
  }

  async findBySourceAccountIdOrDestinationAccountIdOrderByTimestampDesc(accountId) {
    const accId = Number(accountId);
    return await Transaction.findAll({
      where: {
        [Op.or]: [
          { sourceAccountId: accId },
          { destinationAccountId: accId }
        ]
      },
      order: [
        ['timestamp', 'DESC'],
        ['id', 'DESC']
      ],
      include: [
        { association: 'sourceAccount', attributes: ['id'] },
        { association: 'destinationAccount', attributes: ['id'] }
      ]
    });
  }

  async findAllOrderByTimestampDesc() {
    return await Transaction.findAll({
      order: [
        ['timestamp', 'DESC'],
        ['id', 'DESC']
      ],
      include: [
        { association: 'sourceAccount', attributes: ['id'] },
        { association: 'destinationAccount', attributes: ['id'] }
      ]
    });
  }

  async clear() {
    await Transaction.destroy({ where: {}, force: true });
  }
}

export const transactionRepository = new TransactionRepository();
