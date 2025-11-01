-- Atualizar registros de "SECRETARIA ACADÊMICA" para "CERTIFICAÇÃO"
-- Total de registros a serem atualizados: 146

UPDATE public.forms_submissions
SET form_name = 'CERTIFICAÇÃO'
WHERE form_name = 'SECRETARIA ACADÊMICA';