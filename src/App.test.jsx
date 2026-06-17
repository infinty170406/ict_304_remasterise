import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { api } from './services/api';

vi.mock('./services/api', () => ({
  api: {
    auth: {
      login: vi.fn(),
    },
    getAccounts: vi.fn(),
    getAllTransactions: vi.fn(),
  }
}));

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render LandingPage initially', () => {
    render(<App />);
    expect(screen.getByText('Gérez vos finances en un clic.')).toBeInTheDocument();
  });

  it('should navigate to LoginPage and then to Dashboard upon login', async () => {
    api.auth.login.mockResolvedValueOnce({
      user: { id: 1, username: 'TestUser', role: 'client', email: 'test@test.com' }
    });
    api.getAccounts.mockResolvedValueOnce([]);
    api.getAllTransactions.mockResolvedValueOnce([]);

    render(<App />);
    
    // Go to login
    fireEvent.click(screen.getByRole('button', { name: "Connexion" }));
    expect(screen.getByText('Bon retour parmi nous')).toBeInTheDocument();

    // Fill login
    fireEvent.change(screen.getByLabelText(/Email professionnel/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: "Se connecter" }));

    // Should load dashboard
    await waitFor(() => {
      expect(screen.getByText('Bonjour, TestUser 👋')).toBeInTheDocument();
      expect(screen.getByText('Tableau de Bord')).toBeInTheDocument(); // Sidebar
    });
  });
});
