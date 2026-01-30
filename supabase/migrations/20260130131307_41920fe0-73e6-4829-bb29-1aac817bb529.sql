-- =============================================
-- ADICIONAR MAIS MODALIDADES (todas que existem no mock)
-- =============================================

INSERT INTO public.modalidades (nome) VALUES
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
  ('PROFISSIONALIZANTES COMUM')
ON CONFLICT DO NOTHING;

-- =============================================
-- CURSOS EJA
-- =============================================

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

-- Vincular EJA
INSERT INTO public.curso_modalidades (curso_id, modalidade_id)
SELECT c.id, m.id
FROM public.cursos c, public.modalidades m
WHERE m.nome = 'EJA'
AND c.nome LIKE 'EJA%'
ON CONFLICT DO NOTHING;

-- =============================================
-- CURSOS TÉCNICOS REGULARES
-- =============================================

INSERT INTO public.cursos (nome) VALUES
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
  ('TÉCNICO EM INTELIGÊNCIA ARTIFICIAL'),
  ('TÉCNICO EM MINERAÇÃO'),
  ('TÉCNICO EM PAPEL E CELULOSE'),
  ('TÉCNICO EM REFRIGERAÇÃO E CLIMATIZAÇÃO'),
  ('TÉCNICO EM SECRETARIA ESCOLAR'),
  ('TÉCNICO EM TELECOMUNICAÇÕES'),
  ('TÉCNICO EM TEOLOGIA'),
  ('TÉCNICO EM TRANSAÇÕES IMOBILIÁRIAS'),
  ('TÉCNICO EM TRANSAÇÕES TRADER'),
  ('TÉCNICO EM VETERINÁRIA'),
  ('TÉCNICO EM AGENTE COMUNITÁRIO DE SAÚDE'),
  ('TÉCNICO EM AGROINDÚSTRIA'),
  ('TÉCNICO EM AGRONEGÓCIOS'),
  ('TÉCNICO EM COMPUTAÇÃO GRÁFICA'),
  ('TÉCNICO EM DESIGN GRÁFICO'),
  ('TÉCNICO EM EDIFICAÇÕES'),
  ('TÉCNICO EM GASTRONOMIA'),
  ('TÉCNICO EM MANUTENÇÃO AUTOMOTIVA'),
  ('TÉCNICO EM MANUTENÇÃO DE MÁQUINAS INDUSTRIAIS'),
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
  ('TÉCNICO EM RADIOLOGIA'),
  ('TÉCNICO EM ANÁLISES CLÍNICAS'),
  ('MECATRÓNICA'),
  ('TÉCNICO EM MECATRÔNICA'),
  ('TÉCNICO EM ÓPTICA'),
  ('TÉCNICO EM SOLDAGEM'),
  ('TÉCNICO EM PREVENÇÃO E COMBATE AO INCÊNDIO')
ON CONFLICT DO NOTHING;

-- Vincular Técnicos Regulares
INSERT INTO public.curso_modalidades (curso_id, modalidade_id)
SELECT c.id, m.id
FROM public.cursos c, public.modalidades m
WHERE m.nome = 'Técnico regular'
AND (c.nome LIKE 'TÉCNICO%' OR c.nome = 'MECATRÓNICA')
ON CONFLICT DO NOTHING;