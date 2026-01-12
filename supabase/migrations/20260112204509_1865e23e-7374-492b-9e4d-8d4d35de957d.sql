-- Remove user policies for UPDATE and DELETE (only admins should have access)
DROP POLICY IF EXISTS "Users can update own submissions" ON public.forms_submissions;
DROP POLICY IF EXISTS "Users can delete own submissions" ON public.forms_submissions;