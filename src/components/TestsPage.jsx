import { ShieldCheck } from 'lucide-react';

const TestsPage = ({ userRole }) => {
  if (userRole !== 'admin') {
    return <div className="p-8 text-center text-muted">Accès non autorisé.</div>;
  }

  // Utiliser l'URL du backend en prod ou fallback
  const backendBase = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : 'https://infinite-bank-backend.onrender.com';
  
  const coverageUrl = `${backendBase}/coverage/index.html`;

  return (
    <div className="flex flex-col h-full">
      <header className="mb-6">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <ShieldCheck className="text-success" size={32} />
          Rapport de Tests (Coverage)
        </h2>
        <p className="text-muted">
          Supervisez l'état de la couverture des tests du backend hébergé.
        </p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center bg-surface-container-low rounded-xl border border-[rgba(255,255,255,0.1)] p-8 text-center">
        <ShieldCheck size={64} className="text-muted mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Le rapport complet est disponible</h3>
        <p className="text-muted mb-6 max-w-md">
          Le tableau détaillé de la couverture de test (généré par Vitest) s'affiche sur une page web dédiée pour garantir un affichage optimal et sans conflits.
        </p>
        <a 
          href={coverageUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: '0.5rem' }}
        >
          Ouvrir le tableau de couverture (Nouvel onglet)
        </a>
      </div>
    </div>
  );
};

export default TestsPage;
