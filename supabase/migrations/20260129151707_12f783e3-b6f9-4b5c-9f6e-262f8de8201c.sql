-- Drop existing restrictive policies for polos
DROP POLICY IF EXISTS "Admin master can insert polos" ON public.polos;
DROP POLICY IF EXISTS "Admin master can update polos" ON public.polos;
DROP POLICY IF EXISTS "Admin master can delete polos" ON public.polos;
DROP POLICY IF EXISTS "Authenticated users can read polos" ON public.polos;

-- Drop existing restrictive policies for modalidades
DROP POLICY IF EXISTS "Admin master can insert modalidades" ON public.modalidades;
DROP POLICY IF EXISTS "Admin master can update modalidades" ON public.modalidades;
DROP POLICY IF EXISTS "Admin master can delete modalidades" ON public.modalidades;
DROP POLICY IF EXISTS "Authenticated users can read modalidades" ON public.modalidades;

-- Drop existing restrictive policies for cursos
DROP POLICY IF EXISTS "Admin master can insert cursos" ON public.cursos;
DROP POLICY IF EXISTS "Admin master can update cursos" ON public.cursos;
DROP POLICY IF EXISTS "Admin master can delete cursos" ON public.cursos;
DROP POLICY IF EXISTS "Authenticated users can read cursos" ON public.cursos;

-- Drop existing restrictive policies for curso_modalidades
DROP POLICY IF EXISTS "Admin master can insert curso_modalidades" ON public.curso_modalidades;
DROP POLICY IF EXISTS "Admin master can update curso_modalidades" ON public.curso_modalidades;
DROP POLICY IF EXISTS "Admin master can delete curso_modalidades" ON public.curso_modalidades;
DROP POLICY IF EXISTS "Authenticated users can read curso_modalidades" ON public.curso_modalidades;

-- Recreate as PERMISSIVE policies for polos
CREATE POLICY "Authenticated users can read polos" 
ON public.polos FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Admin master can insert polos" 
ON public.polos FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can update polos" 
ON public.polos FOR UPDATE 
TO authenticated
USING (public.is_admin_master_user())
WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can delete polos" 
ON public.polos FOR DELETE 
TO authenticated
USING (public.is_admin_master_user());

-- Recreate as PERMISSIVE policies for modalidades
CREATE POLICY "Authenticated users can read modalidades" 
ON public.modalidades FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Admin master can insert modalidades" 
ON public.modalidades FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can update modalidades" 
ON public.modalidades FOR UPDATE 
TO authenticated
USING (public.is_admin_master_user())
WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can delete modalidades" 
ON public.modalidades FOR DELETE 
TO authenticated
USING (public.is_admin_master_user());

-- Recreate as PERMISSIVE policies for cursos
CREATE POLICY "Authenticated users can read cursos" 
ON public.cursos FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Admin master can insert cursos" 
ON public.cursos FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can update cursos" 
ON public.cursos FOR UPDATE 
TO authenticated
USING (public.is_admin_master_user())
WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can delete cursos" 
ON public.cursos FOR DELETE 
TO authenticated
USING (public.is_admin_master_user());

-- Recreate as PERMISSIVE policies for curso_modalidades
CREATE POLICY "Authenticated users can read curso_modalidades" 
ON public.curso_modalidades FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Admin master can insert curso_modalidades" 
ON public.curso_modalidades FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can update curso_modalidades" 
ON public.curso_modalidades FOR UPDATE 
TO authenticated
USING (public.is_admin_master_user())
WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can delete curso_modalidades" 
ON public.curso_modalidades FOR DELETE 
TO authenticated
USING (public.is_admin_master_user());