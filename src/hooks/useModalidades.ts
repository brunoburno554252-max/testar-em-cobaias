import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Modalidade {
  id: string;
  nome: string;
  created_at: string;
}

export const useModalidades = () => {
  const queryClient = useQueryClient();

  const modalidadesQuery = useQuery({
    queryKey: ['modalidades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modalidades')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      return data as Modalidade[];
    },
  });

  const createModalidade = useMutation({
    mutationFn: async (modalidade: { nome: string }) => {
      const { data, error } = await supabase
        .from('modalidades')
        .insert(modalidade)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modalidades'] });
      toast.success("Modalidade criada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating modalidade:", error);
      toast.error("Erro ao criar modalidade");
    },
  });

  const updateModalidade = useMutation({
    mutationFn: async ({ id, nome }: { id: string; nome: string }) => {
      const { data, error } = await supabase
        .from('modalidades')
        .update({ nome })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modalidades'] });
      toast.success("Modalidade atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating modalidade:", error);
      toast.error("Erro ao atualizar modalidade");
    },
  });

  const deleteModalidade = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('modalidades')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modalidades'] });
      toast.success("Modalidade excluída com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting modalidade:", error);
      toast.error("Erro ao excluir modalidade");
    },
  });

  return {
    modalidades: modalidadesQuery.data ?? [],
    isLoading: modalidadesQuery.isLoading,
    error: modalidadesQuery.error,
    createModalidade,
    updateModalidade,
    deleteModalidade,
  };
};
