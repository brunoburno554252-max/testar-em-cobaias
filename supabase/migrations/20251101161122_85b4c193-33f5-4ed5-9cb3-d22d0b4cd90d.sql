-- Update session_key from secretaria to certificacao in forms_registry
UPDATE forms_registry 
SET session_key = 'certificacao' 
WHERE form_name = 'CERTIFICAÇÃO' AND session_key = 'secretaria';

-- Update session_key in forms_submissions to match (certificacao instead of CERTIFICAÇÃO)
UPDATE forms_submissions 
SET session_key = 'certificacao' 
WHERE form_name = 'CERTIFICAÇÃO' AND session_key = 'CERTIFICAÇÃO';