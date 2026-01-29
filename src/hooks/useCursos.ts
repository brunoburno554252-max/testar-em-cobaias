import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Curso {
  id: string;
  nome: string;
  created_at: string;
  modalidades?: { id: string; nome: string }[];
}

export interface CursoModalidade {
  id: string;
  curso_id: string;
  modalidade_id: string;
}

export const useCursos = () => {
  const queryClient = useQueryClient();

  const cursosQuery = useQuery({
    queryKey: ['cursos'],
    queryFn: async () => {
      const { data: cursos, error: cursosError } = await supabase
        .from('cursos')
        .select('*')
        .order('nome');
      
      if (cursosError) throw cursosError;

      const { data: vinculos, error: vinculosError } = await supabase
        .from('curso_modalidades')
        .select('curso_id, modalidade_id, modalidades(id, nome)');
      
      if (vinculosError) throw vinculosError;

      // Map modalidades to each curso
      const cursosWithModalidades = cursos.map(curso => ({
        ...curso,
        modalidades: vinculos
          .filter(v => v.curso_id === curso.id)
          .map(v => v.modalidades as unknown as { id: string; nome: string })
          .filter(Boolean),
      }));

      return cursosWithModalidades as Curso[];
    },
  });

  const createCurso = useMutation({
    mutationFn: async ({ nome, modalidadeIds }: { nome: string; modalidadeIds: string[] }) => {
      // Create curso
      const { data: curso, error: cursoError } = await supabase
        .from('cursos')
        .insert({ nome })
        .select()
        .single();
      
      if (cursoError) throw cursoError;

      // Create vinculos
      if (modalidadeIds.length > 0) {
        const vinculos = modalidadeIds.map(modalidade_id => ({
          curso_id: curso.id,
          modalidade_id,
        }));

        const { error: vinculosError } = await supabase
          .from('curso_modalidades')
          .insert(vinculos);
        
        if (vinculosError) throw vinculosError;
      }

      return curso;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      toast.success("Curso criado com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating curso:", error);
      toast.error("Erro ao criar curso");
    },
  });

  const updateCurso = useMutation({
    mutationFn: async ({ id, nome, modalidadeIds }: { id: string; nome: string; modalidadeIds: string[] }) => {
      // Update curso nome
      const { error: cursoError } = await supabase
        .from('cursos')
        .update({ nome })
        .eq('id', id);
      
      if (cursoError) throw cursoError;

      // Delete old vinculos
      const { error: deleteError } = await supabase
        .from('curso_modalidades')
        .delete()
        .eq('curso_id', id);
      
      if (deleteError) throw deleteError;

      // Create new vinculos
      if (modalidadeIds.length > 0) {
        const vinculos = modalidadeIds.map(modalidade_id => ({
          curso_id: id,
          modalidade_id,
        }));

        const { error: vinculosError } = await supabase
          .from('curso_modalidades')
          .insert(vinculos);
        
        if (vinculosError) throw vinculosError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      toast.success("Curso atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating curso:", error);
      toast.error("Erro ao atualizar curso");
    },
  });

  const deleteCurso = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cursos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      toast.success("Curso excluído com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting curso:", error);
      toast.error("Erro ao excluir curso");
    },
  });

  return {
    cursos: cursosQuery.data ?? [],
    isLoading: cursosQuery.isLoading,
    error: cursosQuery.error,
    createCurso,
    updateCurso,
    deleteCurso,
  };
};
