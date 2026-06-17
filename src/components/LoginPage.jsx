import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '../services/api';

const LoginPage = ({ onLoginSuccess, onNavigate }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      if (isRegistering) {
        // Inscription publique : toujours 'client'
        const role = 'client';
        const data = await api.auth.register(username, email, password, role);
        onLoginSuccess(data.user.id, data.user.username, data.user.role, data.user.email);
      } else {
        const data = await api.auth.login(email, password);
        onLoginSuccess(data.user.id, data.user.username, data.user.role, data.user.email);
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-layout">
      {/* Left Column - Branding (large screens only) */}
      <section className="login-left">
        <div className="login-left-bg">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" 
            alt="Fintech terminal analytics interface background" 
          />
        </div>
        
        <div className="login-left-content">
          <h1 className="login-left-title">
            L'excellence opérationnelle pour vos flux financiers.
          </h1>
          <p className="login-left-desc">
            Infinite Bank ∞ centralise vos transactions critiques au sein d'une interface unifiée, sécurisée et performante.
          </p>
          <div className="login-left-tag">
            <div className="login-left-bar"></div>
            <span>Système de confiance</span>
          </div>
        </div>
      </section>

      {/* Right Column - Form */}
      <section className="login-right">
        <div className="login-form-container">
          <a href="#" className="login-brand-anchor" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}>
            Infinite Bank ∞
          </a>
          
          <div className="login-header">
            <h2 className="login-header-title">{isRegistering ? 'Créer un compte' : 'Bon retour parmi nous'}</h2>
            <p className="login-header-desc">{isRegistering ? 'Créez vos identifiants pour accéder à la plateforme.' : 'Veuillez saisir vos identifiants pour accéder à votre console.'}</p>
          </div>

          {errorMsg && (
            <div className="badge badge-danger w-full mb-4" style={{borderRadius: '0.5rem', padding: '0.8rem', display: 'block', textTransform: 'none'}}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username field (only on register) */}
            {isRegistering && (
              <div className="form-group mb-0">
                <label className="form-label">Nom d'utilisateur</label>
                <div className="login-input-container">
                  <span className="login-input-icon">
                    <Mail size={16} /> {/* On peut changer l'icône plus tard */}
                  </span>
                  <input 
                    type="text" 
                    className="form-input login-input" 
                    placeholder="ex: JeanDupont123" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required 
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="form-group mb-0">
              <label className="form-label">Email professionnel</label>
              <div className="login-input-container">
                <span className="login-input-icon">
                  <Mail size={16} />
                </span>
                <input 
                  type="email" 
                  className="form-input login-input" 
                  placeholder="nom@entreprise.fr" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Password field */}
            <div className="form-group mb-0">
              <div className="flex justify-between items-center mb-2">
                <label className="form-label mb-0">Mot de passe</label>
                <a href="#" className="text-sm font-bold text-primary hover:underline" onClick={e => e.preventDefault()}>
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="login-input-container">
                <span className="login-input-icon">
                  <Lock size={16} />
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-input login-input" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="login-pwd-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="login-remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Se souvenir de cet appareil</label>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-full py-4 mt-2" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                isRegistering ? 'S\'inscrire' : 'Se connecter'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted">
              {isRegistering ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
              <a href="#" className="text-primary font-bold hover:underline ml-1" onClick={e => { e.preventDefault(); setIsRegistering(!isRegistering); setErrorMsg(''); }}>
                {isRegistering ? 'Se connecter' : 'S\'inscrire'}
              </a>
            </p>
          </div>

          <footer className="login-footer-small">
            <span>© 2026 Infinite Bank ∞</span>
            <a href="#" className="footer-link hover:underline" onClick={e => e.preventDefault()}>Confidentialité</a>
            <a href="#" className="footer-link hover:underline" onClick={e => e.preventDefault()}>Conditions</a>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
