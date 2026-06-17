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
    <div className="flex flex-col" style={{ height: 'calc(100vh - 100px)' }}>
      <div className="flex-1 bg-surface-container-low rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] relative mt-2 shadow-2xl">
        <iframe 
          src={coverageUrl}
          title="Rapport de Coverage Vitest"
          className="w-full h-full border-0 absolute inset-0"
          sandbox="allow-scripts allow-same-origin allow-forms"
        ></iframe>
      </div>
    </div>
  );
};

export default TestsPage;
