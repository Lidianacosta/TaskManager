import { useState, useMemo } from "react";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { useCategories } from "@/hooks/use-categories";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { TaskSheet } from "@/components/tasks/TaskSheet";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Tasks() {
  const { data: tasks = [], isLoading } = useTasks();
  const { data: categories = [] } = useCategories();
  const updateTask = useUpdateTask();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      if (categoryFilter !== "all" && String(t.category_id) !== categoryFilter) return false;
      return true;
    });
  }, [tasks, statusFilter, priorityFilter, categoryFilter]);

  const handleStatusToggle = (e: React.MouseEvent, id: number, currentStatus: string) => {
    e.stopPropagation();
    const newStatus = currentStatus === "done" ? "todo" : "done";
    updateTask.mutate(
      { id, data: { status: newStatus as "todo" | "done" } },
      {
        onSuccess: () =>
          toast({
            title: `Status atualizado: ${newStatus === "done" ? "Concluído" : "A fazer"}`,
          }),
        onError: () =>
          toast({ title: "Erro ao atualizar tarefa", variant: "destructive" }),
      },
    );
  };

  const openTask = (id: number) => {
    setSelectedTaskId(id);
    setSheetOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Tarefas</h1>
          <p className="text-muted-foreground text-sm">Gerencie e acompanhe seu trabalho ativo.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="todo">A Fazer</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="done">Concluído</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg border-muted">
            <h3 className="text-lg font-medium">Nenhuma tarefa encontrada</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ajuste os filtros ou adicione uma nova tarefa.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              onClick={() => openTask(task.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openTask(task.id);
                }
              }}
              tabIndex={0}
              role="button"
              className={`p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 ${task.status === "done" ? "opacity-60 bg-muted/30" : ""}`}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={task.status === "done"}
                  onClick={(e) =>
                    handleStatusToggle(
                      e as unknown as React.MouseEvent,
                      task.id,
                      task.status,
                    )
                  }
                  className="h-5 w-5 rounded-sm"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium truncate ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  {task.due_date && (
                    <span>Prazo: {format(new Date(task.due_date), "dd/MM/yyyy")}</span>
                  )}
                  {task.category_name && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                      style={{ borderColor: task.category_color ?? undefined }}
                    >
                      {task.category_name}
                    </Badge>
                  )}
                </div>
              </div>
              <Badge
                variant={
                  task.priority === "high"
                    ? "destructive"
                    : task.priority === "medium"
                      ? "default"
                      : "secondary"
                }
                className="capitalize"
              >
                {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
              </Badge>
            </Card>
          ))
        )}
      </div>

      <TaskSheet
        taskId={selectedTaskId}
        tasks={tasks}
        categories={categories}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
