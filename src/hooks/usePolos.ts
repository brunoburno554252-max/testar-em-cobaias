import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Polo {
  id: string;
  nome: string;
  telefone: string | null;
  created_at: string;
}

export const usePolos = () => {
  const queryClient = useQueryClient();

  const polosQuery = useQuery({
    queryKey: ['polos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('polos')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      return data as Polo[];
    },
  });

  const createPolo = useMutation({
    mutationFn: async (polo: { nome: string; telefone?: string }) => {
      const { data, error } = await supabase
        .from('polos')
        .insert(polo)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polos'] });
      toast.success("Polo criado com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating polo:", error);
      toast.error("Erro ao criar polo");
    },
  });

  const updatePolo = useMutation({
    mutationFn: async ({ id, ...polo }: { id: string; nome: string; telefone?: string }) => {
      const { data, error } = await supabase
        .from('polos')
        .update(polo)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polos'] });
      toast.success("Polo atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating polo:", error);
      toast.error("Erro ao atualizar polo");
    },
  });

  const deletePolo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('polos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polos'] });
      toast.success("Polo excluído com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting polo:", error);
      toast.error("Erro ao excluir polo");
    },
  });

  return {
    polos: polosQuery.data ?? [],
    isLoading: polosQuery.isLoading,
    error: polosQuery.error,
    createPolo,
    updatePolo,
    deletePolo,
  };
};
