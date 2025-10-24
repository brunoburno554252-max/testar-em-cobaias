-- ====================================================
-- LIMPEZA E CONFIGURAÇÃO CORRETA DE RLS EM forms_registry
-- ====================================================

-- 1. REMOVER TODAS AS POLÍTICAS EXISTENTES (limpeza)
DROP POLICY IF EXISTS "Authenticated users can view all registry entries" ON public.forms_registry;
DROP POLICY IF EXISTS "Users can create registry entries" ON public.forms_registry;
DROP POLICY IF EXISTS "authenticated_select_all_registry" ON public.forms_registry;

-- 2. CRIAR POLÍTICAS PERMISSIVAS E CLARAS

-- Política de SELECT: Todos usuários autenticados podem ver TODOS os registros
CREATE POLICY "allow_authenticated_select_all"
ON public.forms_registry
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (true);

-- Política de INSERT: Usuários podem criar registros para si mesmos
CREATE POLICY "allow_authenticated_insert_own"
ON public.forms_registry
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. VERIFICAR AS POLÍTICAS CRIADAS
SELECT 
  policyname, 
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'forms_registry'
ORDER BY cmd, policyname;