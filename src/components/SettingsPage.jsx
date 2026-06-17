import { User, Lock, Bell, Globe, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { api } from '../services/api';

const SettingsPage = ({ userId, userName, setUserName, userEmail, userRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(userName || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await api.auth.updateProfile(userId, editUsername);
      setUserName(data.user.username);
      setIsEditing(false);
      setMessage('Profil mis à jour avec succès');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="account-summary-header mb-10">
        <h2 className="text-3xl font-bold mb-2">
          {userRole === 'admin' ? 'Paramètres Système & Profil' : 'Paramètres'}
        </h2>
        <p className="text-muted">
          {userRole === 'admin' ? 'Gérez votre compte Super Admin et les préférences du réseau.' : 'Personnalisez votre expérience Infinite Bank.'}
        </p>
      </header>
      
      {message && <div className="badge badge-success mb-4" style={{display: 'block', borderRadius: '0.5rem', padding: '0.8rem'}}>{message}</div>}

      <div className="card-sticht mb-6">
        <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-6">
          <div className="avatar flex items-center justify-center text-xl font-bold bg-primary text-primary-content rounded-full w-16 h-16 flex-shrink-0">
            {userName ? userName.substring(0, 2).toUpperCase() : (userEmail ? userEmail.substring(0, 2).toUpperCase() : 'JD')}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <label className="text-sm text-muted">Nouveau nom d'utilisateur</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editUsername} 
                  onChange={e => setEditUsername(e.target.value)} 
                />
                <div className="flex gap-2 mt-2">
                  <button className="btn btn-primary text-sm py-2" onClick={handleSave} disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button className="btn btn-outline text-sm py-2" onClick={() => {setIsEditing(false); setEditUsername(userName);}}>
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {userName || userEmail || 'Profil Utilisateur'}
                  {userRole === 'admin' && (
                    <span className="badge flex items-center gap-1" style={{background: 'var(--primary)', color: '#000', fontSize: '0.65rem'}}>
                      <ShieldCheck size={12} /> SUPER ADMIN
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted">{userEmail || 'Mettez à jour vos informations personnelles.'}</p>
              </>
            )}
          </div>
          {!isEditing && (
            <button className="btn btn-outline ml-auto" onClick={() => setIsEditing(true)}>
              Éditer
            </button>
          )}
        </div>
        
        <div className="space-y-4 flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
            <div className="flex items-center gap-4">
              <Lock size={20} className="text-primary" />
              <div>
                <p className="font-bold">Sécurité & Mot de passe</p>
                <p className="text-xs text-muted mt-1">Dernière modification il y a 3 mois</p>
              </div>
            </div>
            <button className="btn btn-outline text-sm px-4">Modifier</button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
            <div className="flex items-center gap-4">
              <Bell size={20} className="text-primary" />
              <div>
                <p className="font-bold">Notifications</p>
                <p className="text-xs text-muted mt-1">Gérer les alertes SMS et Email</p>
              </div>
            </div>
            <button className="btn btn-outline text-sm px-4">Configurer</button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
            <div className="flex items-center gap-4">
              <Globe size={20} className="text-primary" />
              <div>
                <p className="font-bold">Langue & Région</p>
                <p className="text-xs text-muted mt-1">Français (France)</p>
              </div>
            </div>
            <button className="btn btn-outline text-sm px-4">Modifier</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
