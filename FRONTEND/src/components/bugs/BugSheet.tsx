import { useState, useEffect, useRef } from "react";
import { useUpdateBug, useDeleteBug } from "@/hooks/use-bugs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
import { Loader2, Trash2 } from "lucide-react";
import type { Bug } from "@/lib/api";

interface BugSheetProps {
  bugId: number | null;
  bugs: Bug[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BugSheet({ bugId, bugs, open, onOpenChange }: BugSheetProps) {
  const { toast } = useToast();
  const updateBug = useUpdateBug();
  const deleteBug = useDeleteBug();

  const bug = bugs.find((b) => b.id === bugId) ?? null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [environment, setEnvironment] = useState("");
  const [version, setVersion] = useState("");
  const [status, setStatus] = useState("open");
  const [priority, setPriority] = useState("medium");
  const initializedForId = useRef<number | null>(null);

  useEffect(() => {
    if (bug && initializedForId.current !== bug.id) {
      initializedForId.current = bug.id;
      setTitle(bug.title);
      setDescription(bug.description || "");
      setSteps(bug.steps_to_reproduce || "");
      setEnvironment(bug.environment || "");
      setVersion(bug.version || "");
      setStatus(bug.status);
      setPriority(bug.priority);
    }
  }, [bug]);

  const handleSave = () => {
    if (!bugId) return;
    updateBug.mutate(
      {
        id: bugId,
        data: {
          title,
          description: description || null,
          steps_to_reproduce: steps || null,
          environment: environment || null,
          version: version || null,
          status: status as Bug["status"],
          priority: priority as Bug["priority"],
        },
      },
      {
        onSuccess: () => toast({ title: "Bug atualizado" }),
        onError: () => toast({ title: "Erro ao atualizar bug", variant: "destructive" }),
      },
    );
  };

  const handleDelete = () => {
    if (!bugId) return;
    deleteBug.mutate(bugId, {
      onSuccess: () => {
        toast({ title: "Bug excluído" });
        onOpenChange(false);
      },
      onError: () => toast({ title: "Erro ao excluir bug", variant: "destructive" }),
    });
  };

  if (!bug) return null;

  const isBusy = updateBug.isPending || deleteBug.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Editar Bug</SheetTitle>
          <SheetDescription>Atualize os detalhes e o status do bug.</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Passos para Reproduzir</Label>
            <Textarea value={steps} onChange={(e) => setSteps(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Aberto</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="resolved">Resolvido</SelectItem>
                  <SelectItem value="closed">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ambiente</Label>
            <Input
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              placeholder="Browser, SO, etc."
            />
          </div>
          <div className="space-y-2">
            <Label>Versão</Label>
            <Input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="Versão do app"
            />
          </div>
          {bug.url && (
            <div className="text-xs text-muted-foreground">
              URL:{" "}
              <span
                className="text-primary underline cursor-pointer"
                onClick={() => window.open(bug.url!, "_blank")}
              >
                {bug.url}
              </span>
            </div>
          )}
          {bug.user_agent && (
            <div className="text-xs text-muted-foreground">User Agent: {bug.user_agent}</div>
          )}
          <div className="pt-4 border-t flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              disabled={isBusy}
            >
              {deleteBug.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Excluir
            </Button>
            <Button onClick={handleSave} disabled={isBusy}>
              {updateBug.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
