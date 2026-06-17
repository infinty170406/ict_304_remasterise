import Account from '../models/Account.js';

class AccountRepository {
  async save(accountData) {
    if (accountData instanceof Account) {
      return await accountData.save();
    }
    
    if (accountData.id) {
      const account = await Account.findByPk(accountData.id);
      if (!account) {
        throw new Error(`Account not found with id: ${accountData.id}`);
      }
      return await account.update({
        name: accountData.name,
        currency: accountData.currency,
        solde: accountData.solde,
        soldeInitial: accountData.soldeInitial
      });
    } else {
      return await Account.create({
        name: accountData.name,
        currency: accountData.currency || 'XAF',
        solde: accountData.solde,
        soldeInitial: accountData.solde
      });
    }
  }

  async findById(id) {
    if (id === undefined || id === null) return null;
    try {
      return await Account.findByPk(id);
    } catch {
      return null;
    }
  }

  async findAll() {
    return await Account.findAll();
  }

  async clear() {
    await Account.destroy({ where: {}, force: true });
  }
}

export const accountRepository = new AccountRepository();
