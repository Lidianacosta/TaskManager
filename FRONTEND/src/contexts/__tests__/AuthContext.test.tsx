import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '../AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('AuthProvider', () => {
  it('renders children', () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div>Child</div>
        </AuthProvider>
      </QueryClientProvider>
    );
    expect(getByText('Child')).toBeInTheDocument();
  });
});
