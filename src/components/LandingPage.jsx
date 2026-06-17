import { Shield, Zap, Headphones, ArrowRight, Check, Globe, HelpCircle, Activity, ArrowUpRight } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-layout">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-brand">Infinite Bank ∞</div>
        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Fonctionnalités</a>
          <a href="#tarifs" className="landing-nav-link">Tarifs</a>
          <a href="#security" className="landing-nav-link">Sécurité</a>
        </div>
        <div className="landing-navbar-actions">
          <button className="btn btn-outline" style={{padding: '0.6rem 1.2rem'}} onClick={() => onNavigate('login')}>Connexion</button>
          <button className="btn btn-primary" style={{padding: '0.6rem 1.2rem'}} onClick={() => onNavigate('login')}>Ouvrir un compte</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <div className="landing-hero-content">
          <span className="landing-hero-tag">Fintech de Nouvelle Génération</span>
          <h1 className="landing-hero-title">Gérez vos finances en un clic.</h1>
          <p className="landing-hero-desc">
            Gérez vos finances avec une rapidité inégalée et une sécurité de niveau institutionnel. Infinite Bank ∞ transforme la complexité bancaire en une expérience fluide et transparente.
          </p>
          <div className="flex gap-4">
            <button className="btn btn-primary" style={{padding: '0.9rem 1.75rem', fontSize: '0.95rem'}} onClick={() => onNavigate('login')}>
              Ouvrir un compte <ArrowRight size={16} />
            </button>
            <button className="btn btn-outline" style={{padding: '0.9rem 1.75rem', fontSize: '0.95rem'}} onClick={() => onNavigate('login')}>
              Voir la démo
            </button>
          </div>
        </div>

        <div className="landing-hero-illustration">
          <div className="illustration-preview">
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted text-sm font-bold">Solde Total</span>
              <span className="text-success font-bold" style={{fontSize: '0.8rem'}}>+12.4%</span>
            </div>
            <div className="font-bold text-2xl mb-8" style={{fontSize: '1.75rem'}}>€42,890.50</div>
            
            <div className="illustration-row">
              <div className="flex items-center gap-3">
                <span className="text-primary" style={{background: 'var(--surface-container-high)', padding: '0.4rem', borderRadius: '50%', display: 'inline-flex'}}><Zap size={14} /></span>
                <div>
                  <div className="font-bold text-sm">Apple Store</div>
                  <div className="text-muted text-sm">Il y a 2 min</div>
                </div>
              </div>
              <div className="font-bold text-danger text-sm">-€1,289.00</div>
            </div>

            <div className="illustration-row">
              <div className="flex items-center gap-3">
                <span className="text-success" style={{background: 'var(--success-bg)', padding: '0.4rem', borderRadius: '50%', display: 'inline-flex'}}><Globe size={14} /></span>
                <div>
                  <div className="font-bold text-sm">Transfert entrant</div>
                  <div className="text-muted text-sm">Il y a 5 min</div>
                </div>
              </div>
              <div className="font-bold text-success text-sm">+€2,500.00</div>
            </div>
          </div>
          
          <div className="floating-badge badge-left">
            <div className="flex items-center gap-2">
              <span className="badge badge-success">Sécurisé</span>
              <span>Cryptage AES-256 activé</span>
            </div>
          </div>
        </div>
      </header>

      {/* Trusted By */}
      <section className="landing-trusted">
        <h4 className="landing-trusted-title">FAIS CONFIANCE PAR LES LEADERS MONDIAUX</h4>
        <div className="landing-trusted-logos">
          <span className="logo-fake">Stripe</span>
          <span className="logo-fake">Vercel</span>
          <span className="logo-fake">Airbnb</span>
          <span className="logo-fake">Figma</span>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="landing-features-grid">
        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <Shield size={20} />
          </div>
          <h3 className="font-bold text-lg mb-2">Sécurité 256-bit</h3>
          <p className="text-muted text-sm">Protection maximale de vos données bancaires et transactionnelles.</p>
        </div>

        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <Zap size={20} />
          </div>
          <h3 className="font-bold text-lg mb-2">Rapidité</h3>
          <p className="text-muted text-sm">Transactions instantanées et interface utilisateur fluide sans latence.</p>
        </div>

        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <Headphones size={20} />
          </div>
          <h3 className="font-bold text-lg mb-2">Support 24/7</h3>
          <p className="text-muted text-sm">Une équipe d'experts à votre écoute en permanence pour vos besoins.</p>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="landing-bento-section">
        <div className="bento-header">
          <h2 className="bento-header-title">Conçu pour l'efficacité.</h2>
          <p className="text-muted text-base">Une suite d'outils financiers puissants intégrés dans une interface unique et intuitive.</p>
        </div>

        <div className="bento-layout">
          {/* Bento item 1 (International transfers) */}
          <div className="bento-box bento-span-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="badge badge-success mb-3" style={{display: 'inline-block'}}><Globe size={12} /> Global</span>
                <h3 className="font-bold text-xl mb-2">Virements Internationaux</h3>
                <p className="text-muted text-sm max-w-md">Envoyez de l'argent dans plus de 180 pays avec des taux de change en temps réel et des frais infimes.</p>
              </div>
            </div>
            
            <div className="flex gap-8 mt-8">
              <div>
                <div className="text-muted text-sm">Délai moyen</div>
                <div className="font-bold text-2xl text-primary">2.4 sec</div>
              </div>
              <div style={{borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem'}}>
                <div className="text-muted text-sm">Couverture</div>
                <div className="font-bold text-2xl text-primary">180+ Pays</div>
              </div>
            </div>
          </div>

          {/* Bento item 2 (Security dark) */}
          <div className="bento-box bento-span-4 bento-dark">
            <span className="badge badge-success mb-3" style={{borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'inline-block'}}><Shield size={12} /> Compliance</span>
            <h3 className="font-bold text-xl mb-2 bento-dark-title">Sécurité de niveau bancaire</h3>
            <p className="bento-dark-desc text-sm mb-6">Vos données sont protégées par un cryptage de pointe de bout en bout.</p>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-success" /> Conforme PCI DSS
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-success" /> Chiffrement AES-256
              </div>
            </div>
          </div>

          {/* Bento item 3 (Insights) */}
          <div className="bento-box bento-span-4">
            <span className="badge badge-warning mb-3" style={{display: 'inline-block'}}><Activity size={12} /> Smart Analytics</span>
            <h3 className="font-bold text-xl mb-2">Insights en temps réel</h3>
            <p className="text-muted text-sm mb-6">Visualisez vos flux de trésorerie avec des prévisions basées sur l'intelligence artificielle.</p>
            
            {/* Visual Mini bar chart */}
            <div className="flex items-end gap-2 h-20 pt-4">
              <div style={{width: '20%', height: '30%', backgroundColor: 'var(--surface-container-high)', borderRadius: '4px'}}></div>
              <div style={{width: '20%', height: '50%', backgroundColor: 'var(--surface-container-high)', borderRadius: '4px'}}></div>
              <div style={{width: '20%', height: '40%', backgroundColor: 'var(--surface-container-high)', borderRadius: '4px'}}></div>
              <div style={{width: '20%', height: '70%', backgroundColor: 'var(--surface-container-high)', borderRadius: '4px'}}></div>
              <div style={{width: '20%', height: '90%', backgroundColor: 'var(--primary-color)', borderRadius: '4px'}}></div>
            </div>
          </div>

          {/* Bento item 4 (Support Premium) */}
          <div className="bento-box bento-span-8 flex justify-between items-center" style={{padding: '0'}}>
            <div style={{padding: '2.5rem', flex: 1.2}}>
              <span className="badge badge-success mb-3" style={{display: 'inline-block'}}><HelpCircle size={12} /> Assistance</span>
              <h3 className="font-bold text-xl mb-2">Assistance 24/7 Premium</h3>
              <p className="text-muted text-sm mb-6">Notre équipe d'experts est disponible à tout moment pour vous accompagner dans vos opérations les plus critiques.</p>
              <a href="#" className="font-bold text-primary text-sm flex items-center gap-1 hover:underline" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>
                Parler à un expert <ArrowUpRight size={16} />
              </a>
            </div>
            <div style={{flex: 1, height: '100%', minHeight: '220px', position: 'relative', overflow: 'hidden'}} className="hidden sm:block">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600" 
                alt="Assistance Agent" 
                style={{width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0}}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <h2 className="landing-cta-title">Prêt à transformer votre gestion financière ?</h2>
        <p className="landing-cta-desc">Rejoignez des milliers de professionnels qui font confiance à Infinite Bank ∞ pour leurs transactions quotidiennes.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="btn btn-secondary" style={{backgroundColor: 'white', color: 'black', padding: '0.9rem 1.75rem'}} onClick={() => onNavigate('login')}>
            Ouvrir mon compte gratuit
          </button>
          <button className="btn btn-outline" style={{borderColor: 'rgba(255,255,255,0.3)', color: 'white', padding: '0.9rem 1.75rem'}} onClick={() => onNavigate('login')}>
            Contacter l'équipe vente
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-title">Infinite Bank ∞</div>
            <p className="footer-brand-desc">La plateforme de services financiers conçue pour l'ère numérique.</p>
          </div>
          <div>
            <h4 className="footer-title">Produit</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Fonctionnalités</a></li>
              <li><a href="#" className="footer-link">Virements SEPA</a></li>
              <li><a href="#" className="footer-link">Cartes Virtuelles</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Société</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">À propos</a></li>
              <li><a href="#" className="footer-link">Carrières</a></li>
              <li><a href="#" className="footer-link">Presse</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Centre d'aide</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
              <li><a href="#" className="footer-link">Statut</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Infinite Bank ∞. Tous droits réservés.</span>
          <div className="footer-bottom-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
