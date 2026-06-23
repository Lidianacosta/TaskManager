import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from '../Login';

// Mock wouter
vi.mock('wouter', () => ({
  useLocation: () => ['/', vi.fn()],
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn() }),
  ApiError: Error,
}));

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

describe('Login Page', () => {
  it('renders login form', () => {
    render(<Login />);
    // Use role to disambiguate "Entrar"
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seu@email.com/i)).toBeInTheDocument();
  });
});
