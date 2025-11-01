-- Update session_key from SECRETARIA ACADÊMICA to CERTIFICAÇÃO
UPDATE forms_submissions 
SET session_key = 'CERTIFICAÇÃO' 
WHERE form_name = 'CERTIFICAÇÃO' AND session_key = 'SECRETARIA ACADÊMICA';