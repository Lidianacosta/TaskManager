import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Tasks from '../Tasks';
import { renderWithProviders } from '@/test/test-utils';

vi.mock('@/hooks/use-tasks', () => ({
  useTasks: () => ({ tasks: [], isLoading: false }),
  useUpdateTask: () => ({ mutate: vi.fn() }),
  useCreateTask: () => ({ mutate: vi.fn() }),
  useDeleteTask: () => ({ mutate: vi.fn() }),
}));

// Mock useCategories as it's used in Tasks page
vi.mock('@/hooks/use-categories', () => ({
  useCategories: () => ({ categories: [], isLoading: false }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

describe('Tasks Page', () => {
  it('renders tasks page', () => {
    renderWithProviders(<Tasks />);
    expect(screen.getByText(/Tarefas/i)).toBeInTheDocument();
  });
});
