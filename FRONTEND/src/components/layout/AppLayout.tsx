import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { ReportBugDialog } from "@/components/bugs/ReportBugDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function AppLayout({ children }: { children: ReactNode }) {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 md:p-8 max-w-7xl animate-in fade-in duration-500">
          {children}
        </div>
      </main>
      
      <Button
        className="fixed bottom-8 right-8 rounded-full h-16 w-16 shadow-xl z-50 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        onClick={() => setReportOpen(true)}
        aria-label="Reportar Bug"
      >
        <Plus className="h-8 w-8" />
      </Button>
      
      <ReportBugDialog open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  );
}
