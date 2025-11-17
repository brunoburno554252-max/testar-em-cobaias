import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, Calendar, User, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface RegistroPageProps {
  username: string;
  onBack: () => void;
}

interface Registro {
  id: string;
  session_key: string;
  line_number: number;
  form_data: any;
  user_name: string;
  form_name: string;
  created_at: string;
  user_id: string;
}

const RegistroPage = ({ username, onBack }: RegistroPageProps) => {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroIdSupabase, setFiltroIdSupabase] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroNomeAluno, setFiltroNomeAluno] = useState("");
  const [cardsVermelhos, setCardsVermelhos] = useState<Set<string>>(new Set());
  const [mostrarApenasVermelhos, setMostrarApenasVermelhos] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    checkAdminStatus();
    loadRegistros();
  }, []);

  const checkAdminStatus = async () => {
    const { data, error } = await supabase.rpc('is_fiz_merda_admin');
    if (!error && data) {
      setIsAdmin(true);
    }
  };

  const loadRegistros = async () => {
    try {
      console.log("🔍 Buscando registros...");
      
      // Count query for pagination
      let countQuery = supabase
        .from("forms_submissions")
        .select("*", { count: 'exact', head: true });
      
      let query = supabase
        .from("forms_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);
      
      console.log("🔑 User ID atual:", (await supabase.auth.getUser()).data.user?.id);

      // Aplicar filtros se houver
      if (filtroIdSupabase) {
        query = query.or(`id::text.ilike.%${filtroIdSupabase}%`);
        countQuery = countQuery.or(`id::text.ilike.%${filtroIdSupabase}%`);
      }
      if (filtroUsuario) {
        // Buscar user_id correspondente ao nome em forms_users
        const { data: userData } = await supabase
          .from("forms_users")
          .select("user_id")
          .ilike("full_name", `%${filtroUsuario}%`);
        
        if (userData && userData.length > 0) {
          const userIds = userData.map(u => u.user_id);
          query = query.in("user_id", userIds);
          countQuery = countQuery.in("user_id", userIds);
        }
      }
      if (filtroNomeAluno) {
        query = query.or(`form_data->>Aluno.ilike.%${filtroNomeAluno}%,form_data->>ALUNO.ilike.%${filtroNomeAluno}%,form_data->>Nome.ilike.%${filtroNomeAluno}%,form_data->>'Aluno/Polo'.ilike.%${filtroNomeAluno}%`);
        countQuery = countQuery.or(`form_data->>Aluno.ilike.%${filtroNomeAluno}%,form_data->>ALUNO.ilike.%${filtroNomeAluno}%,form_data->>Nome.ilike.%${filtroNomeAluno}%,form_data->>'Aluno/Polo'.ilike.%${filtroNomeAluno}%`);
      }

      const { count } = await countQuery;
      setTotalCount(count || 0);

      const { data, error } = await query;

      if (error) {
        console.error("❌ Erro ao buscar:", error);
        throw error;
      }

      console.log("✅ Registros recebidos:", data?.length || 0);
      console.log("📋 IDs recebidos:", data?.map(r => r.id.substring(0, 8)));
      
      // Buscar nomes dos usuários
      const userIds = [...new Set(data?.map(r => r.user_id) || [])];
      const { data: usersData } = await supabase
        .from("forms_users")
        .select("user_id, full_name")
        .in("user_id", userIds);
      
      const userMap = new Map(usersData?.map(u => [u.user_id, u.full_name]) || []);
      
      // Adicionar user_name aos registros
      const registrosComNome = data?.map(r => ({
        ...r,
        user_name: userMap.get(r.user_id) || "Usuário desconhecido"
      })) || [];
      
      setRegistros(registrosComNome);
      
      // Carregar marcações "Fiz merda"
      await loadFizMerda();
    } catch (error: any) {
      console.error("Erro ao carregar registros:", error);
      toast.error("Erro ao carregar registros");
    } finally {
      setIsLoading(false);
    }
  };

  const limparFiltros = () => {
    setFiltroIdSupabase("");
    setFiltroUsuario("");
    setFiltroNomeAluno("");
  };

  const aplicarFiltros = () => {
    setCurrentPage(1); // Reset to first page when filtering
    setIsLoading(true);
    loadRegistros();
  };

  useEffect(() => {
    loadRegistros();
  }, [currentPage]);

  const loadFizMerda = async () => {
    try {
      const { data, error } = await supabase
        .from("fiz_merda")
        .select("submission_id");
      
      if (error) throw error;
      
      const ids = new Set(data?.map(m => m.submission_id) || []);
      setCardsVermelhos(ids);
    } catch (error) {
      console.error("Erro ao carregar marcações:", error);
    }
  };

  const toggleCardVermelho = async (submissionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      const isMarked = cardsVermelhos.has(submissionId);
      
      if (isMarked) {
        // Remover marcação
        const { error } = await supabase
          .from("fiz_merda")
          .delete()
          .eq("submission_id", submissionId)
          .eq("user_id", user.id);
        
        if (error) throw error;
        
        setCardsVermelhos((prev) => {
          const newSet = new Set(prev);
          newSet.delete(submissionId);
          return newSet;
        });
        toast.success("Marcação removida");
      } else {
        // Adicionar marcação
        const { error } = await supabase
          .from("fiz_merda")
          .insert({ 
            submission_id: submissionId,
            user_id: user.id 
          });
        
        if (error) throw error;
        
        setCardsVermelhos((prev) => new Set([...prev, submissionId]));
        toast.success("Marcado como 'Fiz merda'");
      }
    } catch (error: any) {
      console.error("Erro ao marcar registro:", error);
      toast.error("Erro ao salvar marcação");
    }
  };


  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <FileText className="w-8 h-8" />
              Registro de Ações
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Filtros de Pesquisa</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">ID Supabase</label>
                  <Input
                    placeholder="Buscar por ID..."
                    value={filtroIdSupabase}
                    onChange={(e) => setFiltroIdSupabase(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Usuário</label>
                  <Input
                    placeholder="Buscar por usuário..."
                    value={filtroUsuario}
                    onChange={(e) => setFiltroUsuario(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Nome do Aluno</label>
                  <Input
                    placeholder="Buscar por nome do aluno..."
                    value={filtroNomeAluno}
                    onChange={(e) => setFiltroNomeAluno(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap items-center">
                <Button onClick={aplicarFiltros} className="gap-2">
                  <Search className="w-4 h-4" />
                  Buscar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={limparFiltros}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Limpar Filtros
                </Button>
                <div className="flex items-center gap-2 ml-4">
                  <input
                    type="checkbox"
                    id="filtroVermelhos"
                    checked={mostrarApenasVermelhos}
                    onChange={(e) => setMostrarApenasVermelhos(e.target.checked)}
                    className="w-4 h-4 rounded border-input cursor-pointer"
                  />
                  <label htmlFor="filtroVermelhos" className="text-sm font-medium cursor-pointer">
                    Mostrar apenas "Fiz merda" {isAdmin && "(Admin - Visualizando todos)"}
                  </label>
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando registros...</p>
              </div>
            ) : registros.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum registro encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const registrosFiltrados = registros.filter((registro) => 
                    !mostrarApenasVermelhos || cardsVermelhos.has(registro.id)
                  );
                  console.log("📊 Total de registros:", registros.length);
                  console.log("📊 Registros após filtro:", registrosFiltrados.length);
                  console.log("📊 Mostrar apenas vermelhos:", mostrarApenasVermelhos);
                  console.log("📊 Cards vermelhos:", Array.from(cardsVermelhos));
                  return registrosFiltrados;
                })().map((registro) => (
                  <Card 
                    key={registro.id} 
                    className={`border shadow-sm transition-colors ${
                      cardsVermelhos.has(registro.id) ? "bg-destructive/10 border-destructive" : ""
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">Formulário:</span>
                            <span>{registro.form_name}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">Usuário:</span>
                            <span>{registro.user_name}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">Data:</span>
                            <span>
                              {format(new Date(registro.created_at), "dd/MM/yyyy 'às' HH:mm", {
                                locale: ptBR,
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-semibold">ID:</span>
                            <p className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all">
                              {registro.id}
                            </p>
                          </div>
                          
                          <div className="text-sm">
                            <span className="font-semibold">Linha:</span>
                            <span className="ml-2">{registro.line_number}</span>
                          </div>
                        </div>

                        {registro.form_data && Object.keys(registro.form_data).length > 0 && (
                          <div className="md:col-span-2 mt-2">
                            <span className="font-semibold text-sm">Dados:</span>
                            <div className="mt-2 bg-muted p-3 rounded text-xs space-y-1">
                              {Object.entries(registro.form_data).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-semibold">{key}:</span>{" "}
                                  <span>{String(value) || "-"}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="md:col-span-2 mt-4 flex justify-end">
                          <Button
                            variant={cardsVermelhos.has(registro.id) ? "default" : "destructive"}
                            onClick={() => toggleCardVermelho(registro.id)}
                          >
                            {cardsVermelhos.has(registro.id) ? "Desfazer" : "Fiz merda"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!isLoading && registros.length > 0 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.ceil(totalCount / ITEMS_PER_PAGE) }, (_, i) => i + 1)
                      .filter(page => {
                        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
                        return page === 1 || 
                               page === totalPages || 
                               Math.abs(page - currentPage) <= 1;
                      })
                      .map((page, index, array) => (
                        <>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <PaginationItem key={`ellipsis-${page}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalCount / ITEMS_PER_PAGE), p + 1))}
                        className={currentPage >= Math.ceil(totalCount / ITEMS_PER_PAGE) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} de {totalCount} registros
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistroPage;
