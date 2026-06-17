import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'XAF'
  },
  solde: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.0,
    get() {
      const rawValue = this.getDataValue('solde');
      return rawValue ? Number(rawValue) : 0;
    }
  },
  soldeInitial: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.0,
    get() {
      const rawValue = this.getDataValue('soldeInitial');
      return rawValue ? Number(rawValue) : 0;
    }
  }
}, {
  tableName: 'accounts',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default Account;
