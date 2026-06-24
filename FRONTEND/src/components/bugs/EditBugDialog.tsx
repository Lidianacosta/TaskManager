import { useState, useEffect } from "react";
import { useUpdateBug } from "@/hooks/use-bugs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Bug } from "@/lib/api/types";

interface EditBugDialogProps {
  bug: Bug | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBugDialog({ bug, open, onOpenChange }: EditBugDialogProps) {
  const { toast } = useToast();
  const updateBug = useUpdateBug();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");

  useEffect(() => {
    if (bug) {
      setTitle(bug.title);
      setDescription(bug.description || "");
      setStatus(bug.status || "open");
    }
  }, [bug, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bug || !title.trim()) return;

    updateBug.mutate(
      {
        id: bug.id,
        data: {
          title: title.trim(),
          description: description || null,
          status: status as any,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Solicitação atualizada com sucesso",
          });
          onOpenChange(false);
        },
        onError: () =>
          toast({ title: "Erro ao atualizar solicitação de mudança", variant: "destructive" }),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Solicitação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-bug-title">Título</Label>
            <Input
              id="edit-bug-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resumo da solicitação de mudança"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-bug-desc">Descrição</Label>
            <Textarea
              id="edit-bug-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a solicitação de mudança em detalhes..."
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-bug-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="edit-bug-status">
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
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateBug.isPending}>
              {updateBug.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
