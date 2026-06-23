import { useState } from "react";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/use-categories";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  color: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Categories() {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", color: "#808080" },
  });

  const onSubmit = (data: FormValues) => {
    createCategory.mutate(
      { name: data.name, color: data.color || "#808080" },
      {
        onSuccess: () => {
          toast({ title: "Categoria criada" });
          form.reset();
        },
        onError: () => toast({ title: "Erro ao criar categoria", variant: "destructive" }),
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteCategory.mutate(id, {
      onSuccess: () => toast({ title: "Categoria excluída" }),
      onError: () => toast({ title: "Erro ao excluir categoria", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Categorias</h1>
        <p className="text-muted-foreground text-sm">Organize suas tarefas em grupos temáticos.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Adicionar Categoria</CardTitle>
            <CardDescription>Crie uma nova tag para suas tarefas</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Nome da categoria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="color"
                          className="h-8 w-14 p-0 border-0 bg-transparent cursor-pointer rounded-md overflow-hidden"
                          {...field}
                        />
                      </FormControl>
                      <span className="text-sm text-muted-foreground uppercase">
                        {field.value}
                      </span>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createCategory.isPending}>
                  {createCategory.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  )}
                  Criar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-card text-muted-foreground text-sm">
              Nenhuma categoria criada ainda.
            </div>
          ) : (
            categories.map((cat) => (
              <Card key={cat.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full border border-black/10 shadow-inner"
                    style={{ backgroundColor: cat.color || "#ccc" }}
                  />
                  <span className="font-medium">{cat.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(cat.id)}
                  disabled={deleteCategory.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
