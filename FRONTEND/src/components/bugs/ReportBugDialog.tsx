import { useState } from "react";
import { useCreateBug } from "@/hooks/use-bugs";
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

const DEFAULT_FORM = {
  title: "",
  description: "",
};

export function ReportBugDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const createBug = useCreateBug();
  const [form, setForm] = useState(DEFAULT_FORM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    createBug.mutate(
      {
        title: form.title.trim(),
        description: form.description || null,
        timestamp: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          toast({
            title: "Solicitação registrada com sucesso",
            description: "Obrigado por nos ajudar a melhorar a plataforma!",
          });
          setForm(DEFAULT_FORM);
          onOpenChange(false);
        },
        onError: () =>
          toast({ title: "Erro ao registrar solicitação de mudança", variant: "destructive" }),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Solicitar Mudança</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bug-title">Título</Label>
            <Input
              id="bug-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Resumo da solicitação de mudança"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bug-desc">Descrição</Label>
            <Textarea
              id="bug-desc"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Descreva a solicitação de mudança em detalhes..."
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createBug.isPending}>
              {createBug.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Solicitar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
