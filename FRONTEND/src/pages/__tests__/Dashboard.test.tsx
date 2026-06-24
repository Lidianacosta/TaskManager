import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '../Dashboard';
import { renderWithProviders } from '@/test/test-utils';

vi.mock('@/hooks/use-tasks', () => ({
  useTasks: () => ({ tasks: [], isLoading: false }),
  useCreateTask: () => ({ mutate: vi.fn() }),
}));
vi.mock('@/hooks/use-bugs', () => ({
  useBugs: () => ({ bugs: [], isLoading: false }),
}));
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, name: "Auth User", email: "authuser@example.com" },
    logout: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    isAuthenticated: true,
    isLoading: false,
  }),
}));

describe('Dashboard Page', () => {
  it('renders dashboard page', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/Olá/i)).toBeInTheDocument();
  });
});
