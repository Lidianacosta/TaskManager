import { render, screen } from '@testing-library/react';
import { ReportBugDialog } from '../ReportBugDialog';
import { describe, it, expect, vi } from 'vitest';

// Mock the hook used in the component
vi.mock('@/hooks/use-bugs', () => ({
  useCreateBug: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('ReportBugDialog', () => {
  it('renderiza o título do diálogo corretamente', () => {
    render(<ReportBugDialog open={true} onOpenChange={() => {}} />);
    expect(screen.getByText('Solicitar Mudança')).toBeInTheDocument();
  });
});
