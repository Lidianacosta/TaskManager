import { useState, useEffect, useRef } from "react";
import { useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import type { Task, Category } from "@/lib/api";

interface TaskSheetProps {
  taskId: number | null;
  tasks: Task[];
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskSheet({ taskId, tasks, categories, open, onOpenChange }: TaskSheetProps) {
  const { toast } = useToast();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const task = tasks.find((t) => t.id === taskId) ?? null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [categoryId, setCategoryId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const initializedForId = useRef<number | null>(null);

  useEffect(() => {
    if (task && initializedForId.current !== task.id) {
      initializedForId.current = task.id;
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setPriority(task.priority);
      setCategoryId(task.category_id ? String(task.category_id) : "none");
      setDueDate(task.due_date ? task.due_date.slice(0, 10) : "");
    }
  }, [task]);

  const handleSave = () => {
    if (!taskId) return;
    const catId = categoryId === "none" ? null : parseInt(categoryId);
    updateTask.mutate(
      {
        id: taskId,
        data: {
          title,
          description: description || null,
          status: status as Task["status"],
          priority: priority as Task["priority"],
          category_id: catId,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
        },
      },
      {
        onSuccess: () => toast({ title: "Tarefa atualizada" }),
        onError: () => toast({ title: "Erro ao atualizar tarefa", variant: "destructive" }),
      },
    );
  };

  const handleDelete = () => {
    if (!taskId) return;
    deleteTask.mutate(taskId, {
      onSuccess: () => {
        toast({ title: "Tarefa excluída" });
        onOpenChange(false);
      },
      onError: () => toast({ title: "Erro ao excluir tarefa", variant: "destructive" }),
    });
  };

  // Sync status/priority immediately on change (optimistic UX)
  const handleStatusChange = (v: string) => {
    setStatus(v);
    if (!taskId) return;
    updateTask.mutate({ id: taskId, data: { status: v as Task["status"] } });
  };

  const handlePriorityChange = (v: string) => {
    setPriority(v);
    if (!taskId) return;
    updateTask.mutate({ id: taskId, data: { priority: v as Task["priority"] } });
  };

  if (!task) return null;

  const isBusy = updateTask.isPending || deleteTask.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Editar Tarefa</SheetTitle>
          <SheetDescription>Modifique os detalhes e salve as alterações.</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">A Fazer</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="done">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={handlePriorityChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={categoryId} onValueChange={(v) => setCategoryId(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prazo</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className="pt-4 border-t flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              disabled={isBusy}
            >
              {deleteTask.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Excluir
            </Button>
            <Button onClick={handleSave} disabled={isBusy}>
              {updateTask.isPending ? (
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
