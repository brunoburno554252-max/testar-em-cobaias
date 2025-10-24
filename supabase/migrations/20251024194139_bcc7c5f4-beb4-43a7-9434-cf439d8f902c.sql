-- Remover políticas existentes e criar novas
DROP POLICY IF EXISTS "Users can view own profile" ON public.forms_users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.forms_users;

-- Permitir que usuários autenticados vejam todos os perfis
CREATE POLICY "Users can view all profiles"
ON public.forms_users
FOR SELECT
TO authenticated
USING (true);

-- Permitir que usuários atualizem apenas seu próprio perfil
CREATE POLICY "Users can update own profile only"
ON public.forms_users
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);