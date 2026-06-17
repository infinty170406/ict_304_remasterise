import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Dashboard from './Dashboard';

const mockAccounts = [
  { id: 1, name: 'Compte Principal', soldeInitial: 2500, currency: 'EUR' }
];

const mockTransactions = [
  { id: 1, sourceAccountId: 1, amount: 100, type: 'withdraw', date: new Date().toISOString() }
];

describe('Dashboard Component', () => {
  it('should render welcome message and total balance', () => {
    render(
      <Dashboard 
        accounts={mockAccounts} 
        transactions={mockTransactions} 
        userName="John Doe" 
        refreshAccounts={() => {}} 
      />
    );
    
    expect(screen.getByText('Bonjour, John Doe 👋')).toBeInTheDocument();
    expect(screen.getByText('2,500')).toBeInTheDocument(); // Solde Total
  });

  it('should display accounts', () => {
    render(
      <Dashboard 
        accounts={mockAccounts} 
        transactions={mockTransactions} 
      />
    );
    
    expect(screen.getByText('Compte Principal')).toBeInTheDocument();
    expect(screen.getByText('2,500 EUR')).toBeInTheDocument();
  });

  it('should show empty state if no accounts', () => {
    render(
      <Dashboard 
        accounts={[]} 
        transactions={[]} 
      />
    );
    
    expect(screen.getByText('Aucun compte disponible.')).toBeInTheDocument();
  });
});
