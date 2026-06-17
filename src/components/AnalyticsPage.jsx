import { TrendingUp, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsPage = ({ accounts = [], transactions = [], userRole }) => {
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.soldeInitial, 0);
  
  // Calculer dépôts et retraits du mois
  const currentMonthTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.timestamp || Date.now());
    const now = new Date();
    return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
  });

  const totalDeposits = currentMonthTransactions
    .filter(tx => tx.type === 'DEPOSIT' || (tx.type === 'TRANSFER' && tx.amount > 0))
    .reduce((acc, tx) => acc + Math.abs(tx.amount), 0);

  const totalWithdrawals = currentMonthTransactions
    .filter(tx => tx.type === 'WITHDRAW' || tx.type === 'WITHDRAWAL' || (tx.type === 'TRANSFER' && tx.amount < 0))
    .reduce((acc, tx) => acc + Math.abs(tx.amount), 0);

  // Données pour le Pie Chart
  const rawPieData = [
    { name: 'Dépôts', value: totalDeposits, color: '#10b981' }, // success
    { name: 'Retraits', value: totalWithdrawals, color: '#ef4444' } // danger
  ].filter(item => item.value > 0);
  const pieData = rawPieData.length > 0 ? rawPieData : [{ name: 'Aucune donnée', value: 1, color: '#333333' }];

  // Données pour l'Area Chart (7 derniers jours)
  const areaData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0,0,0,0);
    const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });
    
    const dayTx = transactions.filter(tx => {
      const txd = new Date(tx.timestamp || Date.now());
      return txd.getDate() === d.getDate() && txd.getMonth() === d.getMonth() && txd.getFullYear() === d.getFullYear();
    });

    const dayDeposits = dayTx
      .filter(tx => tx.type === 'DEPOSIT' || (tx.type === 'TRANSFER' && tx.amount > 0))
      .reduce((acc, tx) => acc + Math.abs(tx.amount), 0);

    const dayWithdrawals = dayTx
      .filter(tx => tx.type === 'WITHDRAW' || tx.type === 'WITHDRAWAL' || (tx.type === 'TRANSFER' && tx.amount < 0))
      .reduce((acc, tx) => acc + Math.abs(tx.amount), 0);

    areaData.push({
      name: dayName,
      Dépôts: dayDeposits,
      Retraits: dayWithdrawals
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111111] border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-white font-bold mb-2 capitalize">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color || entry.payload?.color }} className="text-sm flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-bold">{entry.value.toLocaleString()} XAF</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-in fade-in duration-300">
      <header className="account-summary-header flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            {userRole === 'admin' ? 'Analyses Globales du Réseau' : 'Analyses & Rapports'}
          </h2>
          <p className="text-muted">
            {userRole === 'admin' ? 'Visualisez les performances financières de toute la plateforme.' : 'Visualisez vos performances financières en temps réel.'}
          </p>
        </div>
        <button className="btn btn-outline flex items-center gap-2"><TrendingUp size={16} /> Exporter le rapport</button>
      </header>
      
      <div className="bento-grid">
        {/* Résumé rapide */}
        <div className="bento-col-12">
          <div className="card-sticht flex justify-around py-8 text-center" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)'}}>
            <div>
              <p className="text-sm text-muted mb-1">Solde Total</p>
              <h3 className="text-3xl font-bold text-primary">{totalBalance.toLocaleString()} XAF</h3>
            </div>
            <div className="w-px bg-white/5"></div>
            <div>
              <p className="text-sm text-muted mb-1">Dépôts (Ce mois)</p>
              <h3 className="text-3xl font-bold text-success">+{totalDeposits.toLocaleString()} XAF</h3>
            </div>
            <div className="w-px bg-white/5"></div>
            <div>
              <p className="text-sm text-muted mb-1">Retraits (Ce mois)</p>
              <h3 className="text-3xl font-bold text-danger">-{totalWithdrawals.toLocaleString()} XAF</h3>
            </div>
          </div>
        </div>

        {/* Graphique d'évolution */}
        <div className="bento-col-8">
          <div className="card-sticht flex flex-col h-full" style={{minHeight: '350px'}}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Flux de Trésorerie (7 derniers jours)</h3>
              <Activity size={20} className="text-primary" />
            </div>
            <div className="flex-1 w-full h-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDepots" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRetraits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={val => val >= 1000 ? `${val/1000}k` : val} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Dépôts" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorDepots)" />
                  <Area type="monotone" dataKey="Retraits" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRetraits)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Répartition */}
        <div className="bento-col-4">
          <div className="card-sticht flex flex-col h-full" style={{minHeight: '350px'}}>
            <h3 className="font-bold text-lg mb-2">Répartition (Ce mois)</h3>
            <div className="flex-1 flex justify-center items-center w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-sm text-muted">Dépôts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-danger"></div>
                <span className="text-sm text-muted">Retraits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
