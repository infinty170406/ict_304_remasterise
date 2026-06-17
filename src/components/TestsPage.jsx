import { ShieldCheck } from 'lucide-react';

const TestsPage = ({ userRole }) => {
  if (userRole !== 'admin') {
    return <div className="p-8 text-center text-muted">Accès non autorisé.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="mb-6">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <ShieldCheck className="text-success" size={32} />
          Console de Tests (Vitest UI)
        </h2>
        <p className="text-muted">
          Supervisez l'exécution des tests unitaires et d'intégration en temps réel.
        </p>
      </header>

      <div className="flex-1 bg-surface-container-low rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] relative">
        <iframe 
          src="http://localhost:51204/" 
          title="Vitest UI"
          className="w-full h-full border-0 absolute inset-0"
          sandbox="allow-scripts allow-same-origin allow-forms"
        ></iframe>
      </div>
    </div>
  );
};

export default TestsPage;
