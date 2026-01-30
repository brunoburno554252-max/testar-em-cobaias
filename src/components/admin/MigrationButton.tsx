import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, Loader2, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MigrationStats {
  modalidades: number;
  polos: number;
  cursos: number;
  vinculos: number;
}

interface MigrationResult {
  success: boolean;
  message: string;
  stats: MigrationStats;
  errors: MigrationStats;
}

const MigrationButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);

  const handleMigration = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('migrate-mock-data', {
        method: 'POST',
      });

      if (error) {
        throw new Error(error.message);
      }

      setResult(data as MigrationResult);
      setShowResult(true);
      
      if (data.success) {
        toast.success("Migração concluída com sucesso!");
      } else {
        toast.error("Migração falhou. Verifique os detalhes.");
      }
    } catch (error) {
      console.error("Erro na migração:", error);
      toast.error("Erro ao executar migração: " + (error as Error).message);
      setResult({
        success: false,
        message: (error as Error).message,
        stats: { modalidades: 0, polos: 0, cursos: 0, vinculos: 0 },
        errors: { modalidades: 0, polos: 0, cursos: 0, vinculos: 0 },
      });
      setShowResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleMigration}
        disabled={isLoading}
        variant="outline"
        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none hover:from-amber-600 hover:to-orange-600"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Migrando...
          </>
        ) : (
          <>
            <Database className="mr-2 h-4 w-4" />
            Migrar Dados do Mock
          </>
        )}
      </Button>

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {result?.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              {result?.success ? "Migração Concluída" : "Erro na Migração"}
            </DialogTitle>
            <DialogDescription>
              {result?.message}
            </DialogDescription>
          </DialogHeader>
          
          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Registros Inseridos</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Modalidades:</span>
                      <span className="font-medium text-green-600">{result.stats.modalidades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Polos:</span>
                      <span className="font-medium text-green-600">{result.stats.polos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cursos:</span>
                      <span className="font-medium text-green-600">{result.stats.cursos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vínculos:</span>
                      <span className="font-medium text-green-600">{result.stats.vinculos}</span>
                    </div>
                  </div>
                </div>
                
                {(result.errors.modalidades > 0 || result.errors.polos > 0 || 
                  result.errors.cursos > 0 || result.errors.vinculos > 0) && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Erros</h4>
                    <div className="space-y-1 text-sm">
                      {result.errors.modalidades > 0 && (
                        <div className="flex justify-between">
                          <span>Modalidades:</span>
                          <span className="font-medium text-red-600">{result.errors.modalidades}</span>
                        </div>
                      )}
                      {result.errors.polos > 0 && (
                        <div className="flex justify-between">
                          <span>Polos:</span>
                          <span className="font-medium text-red-600">{result.errors.polos}</span>
                        </div>
                      )}
                      {result.errors.cursos > 0 && (
                        <div className="flex justify-between">
                          <span>Cursos:</span>
                          <span className="font-medium text-red-600">{result.errors.cursos}</span>
                        </div>
                      )}
                      {result.errors.vinculos > 0 && (
                        <div className="flex justify-between">
                          <span>Vínculos:</span>
                          <span className="font-medium text-red-600">{result.errors.vinculos}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MigrationButton;
