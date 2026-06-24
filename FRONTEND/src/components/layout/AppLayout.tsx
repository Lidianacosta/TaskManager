import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { ReportBugDialog } from "@/components/bugs/ReportBugDialog";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";

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
        className="fixed bottom-8 right-8 rounded-full shadow-xl z-50 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 font-medium w-14 h-14 p-0 sm:w-auto sm:h-12 sm:px-4 sm:py-3 sm:gap-2"
        onClick={() => setReportOpen(true)}
        aria-label="Solicitar Mudança"
      >
        <MessageSquarePlus className="h-6 w-6 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline text-sm">Solicitar Mudança</span>
      </Button>
      
      <ReportBugDialog open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  );
}
