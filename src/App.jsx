import { useState, useEffect } from 'react';
import { api } from './services/api';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import TransactionsPage from './components/TransactionsPage';
import CardsPage from './components/CardsPage';
import AnalyticsPage from './components/AnalyticsPage';
import SettingsPage from './components/SettingsPage';
import { Bell } from 'lucide-react';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing' | 'login' | 'dashboard'
  const [currentView, setCurrentView] = useState('overview'); // 'overview' | 'transactions' | 'cards' | 'analytics' | 'settings'
  const [userRole, setUserRole] = useState(null); // 'admin' | 'client'
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [accountsData, transactionsData] = await Promise.all([
        api.getAccounts(),
        api.getAllTransactions()
      ]);
      setAccounts(accountsData);
      setTransactions(transactionsData);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les données. Veuillez vérifier la connexion au serveur.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage === 'dashboard') {
      fetchAllData();
    }
  }, [currentPage]);

  // Filtrer les données selon l'utilisateur
  const filteredAccounts = userRole === 'admin' || !userRole
    ? accounts 
    : accounts.filter(acc => acc.name.toLowerCase() === (userName || userEmail).toLowerCase());

  const filteredTransactions = userRole === 'admin' || !userRole
    ? transactions
    : transactions.filter(tx => 
        filteredAccounts.some(acc => acc.id === tx.sourceAccountId || acc.id === tx.destinationAccountId)
      );

  // Render Page based on current state
  if (currentPage === 'landing') {
    return <LandingPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={(id, username, role, email) => {
          setUserId(id);
          setUserName(username);
          setUserRole(role);
          setUserEmail(email);
          setCurrentPage('dashboard');
        }} 
        onNavigate={setCurrentPage} 
      />
    );
  }

  return (
    <div className="app-layout animate-in fade-in duration-300">
      <Sidebar userRole={userRole} currentView={currentView} onNavigate={setCurrentView} onLogout={() => { setUserId(null); setUserName(''); setUserRole(null); setUserEmail(''); setCurrentPage('landing'); }} />
      
      <main className="main-content">
        <header className="topbar">
          <div className="search-container">
            <input type="text" placeholder="Rechercher des comptes, transactions..." className="search-bar" />
          </div>
          <div className="flex items-center gap-4">
            <button className="btn btn-outline" style={{borderRadius: '50%', padding: '0.5rem', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Bell size={16} />
            </button>
            <div className="avatar" title={userName || userEmail}>
              {userName ? userName.substring(0, 2).toUpperCase() : (userEmail ? userEmail.substring(0, 2).toUpperCase() : 'AD')}
            </div>
          </div>
        </header>

        {error && (
          <div className="badge badge-danger w-full mb-6" style={{borderRadius: '0.75rem', padding: '1rem', display: 'block', textTransform: 'none', fontWeight: '500', fontSize: '0.875rem'}}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-muted mt-4" style={{fontSize: '0.875rem'}}>Chargement de la console...</div>
        ) : (
          <>
            {currentView === 'overview' && userRole === 'admin' && (
              <AdminDashboard
                accounts={accounts} // Admin sees ALL accounts
                transactions={transactions} // Admin sees ALL transactions
                userName={userName}
              />
            )}
            {currentView === 'overview' && userRole !== 'admin' && (
              <Dashboard 
                accounts={filteredAccounts} 
                transactions={filteredTransactions}
                refreshAccounts={fetchAllData} 
                userRole={userRole} 
                userEmail={userEmail} 
                userName={userName}
              />
            )}
            {currentView === 'transactions' && <TransactionsPage transactions={filteredTransactions} userRole={userRole} />}
            {currentView === 'cards' && <CardsPage accounts={filteredAccounts} userName={userName || userEmail} userRole={userRole} userId={userId} refreshAccounts={fetchAllData} />}
            {currentView === 'analytics' && <AnalyticsPage accounts={filteredAccounts} transactions={filteredTransactions} userRole={userRole} />}
            {currentView === 'settings' && <SettingsPage userId={userId} userName={userName} setUserName={setUserName} userEmail={userEmail} userRole={userRole} />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
