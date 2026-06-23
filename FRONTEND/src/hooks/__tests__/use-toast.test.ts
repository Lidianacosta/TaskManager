import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useToast } from '../use-toast';

describe('useToast hook', () => {
  it('useToast should return toast function', () => {
    const { result } = renderHook(() => useToast());
    expect(typeof result.current.toast).toBe('function');
  });
});
