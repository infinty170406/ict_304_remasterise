import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PlusCircle, ArrowRightLeft, ArrowDownCircle, ArrowUpCircle, History, TrendingUp } from 'lucide-react';
import CreateAccountModal from './CreateAccountModal';
import TransactionModal from './TransactionModal';
import HistoryModal from './HistoryModal';

const Dashboard = ({ accounts, transactions, refreshAccounts, userRole, userEmail, userName }) => {
  const [activeModal, setActiveModal] = useState(null); // 'create', 'deposit', 'withdraw', 'transfer', 'history'
  const [selectedAccount, setSelectedAccount] = useState(null);

  const openModal = (type, account = null) => {
    setActiveModal(type);
    setSelectedAccount(account);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedAccount(null);
  };

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.soldeInitial, 0);

  const recentTransactionsList = transactions.slice(0, 5);

  return (
    <div>
      {/* Header Account Summary */}
      <header className="account-summary-header flex justify-between items-end mb-10">
        <div>
          <h2 className="summary-title">Solde Global</h2>
          <div className="flex items-baseline gap-4">
            <span className="summary-balance">{totalBalance.toLocaleString()} XAF</span>
            <span className="summary-trend">
              <TrendingUp size={16} />
              +2.4%
            </span>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="bento-grid">
        
        {/* Left column (8 spans): Accounts & Transactions */}
        <div className="bento-col-8 flex flex-col gap-6">
          
          {/* Accounts Section */}
          <section>
            <h3 className="font-bold text-xl mb-4 text-primary">Comptes Actifs</h3>
            <div className="accounts-grid">
              {accounts.length === 0 ? (
                <div className="account-card-sticht text-center text-muted flex items-center justify-center">
                  Aucun compte trouvé. Créez-en un pour commencer !
                </div>
              ) : (
                accounts.map(account => (
                  <div key={account.id} className="account-card-sticht">
                    <div className="account-card-top">
                      <span className="account-card-name">{account.name}</span>
                      <span className="badge badge-success">{account.currency}</span>
                    </div>
                    
                    <div>
                      <div className="account-card-balance">
                        {account.soldeInitial.toLocaleString()} {account.currency}
                      </div>
                      
                      <div className="account-card-actions">
                        <button className="btn btn-outline" style={{padding: '0.4rem 0.6rem'}} onClick={() => openModal('deposit', account)} title="Dépôt">
                          <ArrowDownCircle size={16} className="text-success" />
                        </button>
                        <button className="btn btn-outline" style={{padding: '0.4rem 0.6rem'}} onClick={() => openModal('withdraw', account)} title="Retrait">
                          <ArrowUpCircle size={16} className="text-danger" />
                        </button>
                        <button className="btn btn-outline" style={{padding: '0.4rem 0.6rem'}} onClick={() => openModal('transfer', account)} title="Virement">
                          <ArrowRightLeft size={16} />
                        </button>
                        <button className="btn btn-outline" style={{padding: '0.4rem 0.6rem', marginLeft: 'auto'}} onClick={() => openModal('history', account)} title="Historique">
                          <History size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recent Activity Table (Static structure but dynamic entries simulation) */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-primary">Activités récentes</h3>
            </div>
            
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th className="text-right">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactionsList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">Aucune activité récente</td>
                    </tr>
                  ) : (
                    recentTransactionsList.map(tx => {
                      const isDeposit = tx.type === 'DEPOSIT' || (tx.type === 'TRANSFER' && tx.amount > 0);
                      return (
                        <tr key={tx.id} className="hover:bg-surface-container-low/30">
                          <td className="flex items-center gap-3">
                            <span className={isDeposit ? 'text-success' : 'text-danger'} style={{background: isDeposit ? 'var(--success-bg)' : 'var(--danger-bg)', padding: '0.4rem', borderRadius: '50%', display: 'inline-flex'}}>
                              {isDeposit ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                            </span>
                            <span className="font-bold">
                              {(tx.type === 'DEPOSIT') ? 'Dépôt' : (tx.type === 'WITHDRAW' || tx.type === 'WITHDRAWAL') ? 'Retrait' : 'Virement'}
                            </span>
                          </td>
                          <td className="text-muted text-sm">
                            {new Date(tx.timestamp || Date.now()).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td><span className="badge badge-success">Complété</span></td>
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
          </section>
        </div>

        {/* Right column (4 spans): Quick Actions & Promo */}
        <div className="bento-col-4 flex flex-col gap-6">
          <div className="card-sticht">
            <div>
              <h3 className="card-sticht-title">Quick Actions</h3>
              <p className="card-sticht-desc">Gérez vos fonds instantanément et ouvrez de nouveaux comptes.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button className="btn btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2" onClick={() => openModal('create')}>
                <PlusCircle size={18} /> Nouveau Compte
              </button>
              <button className="btn btn-secondary w-full py-4 rounded-xl flex items-center justify-center gap-2" onClick={() => accounts.length > 0 ? openModal('transfer', accounts[0]) : null}>
                <ArrowRightLeft size={18} /> Nouveau Virement
              </button>
            </div>
          </div>

          <div className="card-sticht promo">
            <div style={{zIndex: 10, position: 'relative'}}>
              <h4 className="font-bold text-lg mb-1" style={{color: 'white'}}>Infinite Premium ∞</h4>
              <p className="text-sm mb-4" style={{color: 'rgba(255,255,255,0.7)'}}>Accédez à des taux d'intérêt préférentiels et des outils d'analyse avancés.</p>
              <button className="btn btn-secondary" style={{backgroundColor: 'white', color: 'black', padding: '0.5rem 1rem'}}>En savoir plus</button>
            </div>
            <div style={{
              position: 'absolute',
              right: '-40px',
              bottom: '-40px',
              width: '160px',
              height: '160px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '50%',
              filter: 'blur(30px)'
            }}></div>
          </div>
        </div>

      </div>

      {activeModal === 'create' && (
        <CreateAccountModal onClose={closeModal} refreshAccounts={refreshAccounts} userRole={userRole} userEmail={userEmail} userName={userName} />
      )}
      {(activeModal === 'deposit' || activeModal === 'withdraw' || activeModal === 'transfer') && (
        <TransactionModal 
          type={activeModal} 
          account={selectedAccount} 
          accounts={accounts} 
          onClose={closeModal} 
          refreshAccounts={refreshAccounts} 
        />
      )}
      {activeModal === 'history' && (
        <HistoryModal account={selectedAccount} onClose={closeModal} />
      )}
    </div>
  );
};

export default Dashboard;
