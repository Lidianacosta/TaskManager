import { useBugs, useUpdateBug, useDeleteBug } from "@/hooks/use-bugs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Trash2, GitPullRequest, Clock } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Bugs() {
  const { data: bugs = [], isLoading } = useBugs();
  const updateBug = useUpdateBug();
  const deleteBug = useDeleteBug();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleStatusChange = (id: number, status: string) => {
    updateBug.mutate(
      { id, data: { status: status as any } },
      {
        onSuccess: () => {
          toast({ title: "Status da solicitação atualizado com sucesso" });
        },
        onError: () => {
          toast({ title: "Erro ao atualizar status", variant: "destructive" });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta solicitação de mudança?")) return;
    deleteBug.mutate(id, {
      onSuccess: () => {
        toast({ title: "Solicitação de mudança excluída" });
      },
      onError: () => {
        toast({ title: "Erro ao excluir solicitação", variant: "destructive" });
      },
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-medium">Aberta</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium">Em Progresso</Badge>;
      case "resolved":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium">Resolvida</Badge>;
      case "closed":
        return <Badge variant="secondary" className="font-medium">Fechada</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isMutating = updateBug.isPending || deleteBug.isPending;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Solicitações de Mudanças
          </h1>
          <p className="text-muted-foreground text-sm">
            Listagem pública de sugestões de melhorias e correções registradas.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {bugs.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg border-muted bg-card">
            <GitPullRequest className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="text-lg font-medium">Nenhuma solicitação encontrada</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Caso encontre algum problema ou tenha sugestões de melhorias, envie uma solicitação.
            </p>
          </div>
        ) : (
          bugs.map((bug) => (
            <Card
              key={bug.id}
              className="transition-all duration-200 hover:shadow-md border bg-card"
            >
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-lg text-foreground truncate">{bug.title}</p>
                    {getStatusBadge(bug.status || "open")}
                  </div>
                  {bug.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {bug.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      Registrado em: {bug.created_at ? format(new Date(bug.created_at), "dd/MM/yyyy 'às' HH:mm") : "Data indisponível"}
                    </span>
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Status:</span>
                      <Select
                        defaultValue={bug.status || "open"}
                        onValueChange={(val) => handleStatusChange(bug.id, val)}
                        disabled={isMutating}
                      >
                        <SelectTrigger className="w-[140px] h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Aberta</SelectItem>
                          <SelectItem value="in_progress">Em Progresso</SelectItem>
                          <SelectItem value="resolved">Resolvida</SelectItem>
                          <SelectItem value="closed">Fechada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-9"
                      onClick={() => handleDelete(bug.id)}
                      disabled={isMutating}
                      aria-label="Excluir Solicitação"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
