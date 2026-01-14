import { ArrowLeft, RefreshCw, Trophy, Users, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProdutividadeDiaria } from "@/hooks/useProdutividadeDiaria";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProdutividadeDiariaProps {
  onBack: () => void;
}

const ProdutividadeDiaria = ({ onBack }: ProdutividadeDiariaProps) => {
  const { data, isLoading, refetch, isFetching } = useProdutividadeDiaria();

  const hoje = new Date();
  const dataFormatada = format(hoje, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return null;
    }
  };

  const formatSessao = (sessao: string) => {
    const nomes: Record<string, string> = {
      'matriculas': 'Matrículas',
      'pre-matricula': 'Pré-Matrícula',
      'certificacao': 'Certificação',
      'competencia': 'Competência',
      'pedagogia': 'Pedagogia',
      'secretaria': 'Secretaria',
      'atendimento': 'Atendimento',
      'ouvidoria': 'Ouvidoria',
      'central-licenciados': 'Central Licenciados',
    };
    return nomes[sessao] || sessao;
  };

  const maxTotal = data?.resumoPorColaborador[0]?.total || 1;

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pattern-grid opacity-50" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onBack}
              className="glass hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: 'var(--gradient-primary)' }}>
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl md:text-3xl font-display font-bold">
                  <span className="gradient-text">Produtividade</span> do Dia
                </h1>
              </div>
              <p className="text-muted-foreground mt-1 capitalize">{dataFormatada}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 glass"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="glass border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Registros Hoje
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data?.totalRegistros || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Atualiza automaticamente a cada 30 segundos
              </p>
            </CardContent>
          </Card>
          <Card className="glass border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Colaboradores Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data?.totalColaboradores || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Que fizeram ao menos 1 registro hoje
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table - Detailed View */}
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-primary" />
                Detalhamento por Sessão
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : data?.itens.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum registro hoje ainda.</p>
                  <p className="text-sm">Os dados aparecerão conforme os colaboradores registrarem.</p>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Colaborador</TableHead>
                        <TableHead>Sessão</TableHead>
                        <TableHead className="text-right">Qtd</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.itens.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.colaborador}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                              {formatSessao(item.sessao)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-bold">{item.quantidade}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ranking */}
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="w-5 h-5 text-primary" />
                Ranking do Dia
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : data?.resumoPorColaborador.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum colaborador registrou hoje.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data?.resumoPorColaborador.map((item, index) => (
                    <div key={item.colaborador} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getMedalIcon(index)}</span>
                          <span className="font-medium truncate max-w-[180px]">{item.colaborador}</span>
                        </div>
                        <span className="font-bold text-primary">{item.total}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(item.total / maxTotal) * 100}%`,
                            background: index < 3 ? 'var(--gradient-primary)' : 'hsl(var(--muted-foreground) / 0.3)'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProdutividadeDiaria;
