import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateAccountModal from './CreateAccountModal';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    createAccount: vi.fn(),
  }
}));

describe('CreateAccountModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly for admin', () => {
    render(<CreateAccountModal onClose={vi.fn()} refreshAccounts={vi.fn()} userRole="admin" />);
    
    expect(screen.getByText('Nouveau Compte')).toBeInTheDocument();
    
    const nameInput = screen.getByPlaceholderText('ex: Jean Dupont');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).not.toBeDisabled();
    
    expect(screen.getByRole('button', { name: /Créer le compte/i })).toBeInTheDocument();
  });

  it('should render correctly for client and disable name input', () => {
    render(<CreateAccountModal onClose={vi.fn()} refreshAccounts={vi.fn()} userRole="client" userName="Client Name" />);
    
    const nameInput = screen.getByDisplayValue('Client Name');
    expect(nameInput).toBeDisabled();
  });

  it('should submit form and call createAccount API', async () => {
    const onCloseMock = vi.fn();
    const refreshAccountsMock = vi.fn();
    api.createAccount.mockResolvedValueOnce({ id: 1 });

    render(<CreateAccountModal onClose={onCloseMock} refreshAccounts={refreshAccountsMock} userRole="admin" />);
    
    fireEvent.change(screen.getByPlaceholderText('ex: Jean Dupont'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'EUR' } });
    fireEvent.change(screen.getByLabelText('Solde Initial'), { target: { value: '500' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Créer le compte/i }));
    
    await waitFor(() => {
      expect(api.createAccount).toHaveBeenCalledWith({
        name: 'New User',
        currency: 'EUR',
        soldeInitial: 500
      });
      expect(refreshAccountsMock).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('should display error message if API fails', async () => {
    api.createAccount.mockRejectedValueOnce(new Error('Erreur de création'));

    render(<CreateAccountModal onClose={vi.fn()} refreshAccounts={vi.fn()} userRole="admin" />);
    
    fireEvent.change(screen.getByPlaceholderText('ex: Jean Dupont'), { target: { value: 'Failed User' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Créer le compte/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Erreur de création')).toBeInTheDocument();
    });
  });
});
