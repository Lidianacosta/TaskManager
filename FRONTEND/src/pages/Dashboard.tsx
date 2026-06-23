import { useMemo } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { useCategories } from "@/hooks/use-categories";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, CircleDashed, Clock, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import type { Task } from "@/lib/api";

function getTasksSummary(tasks: Task[]) {
  const summary = {
    total: tasks.length,
    by_status: { todo: 0, in_progress: 0, done: 0 } as Record<string, number>,
    by_priority: { low: 0, medium: 0, high: 0 } as Record<string, number>,
    overdue: 0,
  };
  for (const t of tasks) {
    summary.by_status[t.status] = (summary.by_status[t.status] ?? 0) + 1;
    summary.by_priority[t.priority] = (summary.by_priority[t.priority] ?? 0) + 1;
    if (t.due_date && new Date(t.due_date) < new Date() && t.status !== "done")
      summary.overdue++;
  }
  return summary;
}

export default function Dashboard() {
  const { data: tasks = [], isLoading } = useTasks();
  const { data: categories = [] } = useCategories();

  const summary = useMemo(() => getTasksSummary(tasks), [tasks]);
  const recentTasks = useMemo(
    () => tasks.filter((t) => t.status === "todo").slice(0, 6),
    [tasks],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Bom dia 👋</h1>
        <p className="text-muted-foreground">Veja o que está acontecendo com suas tarefas hoje.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <CircleDashed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Fazer</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.by_status.todo ?? 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.by_status.done ?? 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Atrasadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{summary.overdue}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adição Rápida</CardTitle>
              <CardDescription>Capture tarefas antes de esquecer.</CardDescription>
            </CardHeader>
            <CardContent>
              <QuickAddTask categories={categories} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Prioridade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(["high", "medium", "low"] as const).map((p) => (
                  <div key={p} className="flex items-center">
                    <div className="w-1/3 text-sm font-medium capitalize">
                      {p === "high" ? "Alta" : p === "medium" ? "Média" : "Baixa"}
                    </div>
                    <div className="w-2/3 flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full ${p === "high" ? "bg-destructive" : p === "medium" ? "bg-primary" : "bg-chart-2"}`}
                          style={{
                            width: summary.total
                              ? `${((summary.by_priority[p] ?? 0) / summary.total) * 100}%`
                              : "0%",
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-6 text-right">
                        {summary.by_priority[p] ?? 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Tarefas Pendentes Recentes</CardTitle>
            <CardDescription>Suas últimas tarefas a fazer.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3">
              {recentTasks.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg border-muted">
                  Sem tarefas pendentes. Tudo em dia! 🎉
                </div>
              ) : (
                recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox checked={false} disabled />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        {task.category_name && (
                          <Badge
                            variant="outline"
                            className="text-[10px] mt-0.5"
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
                      className="capitalize text-[10px]"
                    >
                      {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
