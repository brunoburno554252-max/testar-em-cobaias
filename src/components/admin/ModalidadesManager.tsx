import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useModalidades, Modalidade } from "@/hooks/useModalidades";

const ModalidadesManager = () => {
  const { modalidades, isLoading, createModalidade, updateModalidade, deleteModalidade } = useModalidades();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingModalidade, setEditingModalidade] = useState<Modalidade | null>(null);
  const [deletingModalidade, setDeletingModalidade] = useState<Modalidade | null>(null);
  const [formData, setFormData] = useState({ nome: "" });

  const filteredModalidades = modalidades.filter(modalidade =>
    modalidade.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (modalidade?: Modalidade) => {
    if (modalidade) {
      setEditingModalidade(modalidade);
      setFormData({ nome: modalidade.nome });
    } else {
      setEditingModalidade(null);
      setFormData({ nome: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) return;

    if (editingModalidade) {
      await updateModalidade.mutateAsync({
        id: editingModalidade.id,
        nome: formData.nome,
      });
    } else {
      await createModalidade.mutateAsync({
        nome: formData.nome,
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingModalidade) return;
    await deleteModalidade.mutateAsync(deletingModalidade.id);
    setIsDeleteDialogOpen(false);
    setDeletingModalidade(null);
  };

  const openDeleteDialog = (modalidade: Modalidade) => {
    setDeletingModalidade(modalidade);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Carregando modalidades...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-display">
          Gerenciar Modalidades ({filteredModalidades.length})
        </CardTitle>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Modalidade
        </Button>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModalidades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    Nenhuma modalidade encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredModalidades.map((modalidade) => (
                  <TableRow key={modalidade.id}>
                    <TableCell className="font-medium">{modalidade.nome}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(modalidade)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(modalidade)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingModalidade ? "Editar Modalidade" : "Adicionar Modalidade"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ nome: e.target.value })}
                placeholder="Nome da modalidade"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.nome.trim() || createModalidade.isPending || updateModalidade.isPending}
            >
              {createModalidade.isPending || updateModalidade.isPending ? "Salvando..." : "Salvar"}
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
              Tem certeza que deseja excluir a modalidade "{deletingModalidade?.nome}"?
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

export default ModalidadesManager;
