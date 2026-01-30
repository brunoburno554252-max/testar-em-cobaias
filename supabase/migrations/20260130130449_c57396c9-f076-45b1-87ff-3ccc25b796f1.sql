-- =============================================
-- MIGRAÇÃO DE DADOS: Mock para Supabase
-- =============================================

-- 1. INSERIR MODALIDADES (Níveis de Ensino)
INSERT INTO public.modalidades (nome) VALUES
  ('Aperfeiçoamento De Estudos'),
  ('Extensão Universitária'),
  ('Formação Pedagógica'),
  ('Graduação'),
  ('PÓS-GRADUAÇÃO CHANCELA'),
  ('Pós-Graduação'),
  ('Técnico')
ON CONFLICT DO NOTHING;

-- 2. INSERIR POLOS (principais, com telefone)
INSERT INTO public.polos (nome, telefone) VALUES
  ('POLO TESTE', '(44) 99905-6702'),
  ('Programa Universidade Fácil', '(44) 99846-8426'),
  ('Polo Suzano sp', '(11) 99109-4750'),
  ('FAROL EDUCAÇAO', '(14) 99686-5577'),
  ('CASTILHO SILVA & CIA LTDA', '(32) 3722-5332'),
  ('Polo EDUKS EAD LTDA', '(17) 98104-3712'),
  ('CETED EDUCACIONAL', '(88) 99247-6643'),
  ('LATec - Aracruz', '(27) 99247-3213'),
  ('Sudeste Goiano', '(64) 99290-2890'),
  ('o ECET Evoluir', '(43) 9628-8045'),
  ('Melius Educacional', '(31) 99295-3923'),
  ('INSTITUTO TECNICO PAULISTA', '(55) 11911-6028'),
  ('CLUBE DO TÉCNICO', '(55) 19997-4287'),
  ('REDE DICLER - DICLER CARLOS DE ASSIS CARMO', '(11) 95330-9860'),
  ('UniSaber Educação', '(51) 98476-9527'),
  ('CENTRO INOVAR', '(93) 99170-7336'),
  ('Focus Educacional - RJ', '(21) 97679-9616'),
  ('Central de Cursos Boca do Acre', '(97) 98803-7970'),
  ('Absoluto Educacional', '(11) 94709-6278'),
  ('Politech', '(45) 99915-0285'),
  ('Grupo Martins', '(91) 98074-6200'),
  ('IGEA educacional', '(62) 98146-7286'),
  ('Aprender na tela', '(21) 96409-5948'),
  ('Mix cursos', '(35) 99767-1464'),
  ('PPP Company', '(65) 98467-1009'),
  ('Instituto Zulemay Ramos Ltda', '(91) 2121-0444'),
  ('CENTRO INOVAR 2', '(93) 99170-1025'),
  ('Centro Nacional de Educação', '(27) 99519-9250'),
  ('Prisma Educacional', '(87) 98815-2317'),
  ('Centro de Treinamento Webcursos', '(12) 99126-9013'),
  ('FOR YOU', NULL)
ON CONFLICT DO NOTHING;

-- 3. INSERIR CURSOS (principais)
INSERT INTO public.cursos (nome) VALUES
  ('ADMINISTRAÇÃO'),
  ('AGRONEGÓCIO'),
  ('ANÁLISE E DESENVOLVIMENTO DE SISTEMAS'),
  ('CIÊNCIAS CONTÁBEIS'),
  ('GESTÃO COMERCIAL'),
  ('GESTÃO DE RECURSOS HUMANOS'),
  ('GESTÃO FINANCEIRA'),
  ('GESTÃO PÚBLICA'),
  ('LOGÍSTICA'),
  ('MARKETING'),
  ('PEDAGOGIA'),
  ('PROCESSOS GERENCIAIS'),
  ('SEGURANÇA NO TRABALHO'),
  ('SERVIÇO SOCIAL'),
  ('TECNOLOGIA DA INFORMAÇÃO'),
  -- Cursos de Formação Pedagógica
  ('ARTES VISUAIS'),
  ('CIÊNCIAS BIOLÓGICAS'),
  ('CIÊNCIAS DA RELIGIÃO'),
  ('CIÊNCIAS SOCIAIS'),
  ('EDUCAÇÃO ESPECIAL'),
  ('EDUCAÇÃO FÍSICA'),
  ('FILOSOFIA'),
  ('LETRAS PORTUGUÊS / INGLÊS'),
  ('FÍSICA'),
  ('GEOGRAFIA'),
  ('HISTÓRIA'),
  ('INGLÊS'),
  ('LETRAS LÍNGUA PORTUGUESA/LIBRAS'),
  ('LETRAS PORTUGUÊS/ESPANHOL'),
  ('LIBRAS'),
  ('MATEMÁTICA'),
  ('MÚSICA'),
  ('QUÍMICA'),
  ('SOCIOLOGIA'),
  -- Cursos Técnicos
  ('TÉCNICO EM ENFERMAGEM'),
  ('TÉCNICO EM SEGURANÇA DO TRABALHO'),
  ('TÉCNICO EM INFORMÁTICA'),
  ('TÉCNICO EM ADMINISTRAÇÃO'),
  ('TÉCNICO EM CONTABILIDADE'),
  ('TÉCNICO EM LOGÍSTICA'),
  ('TÉCNICO EM RECURSOS HUMANOS'),
  ('TÉCNICO EM VENDAS'),
  ('TÉCNICO EM MARKETING'),
  ('TÉCNICO EM SECRETARIADO')
ON CONFLICT DO NOTHING;

-- 4. VINCULAR CURSOS A MODALIDADES
-- Vincular cursos de Graduação
INSERT INTO public.curso_modalidades (curso_id, modalidade_id)
SELECT c.id, m.id
FROM public.cursos c, public.modalidades m
WHERE m.nome = 'Graduação'
AND c.nome IN (
  'ADMINISTRAÇÃO', 'PEDAGOGIA', 'SERVIÇO SOCIAL', 'GESTÃO COMERCIAL',
  'GESTÃO DE RECURSOS HUMANOS', 'LOGÍSTICA', 'MARKETING', 'PROCESSOS GERENCIAIS'
)
ON CONFLICT DO NOTHING;

-- Vincular cursos de Formação Pedagógica
INSERT INTO public.curso_modalidades (curso_id, modalidade_id)
SELECT c.id, m.id
FROM public.cursos c, public.modalidades m
WHERE m.nome = 'Formação Pedagógica'
AND c.nome IN (
  'ARTES VISUAIS', 'CIÊNCIAS BIOLÓGICAS', 'CIÊNCIAS DA RELIGIÃO', 'CIÊNCIAS SOCIAIS',
  'EDUCAÇÃO ESPECIAL', 'EDUCAÇÃO FÍSICA', 'FILOSOFIA', 'LETRAS PORTUGUÊS / INGLÊS',
  'FÍSICA', 'GEOGRAFIA', 'HISTÓRIA', 'INGLÊS', 'LETRAS LÍNGUA PORTUGUESA/LIBRAS',
  'LETRAS PORTUGUÊS/ESPANHOL', 'LIBRAS', 'MATEMÁTICA', 'MÚSICA', 'PEDAGOGIA', 'QUÍMICA', 'SOCIOLOGIA'
)
ON CONFLICT DO NOTHING;

-- Vincular cursos Técnicos
INSERT INTO public.curso_modalidades (curso_id, modalidade_id)
SELECT c.id, m.id
FROM public.cursos c, public.modalidades m
WHERE m.nome = 'Técnico'
AND c.nome LIKE 'TÉCNICO%'
ON CONFLICT DO NOTHING;