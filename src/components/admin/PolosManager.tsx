import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Phone } from "lucide-react";
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
import { usePolos, Polo } from "@/hooks/usePolos";

const PolosManager = () => {
  const { polos, isLoading, createPolo, updatePolo, deletePolo } = usePolos();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPolo, setEditingPolo] = useState<Polo | null>(null);
  const [deletingPolo, setDeletingPolo] = useState<Polo | null>(null);
  const [formData, setFormData] = useState({ nome: "", telefone: "" });

  const filteredPolos = polos.filter(polo =>
    polo.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (polo?: Polo) => {
    if (polo) {
      setEditingPolo(polo);
      setFormData({ nome: polo.nome, telefone: polo.telefone || "" });
    } else {
      setEditingPolo(null);
      setFormData({ nome: "", telefone: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) return;

    if (editingPolo) {
      await updatePolo.mutateAsync({
        id: editingPolo.id,
        nome: formData.nome,
        telefone: formData.telefone || undefined,
      });
    } else {
      await createPolo.mutateAsync({
        nome: formData.nome,
        telefone: formData.telefone || undefined,
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingPolo) return;
    await deletePolo.mutateAsync(deletingPolo.id);
    setIsDeleteDialogOpen(false);
    setDeletingPolo(null);
  };

  const openDeleteDialog = (polo: Polo) => {
    setDeletingPolo(polo);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Carregando polos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-display">
          Gerenciar Polos ({filteredPolos.length})
        </CardTitle>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Polo
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
                <TableHead>Telefone</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Nenhum polo encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredPolos.map((polo) => (
                  <TableRow key={polo.id}>
                    <TableCell className="font-medium">{polo.nome}</TableCell>
                    <TableCell>
                      {polo.telefone && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {polo.telefone}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(polo)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(polo)}
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
              {editingPolo ? "Editar Polo" : "Adicionar Polo"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome do polo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.nome.trim() || createPolo.isPending || updatePolo.isPending}
            >
              {createPolo.isPending || updatePolo.isPending ? "Salvando..." : "Salvar"}
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
              Tem certeza que deseja excluir o polo "{deletingPolo?.nome}"?
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

export default PolosManager;
