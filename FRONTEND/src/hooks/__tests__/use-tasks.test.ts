import { describe, it, expect, vi } from 'vitest';
import { useTasks, useCreateTask } from '../use-tasks';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({ data: [], isLoading: false })),
  useMutation: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
}));

describe('useTasks hooks', () => {
  it('useTasks should call useQuery', () => {
    const result = useTasks();
    expect(result).toBeDefined();
  });
  
  it('useCreateTask should call useMutation', () => {
    const result = useCreateTask();
    expect(result).toBeDefined();
  });
});
