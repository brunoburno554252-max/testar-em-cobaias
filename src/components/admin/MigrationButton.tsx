import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, Loader2, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MigrationResponse {
  success: boolean;
  phase: string;
  processed: number;
  total: number;
  hasMore: boolean;
  nextOffset: number;
  message: string;
  stats: { inserted: number; errors: number };
}

const PHASES = ['modalidades', 'polos', 'cursos', 'vinculos'] as const;
type Phase = typeof PHASES[number];

const MigrationButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('modalidades');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [totalStats, setTotalStats] = useState({ inserted: 0, errors: 0 });
  const [isComplete, setIsComplete] = useState(false);

  const handleMigration = async () => {
    setIsLoading(true);
    setShowProgress(true);
    setIsComplete(false);
    setTotalStats({ inserted: 0, errors: 0 });
    
    let phase: Phase = 'modalidades';
    let offset = 0;
    const batchSize = 100;

    try {
      while (true) {
        setCurrentPhase(phase);
        
        const { data, error } = await supabase.functions.invoke<MigrationResponse>('migrate-mock-data', {
          body: { phase, offset, batchSize }
        });

        if (error) throw new Error(error.message);
        if (!data) throw new Error('Sem resposta da função');

        setStatusMessage(data.message);
        setProgress(Math.round((data.processed + offset) / data.total * 100));
        setTotalStats(prev => ({
          inserted: prev.inserted + data.stats.inserted,
          errors: prev.errors + data.stats.errors
        }));

        if (data.hasMore) {
          offset = data.nextOffset;
        } else {
          // Próxima fase
          const currentIndex = PHASES.indexOf(phase);
          if (currentIndex < PHASES.length - 1) {
            phase = PHASES[currentIndex + 1];
            offset = 0;
          } else {
            // Migração completa
            setIsComplete(true);
            toast.success("Migração concluída com sucesso!");
            break;
          }
        }
      }
    } catch (error) {
      console.error("Erro na migração:", error);
      toast.error("Erro: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const getPhaseLabel = (phase: Phase) => {
    const labels: Record<Phase, string> = {
      modalidades: 'Modalidades',
      polos: 'Polos',
      cursos: 'Cursos',
      vinculos: 'Vínculos'
    };
    return labels[phase];
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

      <Dialog open={showProgress} onOpenChange={setShowProgress}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              {isComplete ? "Migração Concluída" : isLoading ? "Migrando..." : "Migração"}
            </DialogTitle>
            <DialogDescription>
              {statusMessage || "Iniciando migração..."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fase: {getPhaseLabel(currentPhase)}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground">Inseridos:</span>
                <p className="font-medium text-green-600">{totalStats.inserted}</p>
              </div>
              {totalStats.errors > 0 && (
                <div className="space-y-1">
                  <span className="text-muted-foreground">Erros:</span>
                  <p className="font-medium text-red-600">{totalStats.errors}</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MigrationButton;
