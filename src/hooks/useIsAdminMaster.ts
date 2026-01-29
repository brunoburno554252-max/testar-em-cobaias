import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useIsAdminMaster = () => {
  return useQuery({
    queryKey: ['is-admin-master'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('is_admin_master_user');
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      return data === true;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
