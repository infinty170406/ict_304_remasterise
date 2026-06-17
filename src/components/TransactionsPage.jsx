import { Search, Filter, Download, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const TransactionsPage = ({ transactions = [], userRole }) => {
  return (
    <div>
      <header className="account-summary-header flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            {userRole === 'admin' ? 'Toutes les Transactions' : 'Historique des transactions'}
          </h2>
          <p className="text-muted">
            {userRole === 'admin' ? 'Visualisez toutes les opérations du réseau en temps réel.' : 'Consultez et recherchez vos mouvements bancaires.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline flex items-center gap-2"><Filter size={16} /> Filtres</button>
          <button className="btn btn-primary flex items-center gap-2"><Download size={16} /> Exporter</button>
        </div>
      </header>
      
      <div className="card-sticht">
        <div className="search-container mb-6 border border-white/10 p-3 rounded-xl flex items-center bg-surface-container-low">
          <Search size={18} className="text-muted mr-3" />
          <input type="text" placeholder="Rechercher une transaction..." className="search-bar w-full outline-none bg-transparent" />
        </div>
        <div className="table-container bg-surface-container-low rounded-xl mt-4">
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
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-10">Aucune transaction trouvée.</td>
                </tr>
              ) : (
                transactions.map(tx => {
                  const isDeposit = tx.type === 'DEPOSIT' || (tx.type === 'TRANSFER' && tx.amount > 0);
                  return (
                    <tr key={tx.id} className="hover:bg-surface-container-low/50">
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
      </div>
    </div>
  );
};

export default TransactionsPage;
