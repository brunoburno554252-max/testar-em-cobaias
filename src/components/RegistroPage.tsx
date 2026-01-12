import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, Calendar, User, Search, X, ClipboardList, AlertTriangle, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  
  // States for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [registroToDelete, setRegistroToDelete] = useState<Registro | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // States for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [registroToEdit, setRegistroToEdit] = useState<Registro | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Current user ID for permission checks
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
    loadRegistros();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const checkAdminStatus = async () => {
    const { data, error } = await supabase.rpc('is_fiz_merda_admin');
    if (!error && data) {
      setIsAdmin(true);
    }
  };

  const loadRegistros = async () => {
    try {
      const { data: allData, error } = await supabase
        .from("forms_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      let filteredData = allData || [];
      
      if (filtroIdSupabase) {
        const searchId = filtroIdSupabase.toLowerCase();
        filteredData = filteredData.filter(registro => 
          registro.id.toLowerCase().includes(searchId)
        );
      }
      
      if (filtroUsuario) {
        const { data: userData } = await supabase
          .from("forms_users")
          .select("user_id")
          .ilike("full_name", `%${filtroUsuario}%`);
        
        if (userData && userData.length > 0) {
          const userIds = new Set(userData.map(u => u.user_id));
          filteredData = filteredData.filter(registro => 
            userIds.has(registro.user_id)
          );
        } else {
          filteredData = [];
        }
      }
      
      if (filtroNomeAluno) {
        const searchTerm = filtroNomeAluno.toLowerCase();
        filteredData = filteredData.filter(registro => {
          const formData = registro.form_data as any;
          const aluno = formData?.Aluno?.toLowerCase() || '';
          const alunoUpper = formData?.ALUNO?.toLowerCase() || '';
          const nome = formData?.Nome?.toLowerCase() || '';
          const alunoPolo = formData?.['Aluno/Polo']?.toLowerCase() || '';
          
          return aluno.includes(searchTerm) || 
                 alunoUpper.includes(searchTerm) || 
                 nome.includes(searchTerm) || 
                 alunoPolo.includes(searchTerm);
        });
      }

      const totalFiltered = filteredData.length;
      setTotalCount(totalFiltered);
      
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      const userIds = [...new Set(paginatedData?.map(r => r.user_id) || [])];
      const { data: usersData } = await supabase
        .from("forms_users")
        .select("user_id, full_name")
        .in("user_id", userIds);
      
      const userMap = new Map(usersData?.map(u => [u.user_id, u.full_name]) || []);
      
      const registrosComNome = paginatedData?.map(r => ({
        ...r,
        user_name: userMap.get(r.user_id) || "Usuário desconhecido"
      })) || [];
      
      setRegistros(registrosComNome);
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
    setCurrentPage(1);
    setTimeout(() => {
      setIsLoading(true);
      loadRegistros();
    }, 0);
  };

  const aplicarFiltros = () => {
    setCurrentPage(1);
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

  // Check if user can edit/delete a registro
  const canModifyRegistro = (registro: Registro) => {
    return isAdmin || registro.user_id === currentUserId;
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (registro: Registro) => {
    setRegistroToDelete(registro);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!registroToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("forms_submissions")
        .delete()
        .eq("id", registroToDelete.id);
      
      if (error) throw error;
      
      toast.success("Registro excluído com sucesso");
      setDeleteDialogOpen(false);
      setRegistroToDelete(null);
      loadRegistros();
    } catch (error: any) {
      console.error("Erro ao excluir registro:", error);
      toast.error("Erro ao excluir registro");
    } finally {
      setIsDeleting(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (registro: Registro) => {
    setRegistroToEdit(registro);
    setEditFormData(registro.form_data || {});
    setEditDialogOpen(true);
  };

  // Handle edit form field change
  const handleEditFieldChange = (key: string, value: string) => {
    setEditFormData(prev => ({ ...prev, [key]: value }));
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!registroToEdit) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("forms_submissions")
        .update({ form_data: editFormData, updated_at: new Date().toISOString() })
        .eq("id", registroToEdit.id);
      
      if (error) throw error;
      
      toast.success("Registro atualizado com sucesso");
      setEditDialogOpen(false);
      setRegistroToEdit(null);
      loadRegistros();
    } catch (error: any) {
      console.error("Erro ao atualizar registro:", error);
      toast.error("Erro ao atualizar registro");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pattern-grid opacity-30" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2 hover:bg-secondary/80 animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <Card className="glass-strong shadow-card border-0 animate-scale-in">
          <CardHeader className="border-b border-border/50 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'var(--gradient-primary)' }}>
                <ClipboardList className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-3xl font-display">
                  Registro de Ações
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  {totalCount} registros encontrados
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Filters */}
            <div className="mb-8 p-6 bg-secondary/30 rounded-2xl space-y-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg">Filtros de Pesquisa</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">ID Supabase</label>
                  <Input
                    placeholder="Buscar por ID..."
                    value={filtroIdSupabase}
                    onChange={(e) => setFiltroIdSupabase(e.target.value)}
                    className="h-11 bg-card/50 border-border/50 focus:bg-card"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Usuário</label>
                  <Input
                    placeholder="Buscar por usuário..."
                    value={filtroUsuario}
                    onChange={(e) => setFiltroUsuario(e.target.value)}
                    className="h-11 bg-card/50 border-border/50 focus:bg-card"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Nome do Aluno</label>
                  <Input
                    placeholder="Buscar por nome do aluno..."
                    value={filtroNomeAluno}
                    onChange={(e) => setFiltroNomeAluno(e.target.value)}
                    className="h-11 bg-card/50 border-border/50 focus:bg-card"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 flex-wrap items-center pt-2">
                <Button 
                  onClick={aplicarFiltros} 
                  className="gap-2 h-11 shadow-lg hover:shadow-xl transition-all"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <Search className="w-4 h-4" />
                  Buscar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={limparFiltros}
                  className="gap-2 h-11 hover:bg-secondary/80"
                >
                  <X className="w-4 h-4" />
                  Limpar
                </Button>
                <label className="flex items-center gap-3 ml-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={mostrarApenasVermelhos}
                    onChange={(e) => setMostrarApenasVermelhos(e.target.checked)}
                    className="w-5 h-5 rounded-md border-2 border-destructive/50 text-destructive focus:ring-destructive cursor-pointer"
                  />
                  <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                    Mostrar apenas "Fiz merda" {isAdmin && <span className="text-muted-foreground">(Admin)</span>}
                  </span>
                </label>
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando registros...</p>
              </div>
            ) : registros.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg">Nenhum registro encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {registros
                  .filter((registro) => !mostrarApenasVermelhos || cardsVermelhos.has(registro.id))
                  .map((registro, index) => (
                    <Card 
                      key={registro.id} 
                      className={`border shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in overflow-hidden ${
                        cardsVermelhos.has(registro.id) 
                          ? "bg-destructive/5 border-destructive/30 hover:border-destructive/50" 
                          : "bg-card/50 hover:bg-card"
                      }`}
                      style={{ animationDelay: `${0.05 * index}s` }}
                    >
                      {cardsVermelhos.has(registro.id) && (
                        <div className="h-1 w-full" style={{ background: 'var(--gradient-primary)' }} />
                      )}
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground">Formulário</span>
                                <p className="font-medium">{registro.form_name}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground">Usuário</span>
                                <p className="font-medium">{registro.user_name}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground">Data</span>
                                <p className="font-medium">
                                  {format(new Date(registro.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <span className="text-xs text-muted-foreground">ID</span>
                              <p className="font-mono text-xs bg-secondary/50 p-2.5 rounded-lg mt-1 break-all">
                                {registro.id}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Linha:</span>
                              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary">
                                {registro.line_number}
                              </span>
                            </div>
                          </div>

                          {registro.form_data && Object.keys(registro.form_data).length > 0 && (
                            <div className="md:col-span-2">
                              <span className="text-xs text-muted-foreground mb-2 block">Dados do Formulário</span>
                              <div className="bg-secondary/30 p-4 rounded-xl text-sm space-y-1.5">
                                {Object.entries(registro.form_data).map(([key, value]) => (
                                  <div key={key} className="flex gap-2">
                                    <span className="font-medium text-muted-foreground min-w-[100px]">{key}:</span>
                                    <span className="text-foreground">{String(value) || "-"}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="md:col-span-2 flex justify-end gap-2 pt-2 flex-wrap">
                            {canModifyRegistro(registro) && (
                              <>
                                <Button
                                  variant="outline"
                                  onClick={() => openEditDialog(registro)}
                                  className="gap-2"
                                >
                                  <Pencil className="w-4 h-4" />
                                  Editar
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => openDeleteDialog(registro)}
                                  className="gap-2 text-destructive border-destructive/50 hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Excluir
                                </Button>
                              </>
                            )}
                            <Button
                              variant={cardsVermelhos.has(registro.id) ? "outline" : "destructive"}
                              onClick={() => toggleCardVermelho(registro.id)}
                              className="gap-2"
                            >
                              <AlertTriangle className="w-4 h-4" />
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
              <div className="mt-8 flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalCount)} - {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} de {totalCount}
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-secondary"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.ceil(totalCount / ITEMS_PER_PAGE) }, (_, i) => i + 1)
                      .filter(page => {
                        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
                        return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                      })
                      .map((page, index, array) => (
                        <span key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className={`cursor-pointer ${currentPage === page ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </span>
                      ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalCount / ITEMS_PER_PAGE), p + 1))}
                        className={currentPage >= Math.ceil(totalCount / ITEMS_PER_PAGE) ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-secondary"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
              {registroToDelete && (
                <div className="mt-3 p-3 bg-secondary/50 rounded-lg text-sm">
                  <p><strong>Formulário:</strong> {registroToDelete.form_name}</p>
                  <p><strong>Usuário:</strong> {registroToDelete.user_name}</p>
                  <p><strong>ID:</strong> {registroToDelete.id}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Registro</DialogTitle>
          </DialogHeader>
          
          {registroToEdit && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                <div><strong>Formulário:</strong> {registroToEdit.form_name}</div>
                <div><strong>Usuário:</strong> {registroToEdit.user_name}</div>
              </div>
              
              <div className="space-y-4">
                {Object.entries(editFormData).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{key}</Label>
                    <Input
                      id={key}
                      value={String(value) || ""}
                      onChange={(e) => handleEditFieldChange(key, e.target.value)}
                      className="bg-card/50"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistroPage;