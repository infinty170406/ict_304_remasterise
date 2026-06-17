import { LayoutDashboard, Receipt, CreditCard, BarChart2, Settings, HelpCircle, LogOut } from 'lucide-react';
const Sidebar = ({ onLogout, userRole, currentView, onNavigate }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1 className="brand-title">Infinite Bank ∞</h1>
        <p className="brand-subtitle">{userRole === 'client' ? 'Portail Client' : 'Enterprise Tier'}</p>
      </div>

      <nav className="sidebar-nav">
        <a href="#" className={`nav-item ${currentView === 'overview' ? 'active' : ''}`} onClick={e => { e.preventDefault(); onNavigate('overview'); }}>
          <LayoutDashboard size={18} />
          <span>Vue d'ensemble</span>
        </a>
        <a href="#" className={`nav-item ${currentView === 'transactions' ? 'active' : ''}`} onClick={e => { e.preventDefault(); onNavigate('transactions'); }}>
          <Receipt size={18} />
          <span>Transactions</span>
        </a>
        <a href="#" className={`nav-item ${currentView === 'cards' ? 'active' : ''}`} onClick={e => { e.preventDefault(); onNavigate('cards'); }}>
          <CreditCard size={18} />
          <span>{userRole === 'admin' ? 'Annuaire Cartes' : 'Cartes'}</span>
        </a>
        <a href="#" className={`nav-item ${currentView === 'analytics' ? 'active' : ''}`} onClick={e => { e.preventDefault(); onNavigate('analytics'); }}>
          <BarChart2 size={18} />
          <span>{userRole === 'admin' ? 'Statistiques' : 'Analyses'}</span>
        </a>
        <a href="#" className={`nav-item ${currentView === 'settings' ? 'active' : ''}`} onClick={e => { e.preventDefault(); onNavigate('settings'); }}>
          <Settings size={18} />
          <span>{userRole === 'admin' ? 'Configuration' : 'Paramètres'}</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <a href="#" className="nav-item" onClick={e => e.preventDefault()}>
          <HelpCircle size={18} />
          <span>Support</span>
        </a>
        <a href="#" className="nav-item" style={{opacity: 0.6}} onClick={(e) => { e.preventDefault(); onLogout(); }}>
          <LogOut size={18} />
          <span>Déconnexion</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
