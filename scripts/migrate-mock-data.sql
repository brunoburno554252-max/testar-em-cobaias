-- =============================================================================
-- SCRIPT DE MIGRAÇÃO: Mock Data para Banco de Dados
-- =============================================================================
-- Este script importa os dados do arquivo src/mock/formsData.ts para as tabelas:
-- - modalidades
-- - cursos
-- - curso_modalidades (vínculos)
-- - polos
--
-- INSTRUÇÕES:
-- 1. Execute este script no Supabase SQL Editor
-- 2. Os dados serão inseridos nas tabelas (ignorando duplicatas)
-- 3. Após a execução, o DynamicForm usará os dados do banco automaticamente
-- =============================================================================

-- Limpar dados existentes (opcional - descomente se necessário)
-- DELETE FROM curso_modalidades;
-- DELETE FROM cursos;
-- DELETE FROM modalidades;
-- DELETE FROM polos;

-- =============================================================================
-- INSERIR MODALIDADES (Níveis de Ensino)
-- =============================================================================
INSERT INTO modalidades (nome) VALUES
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
('DOUTORADOS/MESTRADOS/PÓS DOUTORADO - IVY ENBER'),
('TREINAMENTO PARA PARCEIROS LA'),
('GRADUAÇÃO CHANCELA'),
('TÉCNICO CHANCELA')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- CRIAR TABELA TEMPORÁRIA PARA CURSOS E VÍNCULOS
-- =============================================================================
CREATE TEMP TABLE temp_cursos_modalidades (
  curso_nome TEXT,
  modalidade_nome TEXT
);

-- =============================================================================
-- INSERIR DADOS: Aperfeiçoamento De Estudos
-- =============================================================================
INSERT INTO temp_cursos_modalidades (modalidade_nome, curso_nome) VALUES
('Aperfeiçoamento De Estudos', 'ARTE E EDUCAÇÃO'),
('Aperfeiçoamento De Estudos', 'DIREITO APLICADO À EDUCAÇÃO'),
('Aperfeiçoamento De Estudos', 'DISTÚRBIOS NA APRENDIZAGEM'),
('Aperfeiçoamento De Estudos', 'EDUCAÇÃO DE JOVENS E ADULTOS (EJA)'),
('Aperfeiçoamento De Estudos', 'EDUCAÇÃO ESPECIAL EM DEFICIÊNCIA INTELECTUAL'),
('Aperfeiçoamento De Estudos', 'EDUCAÇÃO MUSICAL'),
('Aperfeiçoamento De Estudos', 'ESTUDOS SOBRE O AUTISMO'),
('Aperfeiçoamento De Estudos', 'NEUROEDUCAÇÃO'),
('Aperfeiçoamento De Estudos', 'PEDAGOGIA EMPRESARIAL'),
('Aperfeiçoamento De Estudos', 'PSICOMOTRICIDADE');

-- =============================================================================
-- INSERIR DADOS: Extensão Universitária
-- =============================================================================
INSERT INTO temp_cursos_modalidades (modalidade_nome, curso_nome) VALUES
('Extensão Universitária', 'DIDÁTICA NAS SÉRIES INICIAIS'),
('Extensão Universitária', 'ACESSIBILIDADE ESCOLAR'),
('Extensão Universitária', 'AEE ATENDIMENTO EDUCACIONAL ESPECIALIZADO'),
('Extensão Universitária', 'ALFABETIZAÇÃO E LETRAMENTO'),
('Extensão Universitária', 'ANÁLISE DO COMPORTAMENTO APLICADA (ABA)'),
('Extensão Universitária', 'ARTE EM EDUCAÇÃO'),
('Extensão Universitária', 'ATUAÇÃO DOCENTE NA EDUCAÇÃO INCLUSIVA'),
('Extensão Universitária', 'AUTISMO'),
('Extensão Universitária', 'CAPACITAÇÃO E FORMAÇÃO EAD'),
('Extensão Universitária', 'CIÊNCIAS DAS RELIGIÕES'),
('Extensão Universitária', 'DEFICIÊNCIA FÍSICA E ACESSIBILIDADE ESCOLAR'),
('Extensão Universitária', 'DEFICIÊNCIA INTELECTUAL'),
('Extensão Universitária', 'DIREITO APLICADO À EDUCAÇÃO'),
('Extensão Universitária', 'DISTÚRBIO DE APRENDIZAGEM COM ÊNFASE EM TRANSTORNO DESINTEGRATIVO DA INFÂNCIA (TDI)'),
('Extensão Universitária', 'DISTÚRBIO NA APRENDIZAGEM'),
('Extensão Universitária', 'DISTÚRBIOS DA APRENDIZAGEM'),
('Extensão Universitária', 'DIVERSIDADE E APRENDIZAGEM NA ESCOLA'),
('Extensão Universitária', 'EDUCAÇÃO BÁSICA E O LETRAMENTO DIGITAL'),
('Extensão Universitária', 'EDUCAÇÃO E AS TICS'),
('Extensão Universitária', 'EDUCAÇÃO E CULTURA INDÍGENAS'),
('Extensão Universitária', 'EDUCAÇÃO E DESENVOLVIMENTO INFANTIL'),
('Extensão Universitária', 'EDUCAÇÃO E SOCIEDADE'),
('Extensão Universitária', 'DIREITOS HUMANOS'),
('Extensão Universitária', 'EDUCAÇÃO ESPECIAL'),
('Extensão Universitária', 'EDUCAÇÃO ESPECIAL E A INCLUSÃO ESCOLAR'),
('Extensão Universitária', 'EDUCAÇÃO ESPECIAL E INCLUSÃO SOCIAL'),
('Extensão Universitária', 'EDUCAÇÃO ESPECIAL EM DEFICIÊNCIA INTELECTUAL'),
('Extensão Universitária', 'EDUCAÇÃO INCLUSIVA'),
('Extensão Universitária', 'EDUCAÇÃO INFANTIL'),
('Extensão Universitária', 'EDUCAÇÃO INFANTIL (ANOS INICIAIS) COM ÊNFASE EM PSICOPEDAGOGIA'),
('Extensão Universitária', 'EDUCAÇÃO INFANTIL ESPECIAL COM ÊNFASE EM TRANSTORNOS GLOBAIS'),
('Extensão Universitária', 'EDUCAÇÃO INTEGRAL'),
('Extensão Universitária', 'EDUCAÇÃO MUSICAL'),
('Extensão Universitária', 'EDUCAÇÃO SOCIAL'),
('Extensão Universitária', 'EDUCAÇÃO VOLTADA À DEFICIENTES AUDITIVOS'),
('Extensão Universitária', 'GESTÃO ESCOLAR'),
('Extensão Universitária', 'LUDOPEDAGOGIA'),
('Extensão Universitária', 'NEUROEDUCAÇÃO'),
('Extensão Universitária', 'NEUROPSICOPEDAGOGIA'),
('Extensão Universitária', 'PEDAGOGIA EMPRESARIAL'),
('Extensão Universitária', 'PSICOMOTRICIDADE'),
('Extensão Universitária', 'PSICOPEDAGOGIA INSTITUCIONAL'),
('Extensão Universitária', 'SUPERVISÃO ESCOLAR'),
('Extensão Universitária', 'TEA: CONTEXTO E INCLUSÃO'),
('Extensão Universitária', 'TRANSTORNO DO ESPECTRO AUTISTA');

-- =============================================================================
-- INSERIR DADOS: Formação Pedagógica
-- =============================================================================
INSERT INTO temp_cursos_modalidades (modalidade_nome, curso_nome) VALUES
('Formação Pedagógica', 'ARTES VISUAIS'),
('Formação Pedagógica', 'CIÊNCIAS BIOLÓGICAS'),
('Formação Pedagógica', 'CIÊNCIAS DA RELIGIÃO'),
('Formação Pedagógica', 'CIÊNCIAS SOCIAIS'),
('Formação Pedagógica', 'EDUCAÇÃO ESPECIAL'),
('Formação Pedagógica', 'EDUCAÇÃO FÍSICA'),
('Formação Pedagógica', 'FILOSOFIA'),
('Formação Pedagógica', 'LETRAS PORTUGUÊS / INGLÊS'),
('Formação Pedagógica', 'FÍSICA'),
('Formação Pedagógica', 'GEOGRAFIA'),
('Formação Pedagógica', 'HISTÓRIA'),
('Formação Pedagógica', 'INGLÊS'),
('Formação Pedagógica', 'LETRAS LÍNGUA PORTUGUESA/LIBRAS'),
('Formação Pedagógica', 'LETRAS PORTUGUÊS/ESPANHOL'),
('Formação Pedagógica', 'LIBRAS'),
('Formação Pedagógica', 'MATEMÁTICA'),
('Formação Pedagógica', 'MÚSICA'),
('Formação Pedagógica', 'PEDAGOGIA'),
('Formação Pedagógica', 'QUÍMICA'),
('Formação Pedagógica', 'SOCIOLOGIA');

-- =============================================================================
-- INSERIR DADOS: Graduação
-- =============================================================================
INSERT INTO temp_cursos_modalidades (modalidade_nome, curso_nome) VALUES
('Graduação', 'ADMINISTRAÇÃO'),
('Graduação', 'BACHARELADO EM SERVIÇO SOCIAL'),
('Graduação', 'BACHARELADO EM TEOLOGIA'),
('Graduação', 'GESTÃO DA TECNOLOGIA DA INFORMAÇÃO'),
('Graduação', 'LICENCIATURA EM EDUCAÇÃO ESPECIAL'),
('Graduação', 'LICENCIATURA EM PEDAGOGIA'),
('Graduação', 'SEGUNDA GRADUAÇÃO EM PEDAGOGIA'),
('Graduação', 'SEGURANÇA PÚBLICA'),
('Graduação', 'TECNÓLOGO EM GESTÃO COMERCIAL'),
('Graduação', 'TECNÓLOGO EM GESTÃO DE RECURSOS HUMANOS'),
('Graduação', 'TECNÓLOGO EM GESTÃO DE RECURSOS HUMANOS - 12M'),
('Graduação', 'TECNÓLOGO EM LOGÍSTICA'),
('Graduação', 'TECNÓLOGO EM LOGÍSTICA - 12M'),
('Graduação', 'TECNÓLOGO EM MARKETING'),
('Graduação', 'TECNÓLOGO EM MARKETING - 12 M'),
('Graduação', 'TECNÓLOGO EM PROCESSOS GERENCIAIS'),
('Graduação', 'TECNÓLOGO EM PROCESSOS GERENCIAIS - 12M'),
('Graduação', 'TECNÓLOGO EM SEGURANÇA PÚBLICA - 12M');

-- =============================================================================
-- INSERIR DADOS: Segunda Licenciatura
-- =============================================================================
INSERT INTO temp_cursos_modalidades (modalidade_nome, curso_nome) VALUES
('Segunda Licenciatura', 'ARTES VISUAIS'),
('Segunda Licenciatura', 'CIÊNCIAS BIOLÓGICAS'),
('Segunda Licenciatura', 'CIÊNCIAS DA RELIGIÃO'),
('Segunda Licenciatura', 'CIÊNCIAS SOCIAIS'),
('Segunda Licenciatura', 'EDUCAÇÃO ESPECIAL'),
('Segunda Licenciatura', 'EDUCAÇÃO FÍSICA'),
('Segunda Licenciatura', 'FILOSOFIA'),
('Segunda Licenciatura', 'FÍSICA'),
('Segunda Licenciatura', 'GEOGRAFIA'),
('Segunda Licenciatura', 'INGLÊS'),
('Segunda Licenciatura', 'LETRAS EM PORTUGUÊS/INGLÊS'),
('Segunda Licenciatura', 'LETRAS LÍNGUA PORTUGUESA'),
('Segunda Licenciatura', 'LETRAS PORTUGUÊS/ESPANHOL'),
('Segunda Licenciatura', 'LIBRAS'),
('Segunda Licenciatura', 'MÚSICA'),
('Segunda Licenciatura', 'PEDAGOGIA'),
('Segunda Licenciatura', 'QUÍMICA'),
('Segunda Licenciatura', 'EDUCAÇÃO ESPECIAL - FM'),
('Segunda Licenciatura', 'HISTÓRIA'),
('Segunda Licenciatura', 'LETRAS (PORTUGUÊS/LIBRAS)'),
('Segunda Licenciatura', 'LETRAS PORTUGUÊS / INGLÊS'),
('Segunda Licenciatura', 'MATEMÁTICA'),
('Segunda Licenciatura', 'SOCIOLOGIA');

-- =============================================================================
-- INSERIR DADOS: EJA
-- =============================================================================
INSERT INTO temp_cursos_modalidades (modalidade_nome, curso_nome) VALUES
('EJA', 'EJA - EDUCAÇÃO DE JOVENS E ADULTOS'),
('EJA', 'EJA - EDUCAÇÃO DE JOVENS E ADULTOS 2.0'),
('EJA', 'EJA - EDUCAÇÃO DE JOVENS E ADULTOS - D.O'),
('EJA', 'EJA - EDUCAÇÃO DE JOVENS E ADULTOS - V2'),
('EJA', 'EJA - EDUCAÇÃO DE JOVENS E ADULTOS 2.0 - D.O'),
('EJA', 'EJA - FUNDAMENTAL'),
('EJA', 'EJA - EDUCAÇÃO DE JOVENS E ADULTOS - MG'),
('EJA', 'EJA - EDUCAÇÃO DE JOVENS E ADULTOS 2.0 - MG');

-- =============================================================================
-- INSERIR DADOS: Aproveitamento/Competência (Técnicos)
-- =============================================================================
INSERT INTO temp_cursos_modalidades (modalidade_nome, curso_nome) VALUES
('Aproveitamento/Competência', 'TÉCNICO EM AGRIMENSURA'),
('Aproveitamento/Competência', 'TÉCNICO EM MARKETING'),
('Aproveitamento/Competência', 'TÉCNICO EM MECÂNICA'),
('Aproveitamento/Competência', 'TÉCNICO EM MEIO AMBIENTE'),
('Aproveitamento/Competência', 'TÉCNICO EM TTI'),
('Aproveitamento/Competência', 'TÉCNICO EM AGENTE COMUNITÁRIO DE SAÚDE'),
('Aproveitamento/Competência', 'TÉCNICO EM ANÁLISE CLÍNICA'),
('Aproveitamento/Competência', 'TÉCNICO EM CONTABILIDADE'),
('Aproveitamento/Competência', 'TÉCNICO EM EDIFICAÇÕES'),
('Aproveitamento/Competência', 'TÉCNICO EM ELETRÔNICA'),
('Aproveitamento/Competência', 'TÉCNICO EM ESTÉTICA'),
('Aproveitamento/Competência', 'TÉCNICO EM LOGÍSTICA'),
('Aproveitamento/Competência', 'TÉCNICO EM MECATRÔNICA'),
('Aproveitamento/Competência', 'TÉCNICO EM NUTRIÇÃO'),
('Aproveitamento/Competência', 'TÉCNICO EM VETERINÁRIA'),
('Aproveitamento/Competência', 'TÉCNICO EM RECURSOS HUMANOS'),
('Aproveitamento/Competência', 'TÉCNICO EM DESENVOLVIMENTO DE SISTEMAS'),
('Aproveitamento/Competência', 'TÉCNICO EM ENERGIAS RENOVÁVEL'),
('Aproveitamento/Competência', 'TÉCNICO EM QUALIDADE'),
('Aproveitamento/Competência', 'TÉCNICO EM SECRETARIADO'),
('Aproveitamento/Competência', 'TÉCNICO EM ADMINISTRAÇÃO'),
('Aproveitamento/Competência', 'TÉCNICO EM AUTOMAÇÃO'),
('Aproveitamento/Competência', 'TÉCNICO EM AUTOMAÇÃO INDUSTRIAL'),
('Aproveitamento/Competência', 'TÉCNICO EM CONSTRUÇÃO NAVAL'),
('Aproveitamento/Competência', 'TÉCNICO EM CUIDADOR DE IDOSO'),
('Aproveitamento/Competência', 'TÉCNICO EM ELETROTÉCNICA'),
('Aproveitamento/Competência', 'TÉCNICO EM FABRICAÇÃO MECÂNICA'),
('Aproveitamento/Competência', 'TÉCNICO EM INSPETOR DE EQUIPAMENTOS'),
('Aproveitamento/Competência', 'TÉCNICO EM INSPETOR DE SOLDAGEM'),
('Aproveitamento/Competência', 'TÉCNICO EM INSTRUMENTAÇÃO INDUSTRIAL'),
('Aproveitamento/Competência', 'TÉCNICO EM MECÂNICA INDUSTRIAL'),
('Aproveitamento/Competência', 'TÉCNICO EM METALURGIA'),
('Aproveitamento/Competência', 'TÉCNICO EM PETRÓLEO E GÁS'),
('Aproveitamento/Competência', 'TÉCNICO EM QUÍMICA'),
('Aproveitamento/Competência', 'TÉCNICO EM SECRETARIA ESCOLAR'),
('Aproveitamento/Competência', 'TÉCNICO EM SEGURANÇA DO TRABALHO'),
('Aproveitamento/Competência', 'TÉCNICO EM TURISMO'),
('Aproveitamento/Competência', 'TÉCNICO EM PAPEL E CELULOSE'),
('Aproveitamento/Competência', 'TÉCNICO EM REFRIGERAÇÃO E CLIMATIZAÇÃO'),
('Aproveitamento/Competência', 'TÉCNICO EM TRANSAÇÃO IMOBILIÁRIA'),
('Aproveitamento/Competência', 'TÉCNICO EM INFORMÁTICA'),
('Aproveitamento/Competência', 'TÉCNICO EM TELECOMUNICAÇÕES'),
('Aproveitamento/Competência', 'TÉCNICO EM FARMÁCIA'),
('Aproveitamento/Competência', 'TÉCNICO EM AGRICULTURA'),
('Aproveitamento/Competência', 'TÉCNICO EM AGROPECUÁRIA'),
('Aproveitamento/Competência', 'TÉCNICO EM RADIOLOGIA'),
('Aproveitamento/Competência', 'TÉCNICO EM NUTRIÇÃO E DIETÉTICA'),
('Aproveitamento/Competência', 'TÉCNICO EM SAÚDE BUCAL'),
('Aproveitamento/Competência', 'TÉCNICO EM ÓPTICA'),
('Aproveitamento/Competência', 'TÉCNICO EM SERVIÇOS JURÍDICOS'),
('Aproveitamento/Competência', 'TÉCNICO EM VENDAS'),
('Aproveitamento/Competência', 'TÉCNICO EM DESIGN GRÁFICO'),
('Aproveitamento/Competência', 'TÉCNICO EM REDES DE COMPUTADORES'),
('Aproveitamento/Competência', 'TÉCNICO EM SISTEMAS DE ENERGIA RENOVÁVEL'),
('Aproveitamento/Competência', 'TÉCNICO EM MANUTENÇÃO DE MÁQUINAS INDUSTRIAIS'),
('Aproveitamento/Competência', 'TÉCNICO EM SOLDAGEM'),
('Aproveitamento/Competência', 'TÉCNICO EM PREVENÇÃO E COMBATE AO INCÊNDIO'),
('Aproveitamento/Competência', 'TÉCNICO EM AGROINDÚSTRIA'),
('Aproveitamento/Competência', 'TÉCNICO EM GASTRONOMIA'),
('Aproveitamento/Competência', 'TÉCNICO EM ENFERMAGEM'),
('Aproveitamento/Competência', 'TÉCNICO EM Mineração'),
('Aproveitamento/Competência', 'Eletroeletrônica');

-- =============================================================================
-- INSERIR DADOS: Técnico Regular
-- =============================================================================
INSERT INTO temp_cursos_modalidades (modalidade_nome, curso_nome) VALUES
('Técnico regular', 'TÉCNICO EM ADMINISTRAÇÃO'),
('Técnico regular', 'TÉCNICO EM AGRICULTURA'),
('Técnico regular', 'TÉCNICO EM AGROPECUÁRIA'),
('Técnico regular', 'TÉCNICO EM ANÁLISES CLÍNICAS'),
('Técnico regular', 'TÉCNICO EM COMPLIANCE'),
('Técnico regular', 'TÉCNICO EM CRIPTOMOEDAS'),
('Técnico regular', 'TÉCNICO EM CUIDADOR DE IDOSOS'),
('Técnico regular', 'TÉCNICO EM ELETROELETRÔNICA'),
('Técnico regular', 'TÉCNICO EM CONTABILIDADE'),
('Técnico regular', 'TÉCNICO EM DESIGN GRÁFICO'),
('Técnico regular', 'TÉCNICO EM DESENVOLVIMENTO DE SISTEMAS'),
('Técnico regular', 'TÉCNICO EM EDIFICAÇÕES'),
('Técnico regular', 'TÉCNICO EM ELETROMECÂNICA'),
('Técnico regular', 'TÉCNICO EM ENFERMAGEM'),
('Técnico regular', 'TÉCNICO EM ESTÉTICA'),
('Técnico regular', 'TÉCNICO EM FARMÁCIA'),
('Técnico regular', 'TÉCNICO EM GUIA DE TURISMO'),
('Técnico regular', 'TÉCNICO EM INFORMÁTICA'),
('Técnico regular', 'TÉCNICO EM LOGÍSTICA'),
('Técnico regular', 'TÉCNICO EM MARKETING'),
('Técnico regular', 'TÉCNICO EM MECATRÔNICA'),
('Técnico regular', 'TÉCNICO EM MEIO AMBIENTE'),
('Técnico regular', 'TÉCNICO EM NUTRIÇÃO E DIETÉTICA'),
('Técnico regular', 'TÉCNICO EM ÓPTICA'),
('Técnico regular', 'TÉCNICO EM QUALIDADE'),
('Técnico regular', 'TÉCNICO EM RADIOLOGIA'),
('Técnico regular', 'TÉCNICO EM RECURSOS HUMANOS'),
('Técnico regular', 'TÉCNICO EM REDES DE COMPUTADORES'),
('Técnico regular', 'TÉCNICO EM SAÚDE BUCAL'),
('Técnico regular', 'TÉCNICO EM SECRETARIADO'),
('Técnico regular', 'TÉCNICO EM SECRETARIA ESCOLAR'),
('Técnico regular', 'TÉCNICO EM SEGURANÇA DO TRABALHO'),
('Técnico regular', 'TÉCNICO EM SERVIÇOS JURÍDICOS'),
('Técnico regular', 'TÉCNICO EM SISTEMAS DE ENERGIA RENOVÁVEL'),
('Técnico regular', 'TÉCNICO EM TELECOMUNICAÇÕES'),
('Técnico regular', 'TÉCNICO EM TRANSAÇÕES IMOBILIÁRIAS'),
('Técnico regular', 'TÉCNICO EM VENDAS'),
('Técnico regular', 'TÉCNICO EM VETERINÁRIA');

-- =============================================================================
-- INSERIR DADOS: Superior Sequencial
-- =============================================================================
INSERT INTO temp_cursos_modalidades (modalidade_nome, curso_nome) VALUES
('Superior Sequencial', 'GESTÃO EM TEOLOGIA'),
('Superior Sequencial', 'ALFABETIZAÇÃO E LETRAMENTO'),
('Superior Sequencial', 'ANÁLISES DE DADOS'),
('Superior Sequencial', 'CADEIA DE SUPPLY CHAIN'),
('Superior Sequencial', 'EDUCAÇÃO ESPECIAL'),
('Superior Sequencial', 'FORMAÇÃO DOCENTE PARA EAD'),
('Superior Sequencial', 'GESTÃO AMBIENTAL'),
('Superior Sequencial', 'GESTÃO COMERCIAL E VENDAS'),
('Superior Sequencial', 'GESTÃO DA AUDITORIA'),
('Superior Sequencial', 'GESTÃO DA PRODUÇÃO'),
('Superior Sequencial', 'GESTÃO DE EMPRESAS'),
('Superior Sequencial', 'GESTÃO DE LOGÍSTICA'),
('Superior Sequencial', 'GESTÃO DE OBRAS CIVIS'),
('Superior Sequencial', 'GESTÃO DE PESSOAS'),
('Superior Sequencial', 'GESTÃO DE PESSOAS E COACHING'),
('Superior Sequencial', 'GESTÃO DE PROJETOS'),
('Superior Sequencial', 'GESTÃO E LIDERANÇA'),
('Superior Sequencial', 'GESTÃO EDUCACIONAL E PEDAGÓGICA'),
('Superior Sequencial', 'GESTÃO EM CONTABILIDADE'),
('Superior Sequencial', 'GESTÃO EM MARKETING'),
('Superior Sequencial', 'GESTÃO EM RECURSOS HUMANOS'),
('Superior Sequencial', 'GESTÃO EM SAÚDE'),
('Superior Sequencial', 'GESTÃO EM TRÂNSITO'),
('Superior Sequencial', 'GESTÃO ESCOLAR'),
('Superior Sequencial', 'GESTÃO FINANCEIRA'),
('Superior Sequencial', 'GESTÃO HOSPITALAR'),
('Superior Sequencial', 'GESTÃO PÚBLICA'),
('Superior Sequencial', 'GESTÃO SEGURANÇA PÚBLICA E PRIVADA'),
('Superior Sequencial', 'NEUROEDUCAÇÃO'),
('Superior Sequencial', 'RECUPERAÇÃO DE DADOS'),
('Superior Sequencial', 'SEGURANÇA PÚBLICA E PRIVADA'),
('Superior Sequencial', 'TECNOLOGIA DA INFORMAÇÃO'),
('Superior Sequencial', 'TRANSTORNO DO ESPECTRO AUTISTA');

-- =============================================================================
-- PROCESSAR CURSOS E VÍNCULOS
-- =============================================================================

-- Inserir cursos únicos
INSERT INTO cursos (nome)
SELECT DISTINCT curso_nome FROM temp_cursos_modalidades
ON CONFLICT DO NOTHING;

-- Criar vínculos entre cursos e modalidades
INSERT INTO curso_modalidades (curso_id, modalidade_id)
SELECT DISTINCT c.id, m.id
FROM temp_cursos_modalidades t
JOIN cursos c ON c.nome = t.curso_nome
JOIN modalidades m ON m.nome = t.modalidade_nome
ON CONFLICT DO NOTHING;

-- Limpar tabela temporária
DROP TABLE temp_cursos_modalidades;

-- =============================================================================
-- VERIFICAR RESULTADOS
-- =============================================================================
SELECT 
  'Modalidades' as tabela, 
  COUNT(*) as total 
FROM modalidades
UNION ALL
SELECT 
  'Cursos' as tabela, 
  COUNT(*) as total 
FROM cursos
UNION ALL
SELECT 
  'Vínculos' as tabela, 
  COUNT(*) as total 
FROM curso_modalidades;
