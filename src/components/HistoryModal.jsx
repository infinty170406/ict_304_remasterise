import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const HistoryModal = ({ account, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getAccountHistory(account.id);
        setHistory(data.reverse());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [account.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-title">
          <span>Historique — {account.name}</span>
          <button className="btn btn-outline" style={{padding: '0.4rem', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        
        {error ? (
          <p className="text-danger mb-4">{error}</p>
        ) : loading ? (
          <p className="text-muted text-center py-6" style={{fontSize: '0.875rem'}}>Chargement de l'historique...</p>
        ) : history.length === 0 ? (
          <p className="text-muted text-center py-6" style={{fontSize: '0.875rem'}}>Aucune transaction trouvée pour ce compte.</p>
        ) : (
          <div className="table-container" style={{maxHeight: '400px', overflowY: 'auto'}}>
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
                {history.map(tx => {
                  const isDeposit = tx.type === 'DEPOSIT' || (tx.type === 'TRANSFER' && tx.amount > 0 && account.id !== tx.sourceAccountId);
                  return (
                    <tr key={tx.id}>
                      <td className="flex items-center gap-3">
                        <span className={isDeposit ? 'text-success' : 'text-danger'} style={{
                          background: isDeposit ? 'var(--success-bg)' : 'var(--danger-bg)', 
                          padding: '0.4rem', 
                          borderRadius: '50%', 
                          display: 'inline-flex'
                        }}>
                          {isDeposit ? <ArrowDownCircle size={14} /> : <ArrowUpCircle size={14} />}
                        </span>
                        <span className="font-bold">{(tx.type === 'DEPOSIT') ? 'Dépôt' : (tx.type === 'WITHDRAW' || tx.type === 'WITHDRAWAL') ? 'Retrait' : 'Virement'}</span>
                      </td>
                      <td className="text-sm text-muted">
                        {new Date(tx.timestamp || Date.now()).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        <span className="badge badge-success">Complété</span>
                      </td>
                      <td className={`font-bold text-right ${isDeposit ? 'text-success' : 'text-danger'}`}>
                        {isDeposit ? '+' : '-'}{Math.abs(tx.amount).toLocaleString()} {account.currency}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;
