import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    auth: {
      login: vi.fn(),
      register: vi.fn(),
    }
  }
}));

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form by default', () => {
    render(<LoginPage onLoginSuccess={vi.fn()} onNavigate={vi.fn()} />);
    expect(screen.getByText('Bon retour parmi nous')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email professionnel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Se connecter" })).toBeInTheDocument();
  });

  it('should toggle to register form', () => {
    render(<LoginPage onLoginSuccess={vi.fn()} onNavigate={vi.fn()} />);
    
    const registerLink = screen.getByText("S'inscrire", { selector: 'a' });
    fireEvent.click(registerLink);
    
    expect(screen.getByText('Créer un compte')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom d'utilisateur/i)).toBeInTheDocument();
  });

  it('should successfully login and call onLoginSuccess', async () => {
    const onLoginSuccessMock = vi.fn();
    api.auth.login.mockResolvedValueOnce({
      user: { id: 1, username: 'testuser', role: 'client', email: 'test@test.com' }
    });

    render(<LoginPage onLoginSuccess={onLoginSuccessMock} onNavigate={vi.fn()} />);
    
    fireEvent.change(screen.getByLabelText(/Email professionnel/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: "Se connecter" }));
    
    await waitFor(() => {
      expect(api.auth.login).toHaveBeenCalledWith('test@test.com', 'password123');
      expect(onLoginSuccessMock).toHaveBeenCalledWith(1, 'testuser', 'client', 'test@test.com');
    });
  });

  it('should display error message on login failure', async () => {
    api.auth.login.mockRejectedValueOnce(new Error('Identifiants incorrects'));

    render(<LoginPage onLoginSuccess={vi.fn()} onNavigate={vi.fn()} />);
    
    fireEvent.change(screen.getByLabelText(/Email professionnel/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'wrongpwd' } });
    
    fireEvent.click(screen.getByRole('button', { name: "Se connecter" }));
    
    await waitFor(() => {
      expect(screen.getByText('Identifiants incorrects')).toBeInTheDocument();
    });
  });

  it('should call onNavigate with "landing" when clicking the brand', () => {
    const onNavigateMock = vi.fn();
    render(<LoginPage onLoginSuccess={vi.fn()} onNavigate={onNavigateMock} />);
    
    const brandLink = screen.getByText('Infinite Bank ∞', { selector: 'a' });
    fireEvent.click(brandLink);
    
    expect(onNavigateMock).toHaveBeenCalledWith('landing');
  });
});
