-- ====================================================
-- SQL PARA CORRIGIR VISUALIZAÇÃO DE REGISTROS
-- Execute este arquivo completo no SQL Editor do Supabase
-- ====================================================

-- 1. VER POLÍTICAS ATUAIS (copie o resultado e me envie)
SELECT 
  schemaname,
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'forms_registry'
ORDER BY policyname;

-- 2. REMOVER TODAS AS POLÍTICAS DE SELECT EXISTENTES
DROP POLICY IF EXISTS "Anyone can view registry" ON public.forms_registry;
DROP POLICY IF EXISTS "Users can view own registry entries" ON public.forms_registry;
DROP POLICY IF EXISTS "Users can view registry" ON public.forms_registry;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.forms_registry;
DROP POLICY IF EXISTS "All authenticated users can view all registry entries" ON public.forms_registry;
DROP POLICY IF EXISTS "All authenticated users can view all registry" ON public.forms_registry;
DROP POLICY IF EXISTS "authenticated_select_all_registry" ON public.forms_registry;
DROP POLICY IF EXISTS "Public can read registros" ON public.forms_registry;

-- 3. CRIAR NOVA POLÍTICA PERMISSIVA PARA SELECT
CREATE POLICY "forms_registry_select_all"
ON public.forms_registry
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

-- 4. VERIFICAR SE FOI CRIADA CORRETAMENTE
SELECT 
  policyname, 
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'forms_registry' AND cmd = 'SELECT';

-- 5. TESTAR A QUERY QUE O CÓDIGO USA
SELECT count(*) as total_registros FROM public.forms_registry;
SELECT count(*) as meus_registros FROM public.forms_registry WHERE user_id = auth.uid();

-- Se total_registros > meus_registros, a política está funcionando corretamente!
