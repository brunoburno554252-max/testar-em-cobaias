-- Update all session_key from 'secretaria' to 'certificacao' in forms_registry
UPDATE forms_registry 
SET session_key = 'certificacao' 
WHERE session_key = 'secretaria';

-- Update all session_key from 'secretaria' to 'certificacao' in forms_submissions
UPDATE forms_submissions 
SET session_key = 'certificacao' 
WHERE session_key = 'secretaria';

-- Also update any UPPERCASE variants to ensure consistency
UPDATE forms_registry 
SET session_key = 'certificacao' 
WHERE session_key = 'SECRETARIA';

UPDATE forms_submissions 
SET session_key = 'certificacao' 
WHERE session_key = 'SECRETARIA';