import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateTask } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, PlusCircle } from "lucide-react";
import type { Category } from "@/lib/api";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

type FormValues = z.infer<typeof formSchema>;

interface QuickAddTaskProps {
  categories?: Category[];
}

export function QuickAddTask({ categories: _categories }: QuickAddTaskProps) {
  const { toast } = useToast();
  const createTask = useCreateTask();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", priority: "medium" },
  });

  const onSubmit = (data: FormValues) => {
    createTask.mutate(
      { title: data.title, priority: data.priority },
      {
        onSuccess: () => {
          toast({ title: "Tarefa adicionada" });
          form.reset();
        },
        onError: () => toast({ title: "Erro ao criar tarefa", variant: "destructive" }),
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="O que precisa ser feito?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" disabled={createTask.isPending}>
          {createTask.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="h-4 w-4" />
          )}
        </Button>
      </form>
    </Form>
  );
}
