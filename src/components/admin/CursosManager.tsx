import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { useCursos, Curso } from "@/hooks/useCursos";
import { useModalidades } from "@/hooks/useModalidades";

const CursosManager = () => {
  const { cursos, isLoading, createCurso, updateCurso, deleteCurso } = useCursos();
  const { modalidades } = useModalidades();
  const [search, setSearch] = useState("");
  const [filterModalidade, setFilterModalidade] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [deletingCurso, setDeletingCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState<{ nome: string; modalidadeIds: string[] }>({ 
    nome: "", 
    modalidadeIds: [] 
  });

  const filteredCursos = cursos.filter(curso => {
    const matchesSearch = curso.nome.toLowerCase().includes(search.toLowerCase());
    const matchesModalidade = !filterModalidade || 
      curso.modalidades?.some(m => m.id === filterModalidade);
    return matchesSearch && matchesModalidade;
  });

  const handleOpenDialog = (curso?: Curso) => {
    if (curso) {
      setEditingCurso(curso);
      setFormData({ 
        nome: curso.nome, 
        modalidadeIds: curso.modalidades?.map(m => m.id) || [] 
      });
    } else {
      setEditingCurso(null);
      setFormData({ nome: "", modalidadeIds: [] });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) return;

    if (editingCurso) {
      await updateCurso.mutateAsync({
        id: editingCurso.id,
        nome: formData.nome,
        modalidadeIds: formData.modalidadeIds,
      });
    } else {
      await createCurso.mutateAsync({
        nome: formData.nome,
        modalidadeIds: formData.modalidadeIds,
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingCurso) return;
    await deleteCurso.mutateAsync(deletingCurso.id);
    setIsDeleteDialogOpen(false);
    setDeletingCurso(null);
  };

  const openDeleteDialog = (curso: Curso) => {
    setDeletingCurso(curso);
    setIsDeleteDialogOpen(true);
  };

  const toggleModalidade = (modalidadeId: string) => {
    setFormData(prev => ({
      ...prev,
      modalidadeIds: prev.modalidadeIds.includes(modalidadeId)
        ? prev.modalidadeIds.filter(id => id !== modalidadeId)
        : [...prev.modalidadeIds, modalidadeId]
    }));
  };

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Carregando cursos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-display">
          Gerenciar Cursos ({filteredCursos.length})
        </CardTitle>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Curso
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterModalidade}
            onChange={(e) => setFilterModalidade(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="">Todas as modalidades</option>
            {modalidades.map((mod) => (
              <option key={mod.id} value={mod.id}>
                {mod.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Modalidades</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCursos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Nenhum curso encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredCursos.map((curso) => (
                  <TableRow key={curso.id}>
                    <TableCell className="font-medium">{curso.nome}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {curso.modalidades?.map((mod) => (
                          <Badge key={mod.id} variant="secondary" className="text-xs">
                            {mod.nome}
                          </Badge>
                        ))}
                        {(!curso.modalidades || curso.modalidades.length === 0) && (
                          <span className="text-muted-foreground text-sm">Sem modalidade</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(curso)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(curso)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCurso ? "Editar Curso" : "Adicionar Curso"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Curso</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome do curso"
              />
            </div>
            <div className="space-y-2">
              <Label>Modalidades</Label>
              <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                {modalidades.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Nenhuma modalidade cadastrada
                  </p>
                ) : (
                  modalidades.map((mod) => (
                    <div key={mod.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mod-${mod.id}`}
                        checked={formData.modalidadeIds.includes(mod.id)}
                        onCheckedChange={() => toggleModalidade(mod.id)}
                      />
                      <label
                        htmlFor={`mod-${mod.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {mod.nome}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.nome.trim() || createCurso.isPending || updateCurso.isPending}
            >
              {createCurso.isPending || updateCurso.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o curso "{deletingCurso?.nome}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CursosManager;
