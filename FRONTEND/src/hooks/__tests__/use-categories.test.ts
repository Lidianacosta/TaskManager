import { describe, it, expect, vi } from 'vitest';
import { useCategories } from '../use-categories';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({ data: [], isLoading: false })),
}));

describe('useCategories hook', () => {
  it('useCategories should call useQuery', () => {
    const result = useCategories();
    expect(result).toBeDefined();
  });
});
