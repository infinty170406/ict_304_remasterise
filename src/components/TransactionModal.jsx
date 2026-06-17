import { useState } from 'react';
import { api } from '../services/api';
import { X } from 'lucide-react';

const TransactionModal = ({ type, account, accounts, onClose, refreshAccounts }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const titles = {
    deposit: 'Nouveau Dépôt',
    withdraw: 'Nouveau Retrait',
    transfer: 'Nouveau Virement'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const parsedAmount = parseFloat(amount);
    
    try {
      if (type === 'deposit') {
        await api.deposit({ accountId: account.id, amount: parsedAmount, description });
      } else if (type === 'withdraw') {
        await api.withdraw({ accountId: account.id, amount: parsedAmount, description });
      } else if (type === 'transfer') {
        if (!destinationId) throw new Error('Veuillez sélectionner un compte de destination');
        await api.transfer({ 
          sourceAccountId: account.id, 
          destinationAccountId: parseInt(destinationId), 
          amount: parsedAmount, 
          description 
        });
      }
      await refreshAccounts();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const availableDestinations = accounts.filter(a => a.id !== account.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-title">
          <span>{titles[type]}</span>
          <button className="btn btn-outline" style={{padding: '0.4rem', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        
        <p className="text-muted mb-4 text-sm">
          Compte: <strong>{account.name}</strong> (Solde: {account.soldeInitial.toLocaleString()} {account.currency})
        </p>
        
        {error && <p className="text-danger mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          {type === 'transfer' && (
            <div className="form-group">
              <label className="form-label">Compte de destination</label>
              <select 
                className="form-select" 
                value={destinationId} 
                onChange={e => setDestinationId(e.target.value)}
                required
              >
                <option value="">Sélectionnez un compte...</option>
                {availableDestinations.map(dest => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name} — {dest.soldeInitial.toLocaleString()} {dest.currency}
                  </option>
                ))}
              </select>
            </div>
          )}
        
          <div className="form-group">
            <label className="form-label">Montant ({account.currency})</label>
            <input 
              type="number" 
              className="form-input" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              min="0.01"
              step="0.01"
              placeholder="0.00"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (Optionnel)</label>
            <input 
              type="text" 
              className="form-input" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="ex: Facture électricité"
            />
          </div>
          
          <button type="submit" className={`btn btn-${type === 'withdraw' ? 'danger' : type === 'deposit' ? 'success' : 'primary'} w-full mt-4 py-3.5`} disabled={loading}>
            {loading ? 'Traitement en cours...' : 'Valider la transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
