import { describe, it, expect, vi } from 'vitest';
import { useBugs, useCreateBug } from '../use-bugs';

// Mock tanstack query hooks
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({ data: [], isLoading: false })),
  useMutation: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
}));

describe('useBugs hooks', () => {
  it('useBugs should call useQuery', () => {
    const result = useBugs();
    expect(result).toBeDefined();
  });
  
  it('useCreateBug should call useMutation', () => {
    const result = useCreateBug();
    expect(result).toBeDefined();
  });
});
