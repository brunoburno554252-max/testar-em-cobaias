import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProdutividadeItem {
  colaborador: string;
  sessao: string;
  quantidade: number;
}

interface ProdutividadeResumo {
  colaborador: string;
  total: number;
}

interface ProdutividadeData {
  itens: ProdutividadeItem[];
  resumoPorColaborador: ProdutividadeResumo[];
  totalRegistros: number;
  totalColaboradores: number;
}

export const useProdutividadeDiaria = () => {
  return useQuery({
    queryKey: ['produtividade-diaria', new Date().toDateString()],
    queryFn: async (): Promise<ProdutividadeData> => {
      // Get start of today in local timezone (Brazil)
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      // Fetch all submissions from today
      const { data: submissions, error } = await supabase
        .from('forms_submissions')
        .select(`
          user_id,
          session_key,
          created_at
        `)
        .gte('created_at', hoje.toISOString());

      if (error) {
        console.error('Error fetching produtividade:', error);
        throw error;
      }

      // Get unique user IDs
      const userIds = [...new Set(submissions?.map(s => s.user_id).filter(Boolean))];
      
      // Fetch user names
      let usersMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: users } = await supabase
          .from('forms_users')
          .select('user_id, full_name')
          .in('user_id', userIds);
        
        users?.forEach(u => {
          usersMap[u.user_id] = u.full_name || 'Desconhecido';
        });
      }

      // Group by colaborador + sessao
      const groupedBySessao: Record<string, ProdutividadeItem> = {};
      const groupedByColaborador: Record<string, number> = {};

      submissions?.forEach(sub => {
        const colaborador = usersMap[sub.user_id] || 'Desconhecido';
        const sessao = sub.session_key || 'outros';
        const key = `${colaborador}|${sessao}`;

        if (!groupedBySessao[key]) {
          groupedBySessao[key] = {
            colaborador,
            sessao,
            quantidade: 0
          };
        }
        groupedBySessao[key].quantidade++;

        // Total by colaborador
        groupedByColaborador[colaborador] = (groupedByColaborador[colaborador] || 0) + 1;
      });

      const itens = Object.values(groupedBySessao).sort((a, b) => b.quantidade - a.quantidade);
      
      const resumoPorColaborador = Object.entries(groupedByColaborador)
        .map(([colaborador, total]) => ({ colaborador, total }))
        .sort((a, b) => b.total - a.total);

      return {
        itens,
        resumoPorColaborador,
        totalRegistros: submissions?.length || 0,
        totalColaboradores: Object.keys(groupedByColaborador).length
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
