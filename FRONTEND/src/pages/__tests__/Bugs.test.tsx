import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Bugs from '../Bugs';
import { renderWithProviders } from '@/test/test-utils';

// Shared mocks
const mockUpdateMutate = vi.fn();
const mockDeleteMutate = vi.fn();
let mockIsAuthenticated = true;
let mockBugsData = [
  {
    id: 1,
    title: 'Bug 1',
    description: 'Desc 1',
    status: 'open',
    created_at: '2026-06-24T00:00:00Z',
  },
];

vi.mock('@/hooks/use-bugs', () => ({
  useBugs: () => ({
    data: mockBugsData,
    isLoading: false,
  }),
  useUpdateBug: () => ({
    mutate: mockUpdateMutate,
    isPending: false,
  }),
  useDeleteBug: () => ({
    mutate: mockDeleteMutate,
    isPending: false,
  }),
  useCreateBug: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('Bugs Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = true;
    mockBugsData = [
      {
        id: 1,
        title: 'Bug 1',
        description: 'Desc 1',
        status: 'open',
        created_at: '2026-06-24T00:00:00Z',
      },
    ];
  });

  it('renderiza o título da página de solicitações', () => {
    renderWithProviders(<Bugs />);
    expect(screen.getByText('Solicitações de Mudanças')).toBeInTheDocument();
    expect(screen.getByText('Bug 1')).toBeInTheDocument();
  });

  it('renderiza a barra de cabeçalho do visitante quando o usuário está deslogado', () => {
    mockIsAuthenticated = false;
    renderWithProviders(<Bugs />);
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    expect(screen.getByText('Nova Solicitação')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('chama a deleção ao clicar no botão de excluir', async () => {
    // Mock window.confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    
    renderWithProviders(<Bugs />);
    const deleteBtn = screen.getByLabelText('Excluir Solicitação');
    fireEvent.click(deleteBtn);

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockDeleteMutate).toHaveBeenCalledWith(1, expect.any(Object));
    confirmSpy.mockRestore();
  });

  it('abre o modal de edição ao clicar no botão de editar', async () => {
    renderWithProviders(<Bugs />);
    const editBtn = screen.getByLabelText('Editar Solicitação');
    fireEvent.click(editBtn);

    expect(screen.getByText('Editar Solicitação')).toBeInTheDocument();
    expect(screen.getByLabelText('Título')).toHaveValue('Bug 1');
    expect(screen.getByLabelText('Descrição')).toHaveValue('Desc 1');
  });
});
