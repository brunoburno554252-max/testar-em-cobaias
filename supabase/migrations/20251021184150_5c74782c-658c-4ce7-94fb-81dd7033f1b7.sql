-- =====================================================
-- Sistema de Autenticação para App de Formulários
-- =====================================================

-- Criar tabela de perfis de usuários do app de formulários
CREATE TABLE IF NOT EXISTS public.forms_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS na tabela forms_users
ALTER TABLE public.forms_users ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para forms_users
CREATE POLICY "Users can view own profile"
  ON public.forms_users
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.forms_users
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Criar tabela para submissões de formulários
CREATE TABLE IF NOT EXISTS public.forms_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_name TEXT NOT NULL,
  session_key TEXT NOT NULL,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  line_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela forms_submissions
ALTER TABLE public.forms_submissions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para forms_submissions
CREATE POLICY "Users can view own submissions"
  ON public.forms_submissions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own submissions"
  ON public.forms_submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all submissions"
  ON public.forms_submissions
  FOR SELECT
  USING (true);

-- Criar tabela para registro de ações de formulários
CREATE TABLE IF NOT EXISTS public.forms_registry (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.forms_submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  session_key TEXT NOT NULL,
  form_name TEXT NOT NULL,
  line_number INTEGER NOT NULL,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela forms_registry
ALTER TABLE public.forms_registry ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para forms_registry
CREATE POLICY "Anyone can view registry"
  ON public.forms_registry
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create registry entries"
  ON public.forms_registry
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Função para criar perfil automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_forms_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.forms_users (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created_forms ON auth.users;
CREATE TRIGGER on_auth_user_created_forms
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_forms_user();

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_forms_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers para atualizar timestamp
DROP TRIGGER IF EXISTS update_forms_users_updated_at ON public.forms_users;
CREATE TRIGGER update_forms_users_updated_at
  BEFORE UPDATE ON public.forms_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_forms_updated_at();

DROP TRIGGER IF EXISTS update_forms_submissions_updated_at ON public.forms_submissions;
CREATE TRIGGER update_forms_submissions_updated_at
  BEFORE UPDATE ON public.forms_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_forms_updated_at();