import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TransactionModal from './TransactionModal';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    deposit: vi.fn(),
    withdraw: vi.fn(),
    transfer: vi.fn(),
    createAccount: vi.fn(),
  }
}));

const mockAccount = { id: 1, name: 'Compte Principal', currency: 'EUR', soldeInitial: 1000 };
const mockAccounts = [
  mockAccount,
  { id: 2, name: 'Livret A', currency: 'EUR', soldeInitial: 500 }
];

describe('TransactionModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render deposit modal correctly', () => {
    render(<TransactionModal type="deposit" account={mockAccount} accounts={mockAccounts} onClose={vi.fn()} refreshAccounts={vi.fn()} />);
    expect(screen.getByText('Nouveau Dépôt')).toBeInTheDocument();
    expect(screen.getByLabelText(/Montant/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Valider la transaction/i })).toBeInTheDocument();
  });

  it('should handle deposit submission', async () => {
    const refreshAccountsMock = vi.fn();
    const onCloseMock = vi.fn();
    api.deposit.mockResolvedValueOnce({});

    render(<TransactionModal type="deposit" account={mockAccount} accounts={mockAccounts} onClose={onCloseMock} refreshAccounts={refreshAccountsMock} />);
    
    fireEvent.change(screen.getByLabelText(/Montant/), { target: { value: '150' } });
    fireEvent.change(screen.getByLabelText(/Description/), { target: { value: 'Dépôt test' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Valider la transaction/i }));
    
    await waitFor(() => {
      expect(api.deposit).toHaveBeenCalledWith({ accountId: 1, amount: 150, description: 'Dépôt test' });
      expect(refreshAccountsMock).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('should render transfer modal with destination modes', () => {
    render(<TransactionModal type="transfer" account={mockAccount} accounts={mockAccounts} onClose={vi.fn()} refreshAccounts={vi.fn()} />);
    expect(screen.getByText('Nouveau Virement')).toBeInTheDocument();
    expect(screen.getByText('Mes Comptes')).toBeInTheDocument();
    expect(screen.getByText('Nouveau Bénéficiaire')).toBeInTheDocument();
  });

  it('should handle transfer to existing account', async () => {
    const refreshAccountsMock = vi.fn();
    const onCloseMock = vi.fn();
    api.transfer.mockResolvedValueOnce({});

    render(<TransactionModal type="transfer" account={mockAccount} accounts={mockAccounts} onClose={onCloseMock} refreshAccounts={refreshAccountsMock} />);
    
    // Default mode is 'select'
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Montant/), { target: { value: '50' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Valider la transaction/i }));
    
    await waitFor(() => {
      expect(api.transfer).toHaveBeenCalledWith({
        sourceAccountId: 1,
        destinationAccountId: 2,
        amount: 50,
        description: ''
      });
      expect(refreshAccountsMock).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('should handle transfer to new beneficiary', async () => {
    const refreshAccountsMock = vi.fn();
    const onCloseMock = vi.fn();
    api.createAccount.mockResolvedValueOnce({ id: 99 });
    api.transfer.mockResolvedValueOnce({});

    render(<TransactionModal type="transfer" account={mockAccount} accounts={mockAccounts} onClose={onCloseMock} refreshAccounts={refreshAccountsMock} />);
    
    // Switch to create mode
    fireEvent.click(screen.getByText('Nouveau Bénéficiaire'));
    
    fireEvent.change(screen.getByPlaceholderText('Nom complet du bénéficiaire'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Montant/), { target: { value: '200' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Valider la transaction/i }));
    
    await waitFor(() => {
      expect(api.createAccount).toHaveBeenCalledWith({
        name: 'John Doe',
        currency: 'EUR',
        soldeInitial: 0
      });
      expect(api.transfer).toHaveBeenCalledWith({
        sourceAccountId: 1,
        destinationAccountId: 99,
        amount: 200,
        description: ''
      });
      expect(refreshAccountsMock).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
