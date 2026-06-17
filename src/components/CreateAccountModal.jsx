import { useState } from 'react';
import { api } from '../services/api';
import { X } from 'lucide-react';

const CreateAccountModal = ({ onClose, refreshAccounts, userRole, userEmail, userName }) => {
  const [name, setName] = useState(userRole === 'client' ? (userName || userEmail) : '');
  const [currency, setCurrency] = useState('XAF');
  const [initialBalance, setInitialBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.createAccount({ name, currency, soldeInitial: parseFloat(initialBalance) });
      await refreshAccounts();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-title">
          <span>Nouveau Compte</span>
          <button className="btn btn-outline" style={{padding: '0.4rem', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        
        {error && <p className="text-danger mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom du titulaire</label>
            <input 
              type="text" 
              className="form-input" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="ex: Jean Dupont"
              required 
              disabled={userRole === 'client'}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Devise</label>
            <select 
              className="form-select" 
              value={currency} 
              onChange={e => setCurrency(e.target.value)}
            >
              <option value="XAF">XAF</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Solde Initial</label>
            <input 
              type="number" 
              className="form-input" 
              value={initialBalance} 
              onChange={e => setInitialBalance(e.target.value)} 
              min="0" 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full mt-4 py-3.5" disabled={loading}>
            {loading ? 'Création...' : 'Créer le compte'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountModal;
