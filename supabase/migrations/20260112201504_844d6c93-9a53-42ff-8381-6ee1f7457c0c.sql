-- Add RLS policies for UPDATE and DELETE on forms_submissions

-- Allow users to update their own submissions
CREATE POLICY "Users can update own submissions" 
ON public.forms_submissions 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own submissions
CREATE POLICY "Users can delete own submissions" 
ON public.forms_submissions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Allow admin master to update any submission
CREATE POLICY "Admin master can update any submission" 
ON public.forms_submissions 
FOR UPDATE 
USING (is_admin_master_user())
WITH CHECK (is_admin_master_user());

-- Allow admin master to delete any submission
CREATE POLICY "Admin master can delete any submission" 
ON public.forms_submissions 
FOR DELETE 
USING (is_admin_master_user());