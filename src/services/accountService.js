import { accountRepository } from '../repositories/accountRepository.js';
import { transactionRepository } from '../repositories/transactionRepository.js';
import { NotFoundError, IllegalArgumentError } from '../utils/errors.js';

class AccountService {
  async createAccount(request) {
    if (!request || !request.name) {
      throw new IllegalArgumentError("Le nom du compte est obligatoire.");
    }
    const soldeInitial = request.soldeInitial !== undefined && request.soldeInitial !== null
      ? Number(request.soldeInitial)
      : 0;

    const account = {
      name: request.name,
      currency: request.currency !== undefined && request.currency !== null ? request.currency : "XAF",
      solde: soldeInitial
    };

    return await accountRepository.save(account);
  }

  async getAllAccounts() {
    return await accountRepository.findAll();
  }

  async getAccountById(id) {
    if (id === undefined || id === null) {
      throw new IllegalArgumentError("L'identifiant du compte est obligatoire.");
    }
    const account = await accountRepository.findById(id);
    if (!account) {
      throw new NotFoundError(`Compte introuvable avec l'id : ${id}`);
    }
    return account;
  }

  async deposit(request) {
    if (!request || request.accountId === undefined || request.accountId === null) {
      throw new IllegalArgumentError("L'identifiant du compte est obligatoire.");
    }
    const amount = Number(request.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new IllegalArgumentError("Le montant du dépôt doit être supérieur à zéro.");
    }

    const account = await this.getAccountById(request.accountId);
    account.solde += amount;
    account.soldeInitial = account.solde;
    await accountRepository.save(account);

    await transactionRepository.save({
      type: 'DEPOSIT',
      amount: amount,
      destinationAccount: account,
      description: request.description
    });
  }

  async withdraw(request) {
    if (!request || request.accountId === undefined || request.accountId === null) {
      throw new IllegalArgumentError("L'identifiant du compte est obligatoire.");
    }
    const amount = Number(request.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new IllegalArgumentError("Le montant du retrait doit être supérieur à zéro.");
    }

    const account = await this.getAccountById(request.accountId);

    if (account.solde < amount) {
      throw new IllegalArgumentError("Solde insuffisant pour effectuer le retrait.");
    }

    account.solde -= amount;
    account.soldeInitial = account.solde;
    await accountRepository.save(account);

    await transactionRepository.save({
      type: 'WITHDRAWAL',
      amount: amount,
      sourceAccount: account,
      description: request.description
    });
  }

  async transfer(request) {
    if (!request || request.sourceAccountId === undefined || request.sourceAccountId === null) {
      throw new IllegalArgumentError("Le compte source est obligatoire.");
    }
    if (request.destinationAccountId === undefined || request.destinationAccountId === null) {
      throw new IllegalArgumentError("Le compte destination est obligatoire.");
    }
    const amount = Number(request.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new IllegalArgumentError("Le montant du virement doit être supérieur à zéro.");
    }

    if (Number(request.sourceAccountId) === Number(request.destinationAccountId)) {
      throw new IllegalArgumentError("Les comptes source et destination doivent être différents.");
    }

    const sourceAccount = await this.getAccountById(request.sourceAccountId);
    const destAccount = await this.getAccountById(request.destinationAccountId);

    if (sourceAccount.solde < amount) {
      throw new IllegalArgumentError("Solde insuffisant pour effectuer le virement.");
    }

    sourceAccount.solde -= amount;
    destAccount.solde += amount;

    sourceAccount.soldeInitial = sourceAccount.solde;
    destAccount.soldeInitial = destAccount.solde;

    await accountRepository.save(sourceAccount);
    await accountRepository.save(destAccount);

    await transactionRepository.save({
      type: 'TRANSFER',
      amount: amount,
      sourceAccount: sourceAccount,
      destinationAccount: destAccount,
      description: request.description
    });
  }
}

export const accountService = new AccountService();
