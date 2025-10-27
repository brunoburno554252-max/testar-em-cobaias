-- Criar tabela para armazenar marcações "Fiz merda"
CREATE TABLE public.fiz_merda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.forms_submissions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(submission_id, user_id)
);

-- Habilitar RLS
ALTER TABLE public.fiz_merda ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas suas próprias marcações
CREATE POLICY "Users can view own fiz_merda"
ON public.fiz_merda
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política: Usuários podem criar suas próprias marcações
CREATE POLICY "Users can create own fiz_merda"
ON public.fiz_merda
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem deletar suas próprias marcações
CREATE POLICY "Users can delete own fiz_merda"
ON public.fiz_merda
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Criar função para verificar se é admin
CREATE OR REPLACE FUNCTION public.is_fiz_merda_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE auth.users.id = auth.uid()
      AND auth.users.email IN (
        'suporte.ti@facla.edu.br',
        'jonathan.jesus@facla.edu.br',
        'Gustavo.Alda@facla.edu.br'
      )
  );
$$;

-- Política: Admins podem ver todas as marcações
CREATE POLICY "Admins can view all fiz_merda"
ON public.fiz_merda
FOR SELECT
TO authenticated
USING (public.is_fiz_merda_admin());