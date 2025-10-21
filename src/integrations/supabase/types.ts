export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_user_id: string
          created_at: string
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action_type: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      admin_master: {
        Row: {
          created_at: string | null
          email: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          user_id?: string
        }
        Relationships: []
      }
      alunos_tempo_conclusao: {
        Row: {
          atividade: string | null
          colaborador: string | null
          created_at: string | null
          curso: string
          data_conclusao: string | null
          data_matricula: string
          gestor: string | null
          id: string
          nivel_ensino: string | null
          nome: string
          observacoes: string | null
          plataforma: string | null
          polo: string | null
          previsao_conclusao: string
          status: string
          updated_at: string | null
        }
        Insert: {
          atividade?: string | null
          colaborador?: string | null
          created_at?: string | null
          curso: string
          data_conclusao?: string | null
          data_matricula: string
          gestor?: string | null
          id?: string
          nivel_ensino?: string | null
          nome: string
          observacoes?: string | null
          plataforma?: string | null
          polo?: string | null
          previsao_conclusao: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          atividade?: string | null
          colaborador?: string | null
          created_at?: string | null
          curso?: string
          data_conclusao?: string | null
          data_matricula?: string
          gestor?: string | null
          id?: string
          nivel_ensino?: string | null
          nome?: string
          observacoes?: string | null
          plataforma?: string | null
          polo?: string | null
          previsao_conclusao?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action_type: string
          created_at: string
          id: string
          ip_address: string | null
          record_id: string | null
          sensitive_fields: Json | null
          table_name: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          ip_address?: string | null
          record_id?: string | null
          sensitive_fields?: Json | null
          table_name: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          record_id?: string | null
          sensitive_fields?: Json | null
          table_name?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dashboard_data_persistent: {
        Row: {
          created_at: string
          id: string
          last_data: Json
          last_update: string
          metadata: Json | null
          section_key: string
          section_name: string
          total_records: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_data?: Json
          last_update?: string
          metadata?: Json | null
          section_key: string
          section_name: string
          total_records?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_data?: Json
          last_update?: string
          metadata?: Json | null
          section_key?: string
          section_name?: string
          total_records?: number
        }
        Relationships: []
      }
      forms_registry: {
        Row: {
          created_at: string
          form_data: Json
          form_name: string
          id: string
          line_number: number
          session_key: string
          submission_id: string
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string
          form_data?: Json
          form_name: string
          id?: string
          line_number: number
          session_key: string
          submission_id: string
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string
          form_data?: Json
          form_name?: string
          id?: string
          line_number?: number
          session_key?: string
          submission_id?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "forms_registry_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "forms_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      forms_submissions: {
        Row: {
          created_at: string
          form_data: Json
          form_name: string
          id: string
          line_number: number
          session_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          form_data?: Json
          form_name: string
          id?: string
          line_number: number
          session_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          form_data?: Json
          form_name?: string
          id?: string
          line_number?: number
          session_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      forms_users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      master_admin_config: {
        Row: {
          config_key: string
          config_value: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          config_key: string
          config_value: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_value?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      password_policies: {
        Row: {
          created_at: string
          failed_attempts: number | null
          id: string
          locked_until: string | null
          password_changed_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          failed_attempts?: number | null
          id?: string
          locked_until?: string | null
          password_changed_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          failed_attempts?: number | null
          id?: string
          locked_until?: string | null
          password_changed_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      planilhas: {
        Row: {
          atualizado_em: string | null
          config_metadata: Json | null
          dados: Json
          id: string
          sessao: string
          status: string | null
          total_rows: number | null
        }
        Insert: {
          atualizado_em?: string | null
          config_metadata?: Json | null
          dados: Json
          id?: string
          sessao: string
          status?: string | null
          total_rows?: number | null
        }
        Update: {
          atualizado_em?: string | null
          config_metadata?: Json | null
          dados?: Json
          id?: string
          sessao?: string
          status?: string | null
          total_rows?: number | null
        }
        Relationships: []
      }
      planilhas_config: {
        Row: {
          config_type: string
          created_at: string
          id: string
          is_active: boolean | null
          planilha_url: string | null
          updated_at: string
        }
        Insert: {
          config_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          planilha_url?: string | null
          updated_at?: string
        }
        Update: {
          config_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          planilha_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      planilhas_dados: {
        Row: {
          created_at: string
          id: string
          linha_dados: Json | null
          linha_numero: number
          sessao: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          linha_dados?: Json | null
          linha_numero: number
          sessao: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          linha_dados?: Json | null
          linha_numero?: number
          sessao?: string
          updated_at?: string
        }
        Relationships: []
      }
      planilhas_links: {
        Row: {
          atualizado_em: string | null
          id: string
          link: string
          sessao: string
        }
        Insert: {
          atualizado_em?: string | null
          id?: string
          link: string
          sessao: string
        }
        Update: {
          atualizado_em?: string | null
          id?: string
          link?: string
          sessao?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          attempts: number | null
          blocked_until: string | null
          created_at: string | null
          id: string
          identifier: string
          updated_at: string | null
          window_start: string | null
        }
        Insert: {
          action: string
          attempts?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier: string
          updated_at?: string | null
          window_start?: string | null
        }
        Update: {
          action?: string
          attempts?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier?: string
          updated_at?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      registro_acoes: {
        Row: {
          created_at: string
          dados_resumo: Json | null
          id: string
          linha_numero: number
          registro_id: string
          sessao: string
          usuario: string
        }
        Insert: {
          created_at?: string
          dados_resumo?: Json | null
          id?: string
          linha_numero: number
          registro_id: string
          sessao: string
          usuario: string
        }
        Update: {
          created_at?: string
          dados_resumo?: Json | null
          id?: string
          linha_numero?: number
          registro_id?: string
          sessao?: string
          usuario?: string
        }
        Relationships: []
      }
      sheet_configs: {
        Row: {
          auto_sync_enabled: boolean | null
          created_at: string
          id: string
          last_sync: string | null
          rows_synced: number | null
          section: string
          section_id: string | null
          sheet_url: string
          status: string | null
          sync_interval_minutes: number | null
          updated_at: string
          validation_enabled: boolean | null
        }
        Insert: {
          auto_sync_enabled?: boolean | null
          created_at?: string
          id?: string
          last_sync?: string | null
          rows_synced?: number | null
          section: string
          section_id?: string | null
          sheet_url: string
          status?: string | null
          sync_interval_minutes?: number | null
          updated_at?: string
          validation_enabled?: boolean | null
        }
        Update: {
          auto_sync_enabled?: boolean | null
          created_at?: string
          id?: string
          last_sync?: string | null
          rows_synced?: number | null
          section?: string
          section_id?: string | null
          sheet_url?: string
          status?: string | null
          sync_interval_minutes?: number | null
          updated_at?: string
          validation_enabled?: boolean | null
        }
        Relationships: []
      }
      sheet_data: {
        Row: {
          config_id: string | null
          created_at: string
          id: string
          row_data: Json | null
          row_number: number | null
          updated_at: string
        }
        Insert: {
          config_id?: string | null
          created_at?: string
          id?: string
          row_data?: Json | null
          row_number?: number | null
          updated_at?: string
        }
        Update: {
          config_id?: string | null
          created_at?: string
          id?: string
          row_data?: Json | null
          row_number?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sheet_data_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "sheet_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      sheet_mappings: {
        Row: {
          config_id: string | null
          created_at: string
          id: string
          mapping_type: string | null
          source_column: string | null
          target_field: string | null
        }
        Insert: {
          config_id?: string | null
          created_at?: string
          id?: string
          mapping_type?: string | null
          source_column?: string | null
          target_field?: string | null
        }
        Update: {
          config_id?: string | null
          created_at?: string
          id?: string
          mapping_type?: string | null
          source_column?: string | null
          target_field?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sheet_mappings_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "sheet_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      sheets_cache: {
        Row: {
          cache_key: string
          created_at: string
          data: Json | null
          expires_at: string | null
          id: string
          updated_at: string
        }
        Insert: {
          cache_key: string
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          cache_key?: string
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sync_configs: {
        Row: {
          auto_sync_enabled: boolean | null
          created_at: string | null
          gid: number | null
          id: string
          last_sync: string | null
          section_name: string
          sheet_url: string
          status: string | null
          sync_interval_minutes: number | null
          total_rows: number | null
          updated_at: string | null
        }
        Insert: {
          auto_sync_enabled?: boolean | null
          created_at?: string | null
          gid?: number | null
          id?: string
          last_sync?: string | null
          section_name: string
          sheet_url: string
          status?: string | null
          sync_interval_minutes?: number | null
          total_rows?: number | null
          updated_at?: string | null
        }
        Update: {
          auto_sync_enabled?: boolean | null
          created_at?: string | null
          gid?: number | null
          id?: string
          last_sync?: string | null
          section_name?: string
          sheet_url?: string
          status?: string | null
          sync_interval_minutes?: number | null
          total_rows?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sync_global_config: {
        Row: {
          auto_sync_enabled: boolean | null
          created_at: string | null
          id: string
          last_auto_sync: string | null
          sync_frequency: string | null
          updated_at: string | null
        }
        Insert: {
          auto_sync_enabled?: boolean | null
          created_at?: string | null
          id?: string
          last_auto_sync?: string | null
          sync_frequency?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_sync_enabled?: boolean | null
          created_at?: string | null
          id?: string
          last_auto_sync?: string | null
          sync_frequency?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          action: string
          completed_at: string | null
          config_id: string | null
          created_at: string
          error_details: Json | null
          execution_time_ms: number | null
          id: string
          records_failed: number | null
          records_processed: number | null
          sessao: string
          sheet_id: string | null
          status: string
          sync_type: string | null
          tabs_processed: number | null
          user_id: string | null
        }
        Insert: {
          action: string
          completed_at?: string | null
          config_id?: string | null
          created_at?: string
          error_details?: Json | null
          execution_time_ms?: number | null
          id?: string
          records_failed?: number | null
          records_processed?: number | null
          sessao: string
          sheet_id?: string | null
          status: string
          sync_type?: string | null
          tabs_processed?: number | null
          user_id?: string | null
        }
        Update: {
          action?: string
          completed_at?: string | null
          config_id?: string | null
          created_at?: string
          error_details?: Json | null
          execution_time_ms?: number | null
          id?: string
          records_failed?: number | null
          records_processed?: number | null
          sessao?: string
          sheet_id?: string | null
          status?: string
          sync_type?: string | null
          tabs_processed?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      audit_student_data_access: {
        Args: {
          p_action: string
          p_course?: string
          p_student_name?: string
          p_user_id: string
        }
        Returns: undefined
      }
      cleanup_old_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      enforce_password_security: {
        Args: { p_action: string; p_user_id: string }
        Returns: boolean
      }
      exec_sql: {
        Args: { sql_query: string }
        Returns: string
      }
      get_dashboard_section_data: {
        Args: { p_section_key: string }
        Returns: {
          data: Json
          last_update: string
          section_key: string
          section_name: string
          total_records: number
        }[]
      }
      get_master_admin_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_public_dashboard_data: {
        Args: { p_section_key?: string }
        Returns: {
          data: Json
          last_update: string
          section_key: string
          section_name: string
          total_records: number
        }[]
      }
      get_public_dashboard_section_data: {
        Args: { p_section_key: string }
        Returns: {
          data: Json
          last_update: string
          section_key: string
          section_name: string
          total_records: number
        }[]
      }
      get_public_planilha_data: {
        Args: { p_sessao: string }
        Returns: {
          atualizado_em: string
          dados: Json
        }[]
      }
      get_tempo_conclusao_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          colaborador: string
          created_at: string
          curso: string
          data_matricula: string
          dias_atraso: number
          id: string
          nome: string
          polo: string
          previsao_conclusao: string
          status: string
          status_calculado: string
          updated_at: string
        }[]
      }
      get_tempo_conclusao_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          atrasados: number
          concluidos: number
          em_andamento: number
          percentual_atrasados: number
          percentual_dentro_prazo: number
          total_alunos: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      initialize_first_admin: {
        Args: { email_address: string }
        Returns: boolean
      }
      initialize_super_admin: {
        Args: { admin_user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_master: {
        Args: Record<PropertyKey, never> | { check_user: string }
        Returns: boolean
      }
      is_admin_master_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      promote_user_to_admin: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      sync_sheet_data_to_supabase: {
        Args: { p_data: Json; p_session: string }
        Returns: boolean
      }
      update_dashboard_section_data: {
        Args: {
          p_data: Json
          p_section_key: string
          p_section_name: string
          p_total_records?: number
        }
        Returns: boolean
      }
      validate_row_data: {
        Args: { data: Json; section_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user" | "super_admin" | "admin_master"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "super_admin", "admin_master"],
    },
  },
} as const
