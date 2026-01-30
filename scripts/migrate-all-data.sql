-- =============================================
-- SCRIPT COMPLETO DE MIGRAÇÃO DE DADOS
-- Execute este script no SQL Editor do Supabase
-- https://supabase.com/dashboard/project/jvjsaeprueaukcaixrgq/sql/new
-- =============================================

-- =============================================
-- PARTE 1: ADICIONAR TODAS AS MODALIDADES
-- =============================================

INSERT INTO public.modalidades (nome) VALUES
  ('Aperfeiçoamento De Estudos'),
  ('Extensão Universitária'),
  ('Formação Pedagógica'),
  ('Graduação'),
  ('PÓS-GRADUAÇÃO CHANCELA'),
  ('Pós-Graduação'),
  ('Segunda Licenciatura'),
  ('Superior Sequencial'),
  ('Aproveitamento/Competência'),
  ('EJA'),
  ('Técnico regular'),
  ('Profissionalizante Avançado'),
  ('Profissionalizante Especial'),
  ('Pós Técnico'),
  ('PROFISSIONALIZANTES PREMIUM'),
  ('PÓS - GRADUAÇÕES - VINCIT'),
  ('PÓS - GRADUAÇÕES - UNIMAIS'),
  ('BACHAREL/ LICENCIATURA - UNIMAIS'),
  ('SEGUNDA LICENCIATURA/FORMAÇÃO PEDAGÓGICA - UNIMAIS'),
  ('TECNÓLOGOS - UNIMAIS'),
  ('FORMAÇÃO SPEED - UNIMAIS'),
  ('PROFISSIONALIZANTES COMUM'),
  ('Técnico')
ON CONFLICT DO NOTHING;

-- =============================================
-- INSTRUÇÕES IMPORTANTES
-- =============================================
-- Para importar os polos e cursos completos do arquivo mock,
-- você pode usar uma das seguintes opções:
--
-- OPÇÃO 1 (Recomendada): Importar via CSV
-- 1. Exporte os dados do arquivo formsData.ts para CSV
-- 2. Use a funcionalidade de import do Supabase Table Editor
--
-- OPÇÃO 2: Executar em lotes menores
-- Os dados estão no arquivo src/mock/formsData.ts
-- poloTelefoneMap contém ~1400 polos
-- nivelEnsinoCursoMap contém ~4000 cursos

-- =============================================
-- PARTE 2: CURSOS PRINCIPAIS (Amostra)
-- =============================================

-- Cursos de Graduação
INSERT INTO public.cursos (nome) VALUES
  ('ADMINISTRAÇÃO'),
  ('BACHARELADO EM SERVIÇO SOCIAL'),
  ('BACHARELADO EM TEOLOGIA'),
  ('GESTÃO DA TECNOLOGIA DA INFORMAÇÃO'),
  ('LICENCIATURA EM EDUCAÇÃO ESPECIAL'),
  ('LICENCIATURA EM PEDAGOGIA'),
  ('SEGUNDA GRADUAÇÃO EM PEDAGOGIA'),
  ('SEGURANÇA PÚBLICA'),
  ('TECNÓLOGO EM GESTÃO COMERCIAL'),
  ('TECNÓLOGO EM GESTÃO DE RECURSOS HUMANOS'),
  ('TECNÓLOGO EM GESTÃO DE RECURSOS HUMANOS - 12M'),
  ('TECNÓLOGO EM LOGÍSTICA'),
  ('TECNÓLOGO EM LOGÍSTICA - 12M'),
  ('TECNÓLOGO EM MARKETING'),
  ('TECNÓLOGO EM MARKETING - 12 M'),
  ('TECNÓLOGO EM PROCESSOS GERENCIAIS'),
  ('TECNÓLOGO EM PROCESSOS GERENCIAIS - 12M'),
  ('TECNÓLOGO EM SEGURANÇA PÚBLICA - 12M')
ON CONFLICT DO NOTHING;

-- Cursos de Formação Pedagógica
INSERT INTO public.cursos (nome) VALUES
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
  ('PEDAGOGIA'),
  ('QUÍMICA'),
  ('SOCIOLOGIA')
ON CONFLICT DO NOTHING;

-- Cursos Técnicos Regulares
INSERT INTO public.cursos (nome) VALUES
  ('TÉCNICO EM ADMINISTRAÇÃO'),
  ('TÉCNICO EM AGRICULTURA'),
  ('TÉCNICO EM AGROPECUÁRIA'),
  ('TÉCNICO EM ANÁLISES CLÍNICAS'),
  ('TÉCNICO EM COMPLIANCE'),
  ('TÉCNICO EM CRIPTOMOEDAS'),
  ('TÉCNICO EM CUIDADOR DE IDOSOS'),
  ('TÉCNICO EM ELETROELETRÔNICA'),
  ('TÉCNICO EM ELETROMECÂNICA'),
  ('TÉCNICO EM ELETROTÉCNICA'),
  ('TÉCNICO EM ELETRÔNICA'),
  ('TÉCNICO EM ESTÉTICA'),
  ('TÉCNICO EM FARMÁCIA'),
  ('TÉCNICO EM FINANÇAS'),
  ('TÉCNICO EM GUIA DE TURISMO'),
  ('TÉCNICO EM INFORMÁTICA'),
  ('TÉCNICO EM INTELIGÊNCIA ARTIFICIAL'),
  ('TÉCNICO EM LOGÍSTICA'),
  ('TÉCNICO EM MECÂNICA'),
  ('TÉCNICO EM MEIO AMBIENTE'),
  ('TÉCNICO EM MINERAÇÃO'),
  ('TÉCNICO EM PAPEL E CELULOSE'),
  ('TÉCNICO EM REFRIGERAÇÃO E CLIMATIZAÇÃO'),
  ('TÉCNICO EM SECRETARIA ESCOLAR'),
  ('TÉCNICO EM SEGURANÇA DO TRABALHO'),
  ('TÉCNICO EM TELECOMUNICAÇÕES'),
  ('TÉCNICO EM TEOLOGIA'),
  ('TÉCNICO EM TRANSAÇÕES IMOBILIÁRIAS'),
  ('TÉCNICO EM TRANSAÇÕES TRADER'),
  ('TÉCNICO EM VETERINÁRIA'),
  ('TÉCNICO EM QUÍMICA'),
  ('TÉCNICO EM AGENTE COMUNITÁRIO DE SAÚDE'),
  ('TÉCNICO EM AGRIMENSURA'),
  ('TÉCNICO EM AGROINDÚSTRIA'),
  ('TÉCNICO EM AGRONEGÓCIOS'),
  ('TÉCNICO EM AUTOMAÇÃO INDUSTRIAL'),
  ('TÉCNICO EM COMPUTAÇÃO GRÁFICA'),
  ('TÉCNICO EM CONTABILIDADE'),
  ('TÉCNICO EM DESIGN GRÁFICO'),
  ('TÉCNICO EM DESENVOLVIMENTO DE SISTEMAS'),
  ('TÉCNICO EM EDIFICAÇÕES'),
  ('TÉCNICO EM GASTRONOMIA'),
  ('TÉCNICO EM MANUTENÇÃO AUTOMOTIVA'),
  ('TÉCNICO EM MANUTENÇÃO DE MÁQUINAS INDUSTRIAIS'),
  ('TÉCNICO EM MARKETING'),
  ('TÉCNICO EM METALURGIA'),
  ('TÉCNICO EM NUTRIÇÃO E DIETÉTICA'),
  ('TÉCNICO EM OPTOMETRIA'),
  ('TÉCNICO EM PETRÓLEO E GÁS'),
  ('TÉCNICO EM PODOLOGIA'),
  ('TÉCNICO EM PRÓTESE DENTÁRIA'),
  ('TÉCNICO EM QUALIDADE'),
  ('TÉCNICO EM REDES DE COMPUTADORES'),
  ('TÉCNICO EM SAÚDE BUCAL'),
  ('TÉCNICO EM SERVIÇOS JURÍDICOS'),
  ('TÉCNICO EM SISTEMAS DE ENERGIA RENOVÁVEL'),
  ('TÉCNICO EM VENDAS'),
  ('TÉCNICO EM RECURSOS HUMANOS'),
  ('TÉCNICO EM ENFERMAGEM'),
  ('TÉCNICO EM RADIOLOGIA'),
  ('MECATRÓNICA')
ON CONFLICT DO NOTHING;

-- Cursos de EJA
INSERT INTO public.cursos (nome) VALUES
  ('EJA - EDUCAÇÃO DE JOVENS E ADULTOS'),
  ('EJA - EDUCAÇÃO DE JOVENS E ADULTOS 2.0'),
  ('EJA - EDUCAÇÃO DE JOVENS E ADULTOS - D.O'),
  ('EJA - EDUCAÇÃO DE JOVENS E ADULTOS - V2'),
  ('EJA - EDUCAÇÃO DE JOVENS E ADULTOS 2.0 - D.O'),
  ('EJA - FUNDAMENTAL'),
  ('EJA - EDUCAÇÃO DE JOVENS E ADULTOS - MG'),
  ('EJA - EDUCAÇÃO DE JOVENS E ADULTOS 2.0 - MG')
ON CONFLICT DO NOTHING;

-- =============================================
-- PARTE 3: VINCULAR CURSOS A MODALIDADES
-- =============================================

-- Vincular cursos de Graduação
INSERT INTO public.curso_modalidades (curso_id, modalidade_id)
SELECT c.id, m.id
FROM public.cursos c, public.modalidades m
WHERE m.nome = 'Graduação'
AND c.nome IN (
  'ADMINISTRAÇÃO', 'BACHARELADO EM SERVIÇO SOCIAL', 'BACHARELADO EM TEOLOGIA',
  'GESTÃO DA TECNOLOGIA DA INFORMAÇÃO', 'LICENCIATURA EM EDUCAÇÃO ESPECIAL',
  'LICENCIATURA EM PEDAGOGIA', 'SEGUNDA GRADUAÇÃO EM PEDAGOGIA', 'SEGURANÇA PÚBLICA',
  'TECNÓLOGO EM GESTÃO COMERCIAL', 'TECNÓLOGO EM GESTÃO DE RECURSOS HUMANOS',
  'TECNÓLOGO EM LOGÍSTICA', 'TECNÓLOGO EM MARKETING', 'TECNÓLOGO EM PROCESSOS GERENCIAIS'
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
WHERE m.nome = 'Técnico regular'
AND c.nome LIKE 'TÉCNICO%'
ON CONFLICT DO NOTHING;

-- Vincular cursos EJA
INSERT INTO public.curso_modalidades (curso_id, modalidade_id)
SELECT c.id, m.id
FROM public.cursos c, public.modalidades m
WHERE m.nome = 'EJA'
AND c.nome LIKE 'EJA%'
ON CONFLICT DO NOTHING;

-- =============================================
-- VERIFICAR RESULTADOS
-- =============================================
SELECT 'polos' as tabela, COUNT(*) as total FROM public.polos
UNION ALL
SELECT 'modalidades', COUNT(*) FROM public.modalidades
UNION ALL
SELECT 'cursos', COUNT(*) FROM public.cursos
UNION ALL
SELECT 'vinculos', COUNT(*) FROM public.curso_modalidades;
