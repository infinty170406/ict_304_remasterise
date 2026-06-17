import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CardsPage from './CardsPage';

describe('CardsPage Component', () => {
  const mockAccounts = [
    { id: 1, name: 'Compte Principal', currency: 'EUR', soldeInitial: 1500 }
  ];

  it('should render title and subtitle for client', () => {
    render(<CardsPage accounts={mockAccounts} userRole="client" userName="John Doe" />);
    expect(screen.getByText('Vos Cartes Bancaires')).toBeInTheDocument();
    expect(screen.getByText('Nouvelle carte')).toBeInTheDocument();
  });

  it('should render title for admin', () => {
    render(<CardsPage accounts={mockAccounts} userRole="admin" />);
    expect(screen.getByText('Annuaire des Cartes')).toBeInTheDocument();
    // Admin should not see the "Nouvelle carte" button
    expect(screen.queryByText('Nouvelle carte')).not.toBeInTheDocument();
  });

  it('should render empty state if no accounts', () => {
    render(<CardsPage accounts={[]} userRole="client" />);
    expect(screen.getByText(/Vous n'avez pas encore de compte bancaire/)).toBeInTheDocument();
  });

  it('should open modal when clicking "Nouvelle carte"', () => {
    render(<CardsPage accounts={mockAccounts} userRole="client" />);
    
    const newCardBtn = screen.getByRole('button', { name: /Nouvelle carte/i });
    fireEvent.click(newCardBtn);
    
    // CreateAccountModal should be visible (mocking or checking title)
    expect(screen.getByText('Nouveau Compte')).toBeInTheDocument();
  });
});
