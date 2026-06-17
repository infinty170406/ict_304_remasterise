const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://infinite-bank-backend.onrender.com/api';

export const api = {
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur de connexion');
      }
      return response.json();
    },
    register: async (username, email, password, role) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur d\'inscription');
      }
      return response.json();
    },
    updateProfile: async (userId, username) => {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, username }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur de mise à jour');
      }
      return response.json();
    }
  },

  // Accounts
  getAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/accounts`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des comptes');
    return response.json();
  },

  getAccountById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/accounts/${id}`);
    if (!response.ok) throw new Error('Compte introuvable');
    return response.json();
  },

  createAccount: async (data) => {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erreur lors de la création du compte');
    return response.json();
  },

  deposit: async (data) => {
    const response = await fetch(`${API_BASE_URL}/accounts/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erreur lors du dépôt');
    return response.text();
  },

  withdraw: async (data) => {
    const response = await fetch(`${API_BASE_URL}/accounts/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erreur lors du retrait. Solde peut-être insuffisant.');
    return response.text();
  },

  transfer: async (data) => {
    const response = await fetch(`${API_BASE_URL}/accounts/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erreur lors du virement. Solde peut-être insuffisant.');
    return response.text();
  },

  // Transactions
  getAccountHistory: async (accountId) => {
    const response = await fetch(`${API_BASE_URL}/transactions/account/${accountId}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération de l\'historique');
    return response.json();
  },

  getAllTransactions: async () => {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des transactions');
    return response.json();
  }
};
