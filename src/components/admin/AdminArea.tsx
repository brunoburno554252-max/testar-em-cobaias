import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProdutividadeDiaria from "@/components/ProdutividadeDiaria";
import PolosManager from "./PolosManager";
import ModalidadesManager from "./ModalidadesManager";
import CursosManager from "./CursosManager";

interface AdminAreaProps {
  onBack: () => void;
}

const AdminArea = ({ onBack }: AdminAreaProps) => {
  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pattern-grid opacity-50" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              className="glass"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-emerald-500">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold">
                  Área Administrativa
                </h1>
                <p className="text-muted-foreground">
                  Gerencie polos, modalidades e cursos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="produtividade" className="w-full">
          <TabsList className="glass mb-6 flex-wrap h-auto p-1">
            <TabsTrigger value="produtividade" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Produtividade
            </TabsTrigger>
            <TabsTrigger value="polos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Polos
            </TabsTrigger>
            <TabsTrigger value="modalidades" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Modalidades
            </TabsTrigger>
            <TabsTrigger value="cursos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Cursos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="produtividade">
            <ProdutividadeDiaria onBack={() => {}} />
          </TabsContent>

          <TabsContent value="polos">
            <PolosManager />
          </TabsContent>

          <TabsContent value="modalidades">
            <ModalidadesManager />
          </TabsContent>

          <TabsContent value="cursos">
            <CursosManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminArea;
