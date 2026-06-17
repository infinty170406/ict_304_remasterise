import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Account from './Account.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('amount');
      return rawValue ? Number(rawValue) : 0;
    }
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'transactions',
  timestamps: false
});

// Associations
Transaction.belongsTo(Account, { as: 'sourceAccount', foreignKey: 'sourceAccountId' });
Transaction.belongsTo(Account, { as: 'destinationAccount', foreignKey: 'destinationAccountId' });

export default Transaction;
