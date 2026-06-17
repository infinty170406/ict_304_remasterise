import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from './LandingPage';

describe('LandingPage Component', () => {
  it('should render correctly', () => {
    render(<LandingPage onNavigate={vi.fn()} />);
    
    // Check brand presence
    expect(screen.getByText('Infinite Bank ∞')).toBeInTheDocument();
    
    // Check main title
    expect(screen.getByText('Gérez vos finances en un clic.')).toBeInTheDocument();
  });

  it('should call onNavigate with "login" when clicking open account buttons', () => {
    const onNavigateMock = vi.fn();
    render(<LandingPage onNavigate={onNavigateMock} />);
    
    const loginButtons = screen.getAllByRole('button', { name: /Ouvrir un compte/i });
    fireEvent.click(loginButtons[0]);
    
    expect(onNavigateMock).toHaveBeenCalledWith('login');
  });

  it('should call onNavigate with "login" when clicking connection button', () => {
    const onNavigateMock = vi.fn();
    render(<LandingPage onNavigate={onNavigateMock} />);
    
    const connectButton = screen.getByRole('button', { name: /Connexion/i });
    fireEvent.click(connectButton);
    
    expect(onNavigateMock).toHaveBeenCalledWith('login');
  });
});
