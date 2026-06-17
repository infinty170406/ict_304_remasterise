import { CreditCard, Plus, Shield } from 'lucide-react';
import { useState } from 'react';
import CreateAccountModal from './CreateAccountModal';

const CardsPage = ({ accounts = [], userName, userRole, userId, refreshAccounts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div>
      <header className="account-summary-header flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            {userRole === 'admin' ? 'Annuaire des Cartes' : 'Vos Cartes Bancaires'}
          </h2>
          <p className="text-muted">
            {userRole === 'admin' ? 'Gérez l\'ensemble des cartes attribuées aux utilisateurs.' : 'Gérez vos cartes physiques et virtuelles en toute sécurité.'}
          </p>
        </div>
        {userRole !== 'admin' && (
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} /> Nouvelle carte
          </button>
        )}
      </header>
      
      <div className="flex flex-col gap-8">
        {accounts.length === 0 ? (
          <div className="card-sticht text-center py-12 text-muted">
            {userRole === 'admin' ? 'Aucune carte enregistrée dans le système.' : 'Vous n\'avez pas encore de compte bancaire. Créez-en un pour obtenir une carte.'}
          </div>
        ) : (
          accounts.map(account => (
            <div key={account.id} className="bento-grid">
              <div className="bento-col-8">
                <div className="card-sticht relative overflow-hidden" style={{minHeight: '240px', background: 'linear-gradient(135deg, var(--primary) 0%, #1a1a1a 100%)', border: '1px solid rgba(255,255,255,0.1)'}}>
                  <CreditCard size={32} className="mb-4 text-white/50" />
                  <h3 className="text-xl font-bold tracking-widest mb-2 text-white">**** **** **** {Math.floor(1000 + Math.random() * 9000)}</h3>
                  <p className="text-white font-bold">{account.soldeInitial.toLocaleString()} {account.currency}</p>
                  
                  <div className="flex justify-between items-end mt-4 text-white">
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Titulaire</p>
                      <p className="font-bold">{userName || account.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Compte</p>
                      <p className="font-bold">{account.name}</p>
                    </div>
                  </div>
                  {/* Glossy overlay effect */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                </div>
              </div>
              <div className="bento-col-4">
                <div className="card-sticht flex flex-col justify-center h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="text-success" size={24} />
                    <h3 className="font-bold">Sécurité renforcée</h3>
                  </div>
                  <p className="text-sm text-muted">Votre carte liée au compte {account.name} est protégée par la technologie 3D Secure Infinite.</p>
                  <button className="btn btn-outline mt-6 w-full">Gérer les plafonds</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {isModalOpen && (
        <CreateAccountModal 
          userId={userId} 
          userName={userName} 
          onClose={() => setIsModalOpen(false)} 
          refreshAccounts={refreshAccounts} 
        />
      )}
    </div>
  );
};

export default CardsPage;
