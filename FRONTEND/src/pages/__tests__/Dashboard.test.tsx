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

describe('Dashboard Page', () => {
  it('renders dashboard page', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/Bom dia/i)).toBeInTheDocument();
  });
});
