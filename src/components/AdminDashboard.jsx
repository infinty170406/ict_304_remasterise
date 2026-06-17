import { Users, CreditCard, Activity, ArrowRightLeft, Shield } from 'lucide-react';
import { useState } from 'react';

const AdminDashboard = ({ accounts = [], transactions = [], userName }) => {
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.soldeInitial, 0);
  const recentTransactionsList = transactions.slice(0, 10); // Admin sees more

  return (
    <div className="animate-in fade-in duration-300">
      <header className="account-summary-header mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Shield className="text-primary" size={32} />
          Console d'Administration
        </h2>
        <p className="text-muted">Bienvenue, {userName}. Voici la vue globale de la plateforme.</p>
      </header>

      {/* Admin KPIs */}
      <div className="bento-grid mb-8">
        <div className="bento-col-4">
          <div className="card-sticht text-center py-8" style={{background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255,255,255,0) 100%)'}}>
            <Activity className="mx-auto mb-2 text-success opacity-80" size={32} />
            <p className="text-sm text-muted mb-1 uppercase tracking-wider">Volume Financier Global</p>
            <h3 className="text-3xl font-bold text-success">{totalBalance.toLocaleString()} XAF</h3>
          </div>
        </div>
        <div className="bento-col-4">
          <div className="card-sticht text-center py-8">
            <Users className="mx-auto mb-2 text-primary opacity-80" size={32} />
            <p className="text-sm text-muted mb-1 uppercase tracking-wider">Comptes Actifs</p>
            <h3 className="text-3xl font-bold text-white">{accounts.length}</h3>
          </div>
        </div>
        <div className="bento-col-4">
          <div className="card-sticht text-center py-8">
            <ArrowRightLeft className="mx-auto mb-2 text-secondary opacity-80" size={32} />
            <p className="text-sm text-muted mb-1 uppercase tracking-wider">Transactions Globales</p>
            <h3 className="text-3xl font-bold text-white">{transactions.length}</h3>
          </div>
        </div>
      </div>

      <div className="bento-grid">
        {/* All Accounts */}
        <div className="bento-col-12">
          <div className="card-sticht">
            <h3 className="font-bold text-xl mb-6 text-primary flex items-center gap-2">
              <CreditCard size={20} /> Annuaire des Comptes
            </h3>
            <div className="table-container bg-surface-container-low rounded-xl">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom du Compte</th>
                    <th>Devise</th>
                    <th className="text-right">Solde Actuel</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-8">Aucun compte dans le système.</td>
                    </tr>
                  ) : (
                    accounts.map(acc => (
                      <tr key={acc.id} className="hover:bg-surface-container-low/50">
                        <td className="text-muted">#{acc.id}</td>
                        <td className="font-bold">{acc.name}</td>
                        <td><span className="badge badge-primary">{acc.currency}</span></td>
                        <td className="text-right font-bold text-success">{acc.soldeInitial.toLocaleString()} XAF</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Global Recent Transactions */}
        <div className="bento-col-12 mt-6">
          <div className="card-sticht">
            <h3 className="font-bold text-xl mb-6 text-secondary flex items-center gap-2">
              <ArrowRightLeft size={20} /> Derniers Mouvements Globaux
            </h3>
            <div className="table-container bg-surface-container-low rounded-xl">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Source ➔ Dest.</th>
                    <th className="text-right">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactionsList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-8">Aucune transaction enregistrée.</td>
                    </tr>
                  ) : (
                    recentTransactionsList.map(tx => {
                      const isDeposit = tx.type === 'DEPOSIT' || (tx.type === 'TRANSFER' && tx.amount > 0);
                      return (
                        <tr key={tx.id} className="hover:bg-surface-container-low/50">
                          <td className="text-muted text-sm">
                            {new Date(tx.timestamp || Date.now()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td>
                            <span className="font-bold">
                              {(tx.type === 'DEPOSIT') ? 'Dépôt' : (tx.type === 'WITHDRAW' || tx.type === 'WITHDRAWAL') ? 'Retrait' : 'Virement'}
                            </span>
                          </td>
                          <td className="text-sm text-muted">
                            {tx.type === 'TRANSFER' ? `Compte ${tx.sourceAccountId} ➔ Compte ${tx.destinationAccountId}` : `Compte ${tx.accountId || tx.destinationAccountId || tx.sourceAccountId}`}
                          </td>
                          <td className={`text-right font-bold ${isDeposit ? 'text-success' : 'text-danger'}`}>
                            {isDeposit ? '+' : '-'} {Math.abs(tx.amount).toLocaleString()} XAF
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
