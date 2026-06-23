import { useState, useMemo } from "react";
import { useBugs } from "@/hooks/use-bugs";
import { Card } from "@/components/ui/card";
import { Bug, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function Bugs() {
  const { data: bugs = [], isLoading } = useBugs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Bugs
          </h1>
          <p className="text-muted-foreground text-sm">
            Listagem pública de bugs registrados.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {bugs.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg border-muted">
            <Bug className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="text-lg font-medium">Nenhum bug encontrado</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Nenhum bug no momento.
            </p>
          </div>
        ) : (
          bugs.map((bug, index) => (
            <Card
              key={bug.id ?? index}
              className="p-4 flex items-center gap-4 transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{bug.title}</p>
                {bug.description && (
                  <p className="text-sm text-muted-foreground truncate">{bug.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {bug.created_at ? format(new Date(bug.created_at), "dd/MM/yyyy") : "Data indisponível"}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
