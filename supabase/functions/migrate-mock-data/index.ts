import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============= DADOS DOS POLOS =============
const POLOS_DATA: { nome: string; telefone: string | null }[] = [
  { nome: "POLO TESTE", telefone: "(44) 99905-6702" },
  { nome: "Programa Universidade Fácil", telefone: "(44) 99846-8426" },
  { nome: "Polo Suzano sp", telefone: "(11) 99109-4750" },
  { nome: "FAROL EDUCAÇAO", telefone: "(14) 99686-5577" },
  { nome: "CASTILHO SILVA & CIA LTDA", telefone: "(32) 3722-5332" },
  { nome: "Polo EDUKS EAD LTDA", telefone: "(17) 98104-3712" },
  { nome: "CETED EDUCACIONAL", telefone: "(88) 99247-6643" },
  { nome: "LATec - Aracruz", telefone: "(27) 99247-3213" },
  { nome: "Sudeste Goiano", telefone: "(64) 99290-2890" },
  { nome: "o ECET Evoluir", telefone: "(43) 9628-8045" },
  { nome: "Melius Educacional", telefone: "(31) 99295-3923" },
  { nome: "INSTITUTO TECNICO PAULISTA", telefone: "(55) 11911-6028" },
  { nome: "CLUBE DO TÉCNICO", telefone: "(55) 19997-4287" },
  { nome: "REDE DICLER - DICLER CARLOS DE ASSIS CARMO", telefone: "(11) 95330-9860" },
  { nome: "UniSaber Educação", telefone: "(51) 98476-9527" },
  { nome: "CENTRO INOVAR", telefone: "(93) 99170-7336" },
  { nome: "Focus Educacional - RJ", telefone: "(21) 97679-9616" },
  { nome: "Central de Cursos Boca do Acre", telefone: "(97) 98803-7970" },
  { nome: "Absoluto Educacional", telefone: "(11) 94709-6278" },
  { nome: "Politech", telefone: "(45) 99915-0285" },
  { nome: "Grupo Martins", telefone: "(91) 98074-6200" },
  { nome: "IGEA educacional", telefone: "(62) 98146-7286" },
  { nome: "Aprender na tela", telefone: "(21) 96409-5948" },
  { nome: "Mix cursos", telefone: "(35) 99767-1464" },
  { nome: "PPP Company", telefone: "(65) 98467-1009" },
  { nome: "Instituto Zulemay Ramos Ltda", telefone: "(91) 2121-0444" },
  { nome: "CENTRO INOVAR 2", telefone: "(93) 99170-1025" },
  { nome: "Centro Nacional de Educação", telefone: "(27) 99519-9250" },
  { nome: "Prisma Educacional", telefone: "(87) 98815-2317" },
  { nome: "Centro de Treinamento Webcursos", telefone: "(12) 99126-9013" },
  { nome: "MB EMPREENDIMENTOS - EDUCAÇÃO & CONSULTORIA LTDA", telefone: "(88) 99201-2006" },
  { nome: "ENSINO MESTRE", telefone: "(91) 99204-7656" },
  { nome: "Seus Cursos Líderes", telefone: "(87) 99662-4376" },
  { nome: "Colo de Mãe", telefone: "(69) 99362-8587" },
  { nome: "Unipratic", telefone: "(41) 99770-4543" },
  { nome: "Instituto Educacional Monógenis", telefone: "(16) 99623-2537" },
  { nome: "InstitutoDesenvolver - cursos , Treinamentos e Terapias", telefone: "(51) 99898-0377" },
  { nome: "Instituto Melo de Educação Ltda", telefone: "(88) 99974-0416" },
  { nome: "Louredo Mark Contabilidade e Treinamento LTDA", telefone: "(98) 98741-4277" },
  { nome: "Graduar Sa", telefone: "(82) 99426-0527" },
  { nome: "Marrizia", telefone: "(18) 98126-9276" },
  { nome: "JG NEGOCIOS ONLINE", telefone: "(55) 31985-1557" },
  { nome: "CECE", telefone: "(89) 8138-6868" },
  { nome: "ASSESSORIA EDUCACIONAL FN SOLUÇÕES", telefone: "(98) 99964-2736" },
  { nome: "Skillsead", telefone: "(91) 98149-9561" },
  { nome: "CEBRAC", telefone: "(55) 14998-0580" },
  { nome: "Microclass Cursos", telefone: "(99) 98554-8001" },
  { nome: "Centro de Educação Profissional Dimensão - CEPED", telefone: "(77) 99903-0683" },
  { nome: "AHEDUCA", telefone: "(11) 95286-5004" },
  { nome: "Preparatório Ideal EAD", telefone: "(32) 99985-4753" },
  { nome: "Joice Batista Serviços", telefone: "(47) 98447-4668" },
  { nome: "Barbara Righi Pampolini", telefone: "(37) 99957-9826" },
  { nome: "seu futuro ead", telefone: "(67) 99910-2966" },
  { nome: "Centro de Apoio Educacional", telefone: "(66) 99253-1556" },
  { nome: "Instituto Querida Alma", telefone: "(83) 98832-0460" },
  { nome: "Oni Cursos", telefone: "(22) 99888-8878" },
  { nome: "CENTRO EDUCACIONAL EVOLUTION LTDA", telefone: "(48) 9133-4048" },
  { nome: "ANDREA COUTINHO MACEDO", telefone: "(75) 98297-2059" },
  { nome: "Edu Max - Ensino e Gestão", telefone: "(83) 99918-8392" },
  { nome: "Instituto SaberNovo", telefone: "(91) 98634-4640" },
  { nome: "Master cursos", telefone: "(21) 96458-1065" },
  { nome: "COFTEC (Centro de Formação Técnica)", telefone: "(22) 99825-5240" },
  { nome: "Lia Ferreira Espaço do Aprender", telefone: "(31) 98484-1865" },
  { nome: "Pro Conecta", telefone: "(11) 96841-9959" },
  { nome: "Br cursos e exames toxicológicos", telefone: "(63) 99113-5859" },
  { nome: "Ceic: Centro de Educação Integrado do Ceará", telefone: "(88) 99935-4323" },
  { nome: "TERESA EDUCAÇÃO", telefone: "(35) 99826-1851" },
  { nome: "Andrei Fernando Francisco da Luz", telefone: "(47) 99706-0733" },
  { nome: "G7 Treinamentos", telefone: "(34) 99215-5016" },
  { nome: "Instituto Union", telefone: "(31) 98035-0407" },
  { nome: "Prodygio Educação", telefone: "(22) 98815-9288" },
  { nome: "ALAN ALESSANDRO RODRIGUES ALV", telefone: "(13) 99104-9298" },
  { nome: "LAN ACADEMY", telefone: "(16) 99600-1768" },
  { nome: "conexão educação para todos", telefone: "(81) 8210-3091" },
  { nome: "ALFAEDU", telefone: "(94) 99108-6560" },
  { nome: "G-Tech Educação", telefone: "(21) 98190-2002" },
  { nome: "Centro Educacional Capacita-CEDUCAP", telefone: "(41) 3383-0706" },
  { nome: "Dra Débora Gonçalves", telefone: "(16) 98101-4291" },
  { nome: "Multdestaque", telefone: "(21) 99815-1349" },
  { nome: "Edson Santana Educacional", telefone: "(99) 98202-7062" },
  { nome: "GUARULHOS", telefone: "(11) 95028-9854" },
  { nome: "EJA ON", telefone: "(27) 99614-2329" },
  { nome: "CENTRO EDUCACIONAL MÚLTIPLA ESCOLHA LTDA", telefone: "(51) 98026-3133" },
  { nome: "Prime Profissões", telefone: "(12) 32332-3232" },
  { nome: "Dri&Leo ltda", telefone: "(35) 99903-7763" },
  { nome: "FFarias", telefone: "(22) 99237-4230" },
  { nome: "Wisch Educacional", telefone: "(77) 9868-9863" },
  { nome: "INSTITUTO IMPAKTO SOCIAL", telefone: "(71) 98217-2001" },
  { nome: "Elenir de Oliveira Carvalho", telefone: "(92) 99262-9367" },
  { nome: "CFS - CENTRO DE FORMAÇÃO E SERVIÇOS INTEGRADOS - MOTIV EDUCA CURSOS", telefone: "(75) 99945-0547" },
  { nome: "KENNEDY JAMESTONY DE CARVALHO E SOUZA", telefone: "(87) 9642-4340" },
  { nome: "Tomé-Açu Pará", telefone: "(91) 99173-1816" },
  { nome: "INSTITUTO ENSINAR BRASIL", telefone: "(33) 99913-9303" },
  { nome: "Pedro Paulo Goes de Andrade", telefone: "(71) 9121-6084" },
  { nome: "SUPERAZO EVOLUÇÃO EDUCACIONAL", telefone: "(21) 99470-4737" },
  { nome: "Polo Educacional luz do mundo", telefone: "(21) 92036-1802" },
  { nome: "UNICENTARI-X", telefone: "(61) 8240-7201" },
  { nome: "CENTRO ITAI", telefone: "(55) 31890-5475" },
  { nome: "EAD CENTER", telefone: "(11) 97825-4513" },
  { nome: "TRATOS", telefone: null },
  { nome: "COD EDUCACIONAL", telefone: null },
  { nome: "Valeria Nunes cruz", telefone: "(94) 98430-7845" },
  { nome: "BCD Aliança Cursos Preparatórios LTDA", telefone: "(43) 99659-0777" },
];

// ============= DADOS DAS MODALIDADES E CURSOS =============
const MODALIDADES_CURSOS: Record<string, string[]> = {
  "Aperfeiçoamento De Estudos": [
    "ARTE E EDUCAÇÃO",
    "DIREITO APLICADO À EDUCAÇÃO",
    "DISTÚRBIOS NA APRENDIZAGEM",
    "EDUCAÇÃO DE JOVENS E ADULTOS (EJA)",
    "EDUCAÇÃO ESPECIAL EM DEFICIÊNCIA INTELECTUAL",
    "EDUCAÇÃO MUSICAL",
    "ESTUDOS SOBRE O AUTISMO",
    "NEUROEDUCAÇÃO",
    "PEDAGOGIA EMPRESARIAL",
    "PSICOMOTRICIDADE",
  ],
  "Extensão Universitária": [
    "DIDÁTICA NAS SÉRIES INICIAIS",
    "ACESSIBILIDADE ESCOLAR",
    "AEE ATENDIMENTO EDUCACIONAL ESPECIALIZADO",
    "ALFABETIZAÇÃO E LETRAMENTO",
    "ANÁLISE DO COMPORTAMENTO APLICADA (ABA)",
    "ARTE EM EDUCAÇÃO",
    "ATUAÇÃO DOCENTE NA EDUCAÇÃO INCLUSIVA",
    "AUTISMO",
    "CAPACITAÇÃO E FORMAÇÃO EAD",
    "CIÊNCIAS DAS RELIGIÕES",
    "DEFICIÊNCIA FÍSICA E ACESSIBILIDADE ESCOLAR",
    "DEFICIÊNCIA INTELECTUAL",
    "DIREITO APLICADO À EDUCAÇÃO",
    "DISTÚRBIO DE APRENDIZAGEM COM ÊNFASE EM TRANSTORNO DESINTEGRATIVO DA INFÂNCIA (TDI)",
    "DISTÚRBIO NA APRENDIZAGEM",
    "DISTÚRBIOS DA APRENDIZAGEM",
    "DIVERSIDADE E APRENDIZAGEM NA ESCOLA",
    "EDUCAÇÃO BÁSICA E O LETRAMENTO DIGITAL",
    "EDUCAÇÃO E AS TICS",
    "EDUCAÇÃO E CULTURA INDÍGENAS",
    "EDUCAÇÃO E DESENVOLVIMENTO INFANTIL",
    "EDUCAÇÃO E SOCIEDADE",
    "DIREITOS HUMANOS",
    "EDUCAÇÃO ESPECIAL",
    "EDUCAÇÃO ESPECIAL E A INCLUSÃO ESCOLAR",
    "EDUCAÇÃO ESPECIAL E INCLUSÃO SOCIAL",
    "EDUCAÇÃO ESPECIAL EM DEFICIÊNCIA INTELECTUAL",
    "EDUCAÇÃO INCLUSIVA",
    "EDUCAÇÃO INFANTIL",
    "EDUCAÇÃO INFANTIL (ANOS INICIAIS) COM ÊNFASE EM PSICOPEDAGOGIA",
    "EDUCAÇÃO INFANTIL ESPECIAL COM ÊNFASE EM TRANSTORNOS GLOBAIS",
    "EDUCAÇÃO INTEGRAL",
    "EDUCAÇÃO MUSICAL",
    "EDUCAÇÃO SOCIAL",
    "EDUCAÇÃO VOLTADA À DEFICIENTES AUDITIVOS",
    "GESTÃO ESCOLAR",
    "NEUROEDUCAÇÃO",
    "NEUROPSICOPEDAGOGIA",
    "PSICOMOTRICIDADE",
  ],
  "Formação Pedagógica": [
    "ARTES VISUAIS",
    "CIÊNCIAS BIOLÓGICAS",
    "CIÊNCIAS DA RELIGIÃO",
    "CIÊNCIAS SOCIAIS",
    "EDUCAÇÃO ESPECIAL",
    "EDUCAÇÃO FÍSICA",
    "FILOSOFIA",
    "LETRAS PORTUGUÊS / INGLÊS",
    "FÍSICA",
    "GEOGRAFIA",
    "HISTÓRIA",
    "INGLÊS",
    "LETRAS LÍNGUA PORTUGUESA/LIBRAS",
    "LETRAS PORTUGUÊS/ESPANHOL",
    "LIBRAS",
    "MATEMÁTICA",
    "MÚSICA",
    "PEDAGOGIA",
    "QUÍMICA",
    "SOCIOLOGIA",
  ],
  "Graduação": [
    "ADMINISTRAÇÃO",
    "BACHARELADO EM SERVIÇO SOCIAL",
    "BACHARELADO EM TEOLOGIA",
    "GESTÃO DA TECNOLOGIA DA INFORMAÇÃO",
    "LICENCIATURA EM EDUCAÇÃO ESPECIAL",
    "LICENCIATURA EM PEDAGOGIA",
    "SEGUNDA GRADUAÇÃO EM PEDAGOGIA",
    "SEGURANÇA PÚBLICA",
    "TECNÓLOGO EM GESTÃO COMERCIAL",
    "TECNÓLOGO EM GESTÃO DE RECURSOS HUMANOS",
    "TECNÓLOGO EM LOGÍSTICA",
    "TECNÓLOGO EM MARKETING",
    "TECNÓLOGO EM PROCESSOS GERENCIAIS",
  ],
  "Pós-Graduação": [
    "MBA EM GESTÃO DE PROJETOS",
    "ALFABETIZAÇÃO E LETRAMENTO",
    "EDUCAÇÃO ESPECIAL E INCLUSIVA",
    "DOCÊNCIA NO ENSINO SUPERIOR",
    "PSICOPEDAGOGIA CLÍNICA E INSTITUCIONAL",
    "GESTÃO ESCOLAR",
    "NEUROPSICOPEDAGOGIA",
    "MBA EM GESTÃO DE PESSOAS",
    "MBA EM MARKETING DIGITAL",
    "LIBRAS",
    "EDUCAÇÃO INFANTIL",
  ],
  "Segunda Licenciatura": [
    "ARTES VISUAIS",
    "CIÊNCIAS BIOLÓGICAS",
    "CIÊNCIAS DA RELIGIÃO",
    "EDUCAÇÃO ESPECIAL",
    "EDUCAÇÃO FÍSICA",
    "FILOSOFIA",
    "FÍSICA",
    "GEOGRAFIA",
    "HISTÓRIA",
    "LETRAS - PORTUGUÊS",
    "LETRAS - INGLÊS",
    "LETRAS - ESPANHOL",
    "LIBRAS",
    "MATEMÁTICA",
    "MÚSICA",
    "PEDAGOGIA",
    "QUÍMICA",
    "SOCIOLOGIA",
  ],
  "Técnico regular": [
    "TÉCNICO EM ADMINISTRAÇÃO",
    "TÉCNICO EM AGRONEGÓCIO",
    "TÉCNICO EM ENFERMAGEM",
    "TÉCNICO EM INFORMÁTICA",
    "TÉCNICO EM LOGÍSTICA",
    "TÉCNICO EM RECURSOS HUMANOS",
    "TÉCNICO EM SEGURANÇA DO TRABALHO",
    "TÉCNICO EM TRANSAÇÕES IMOBILIÁRIAS",
    "TÉCNICO EM CONTABILIDADE",
    "TÉCNICO EM MARKETING",
    "TÉCNICO EM MEIO AMBIENTE",
    "TÉCNICO EM FARMÁCIA",
    "TÉCNICO EM SECRETARIA ESCOLAR",
  ],
  "EJA": [
    "ENSINO FUNDAMENTAL",
    "ENSINO MÉDIO",
  ],
  "Profissionalizante Avançado": [
    "ADMINISTRAÇÃO PARA MICRO E MÉDIAS EMPRESAS",
    "AROMATERAPIA",
    "AUDITORIA EM ENFERMAGEM",
    "AUTISMO",
    "AUXILIAR DE CONTABILIDADE",
    "CUIDADOR DE IDOSOS",
    "GESTÃO DE RECURSOS HUMANOS",
    "GESTÃO BANCÁRIA",
    "INTELIGÊNCIA ARTIFICIAL",
    "MARKETING DIGITAL",
  ],
  "Profissionalizante Especial": [
    "AUX. DE SAÚDE BUCAL",
    "AUXILIAR DE ENFERMAGEM ESPECIAL",
    "CURSO DE INGLES",
  ],
  "Pós Técnico": [
    "ADMINISTRAÇÃO DA PRODUÇÃO",
    "CENTRAL DE MATERIAL E ESTERILIZAÇÃO",
    "CONTROLE DA QUALIDADE EM FARMÁCIA",
    "COSMETOLOGIA",
    "ENERGIA SOLAR FOTOVOLTAICA",
    "FARMÁCIA HOSPITALAR",
    "GESTÃO DA PRODUÇÃO",
    "HIGIENE OCUPACIONAL",
    "SAÚDE DO TRABALHADOR",
    "SAÚDE PÚBLICA",
    "URGÊNCIA E EMERGÊNCIA/APH",
    "ERGONOMIA",
    "SECRETARIA ESCOLAR",
  ],
  "PROFISSIONALIZANTES PREMIUM": [
    "LEAN SEIS SIGMA",
    "ISO 9001",
    "GESTÃO DE PROCESSOS",
    "MARKETING DIGITAL",
    "EXCEL AVANÇADO",
    "POWER BI",
    "PHOTOSHOP",
    "AUTOCAD",
    "PYTHON",
    "INGLÊS PARA NEGÓCIOS",
  ],
  "PÓS - GRADUAÇÕES - VINCIT": [
    "DOCÊNCIA NO ENSINO SUPERIOR",
    "GESTÃO ESCOLAR",
    "PSICOPEDAGOGIA",
    "EDUCAÇÃO ESPECIAL E INCLUSIVA",
    "NEUROPSICOPEDAGOGIA",
  ],
  "PÓS - GRADUAÇÕES - UNIMAIS": [
    "DOCÊNCIA NO ENSINO SUPERIOR",
    "GESTÃO ESCOLAR",
    "EDUCAÇÃO ESPECIAL E INCLUSIVA",
    "MBA EM GESTÃO DE PESSOAS",
    "MBA EM MARKETING",
    "ALFABETIZAÇÃO E LETRAMENTO",
    "PSICOPEDAGOGIA CLÍNICA E INSTITUCIONAL",
  ],
  "BACHAREL/ LICENCIATURA - UNIMAIS": [
    "MATEMÁTICA - LICENCIATURA",
    "PEDAGOGIA - LICENCIATURA",
    "HISTÓRIA - LICENCIATURA",
    "LETRAS - LIBRAS - LÍNGUA PORTUGUESA - LICENCIATURA",
    "ARTES VISUAIS - LICENCIATURA",
    "CIÊNCIAS SOCIAIS - LICENCIATURA",
    "CIÊNCIAS CONTÁBEIS - BACHAREL",
    "ADMINISTRAÇÃO - BACHAREL",
    "TEOLOGIA - BACHAREL",
  ],
  "SEGUNDA LICENCIATURA/FORMAÇÃO PEDAGÓGICA - UNIMAIS": [
    "SEGUNDA LICENCIATURA EM HISTÓRIA",
    "SEGUNDA LICENCIATURA EM CIÊNCIAS SOCIAIS",
    "SEGUNDA LICENCIATURA EM MATEMÁTICA",
    "SEGUNDA LICENCIATURA EM ARTES VISUAIS",
    "SEGUNDA LICENCIATURA EM PEDAGOGIA",
    "FORMAÇÃO PEDAGÓGICA EM HISTÓRIA",
    "FORMAÇÃO PEDAGÓGICA EM CIÊNCIAS SOCIAIS",
    "FORMAÇÃO PEDAGÓGICA EM MATEMÁTICA",
    "FORMAÇÃO PEDAGÓGICA EM ARTES VISUAIS",
  ],
  "TECNÓLOGOS - UNIMAIS": [
    "RECURSOS HUMANOS",
    "GESTÃO FINANCEIRA",
    "GESTÃO AMBIENTAL",
    "GESTÃO DE SEGURANÇA PRIVADA",
    "SERVIÇOS JURÍDICOS - 36 MESES",
  ],
  "FORMAÇÃO SPEED - UNIMAIS": [
    "TECNÓLOGOS EM RECURSOS HUMANOS - 12 MESES",
    "TECNÓLOGOS EM GESTÃO FINANCEIRA - 12 MESES",
    "TECNÓLOGOS EM GESTÃO AMBIENTAL - 12 MESES",
    "LICENCIATURA EM MATEMÁTICA - 2 ANOS",
    "LICENCIATURA EM PEDAGOGIA - 2 ANOS",
    "LICENCIATURA EM HISTÓRIA - 2 ANOS",
  ],
  "PROFISSIONALIZANTES COMUM": [
    "EXCEL BÁSICO E AVANÇADO",
    "WORD",
    "POWERPOINT",
    "PHOTOSHOP CC",
    "POWER BI",
    "CANVA",
    "LIBRAS",
    "ESPANHOL",
    "INGLÊS",
    "CUIDADOR DE IDOSO",
    "AUXILIAR DE VETERINÁRIO",
    "MANICURE E PEDICURE",
    "BARBEIRO PROFISSIONAL",
    "ELETRICISTA",
    "ENERGIA SOLAR",
  ],
  "DOUTORADOS/MESTRADOS/PÓS DOUTORADO - IVY ENBER": [
    "DOUTORADO EM EDUCAÇÃO",
    "DOUTORADO EM ADMINISTRAÇÃO",
    "MESTRADO EM EDUCAÇÃO",
    "MESTRADO EM ADMINISTRAÇÃO",
    "PÓS-DOUTORADO EM EDUCAÇÃO",
  ],
  "PÓS-GRADUAÇÃO CHANCELA": [
    "MBA EM DIREITO DE FAMÍLIA E SUCESSÕES",
    "MBA EM DIREITO PÚBLICO E DO TERCEIRO SETOR",
    "MBA EM GESTÃO JURÍDICA CRIMINAL COMPLIANCE",
    "CARDIOLOGIA",
    "CLÍNICA CIRÚRGICA E CIRURGIA GERAL",
    "CLÍNICA MÉDICA",
    "DERMATOLOGIA CLÍNICA",
    "ENDOCRINOLOGIA",
    "PSIQUIATRIA E SAÚDE MENTAL",
    "GINECOLOGIA E OBSTETRÍCIA",
    "PEDIATRIA",
    "MEDICINA DO TRABALHO",
    "NEUROLOGIA",
  ],
  "Aproveitamento/Competência": [
    "APROVEITAMENTO DE ESTUDOS",
    "COMPETÊNCIA PROFISSIONAL",
  ],
  "Superior Sequencial": [
    "GESTÃO COMERCIAL",
    "GESTÃO DE RECURSOS HUMANOS",
    "GESTÃO FINANCEIRA",
    "LOGÍSTICA",
    "MARKETING",
  ],
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar método
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar cliente Supabase com service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const stats = {
      modalidades: { inserted: 0, existing: 0, errors: 0 },
      polos: { inserted: 0, existing: 0, errors: 0 },
      cursos: { inserted: 0, existing: 0, errors: 0 },
      vinculos: { inserted: 0, existing: 0, errors: 0 },
    };

    // ============= FASE 1: INSERIR MODALIDADES =============
    console.log('Fase 1: Inserindo modalidades...');
    const modalidadeNames = Object.keys(MODALIDADES_CURSOS);
    
    for (const nome of modalidadeNames) {
      const { error } = await supabase
        .from('modalidades')
        .upsert({ nome }, { onConflict: 'nome', ignoreDuplicates: true });
      
      if (error) {
        console.error(`Erro ao inserir modalidade ${nome}:`, error);
        stats.modalidades.errors++;
      } else {
        stats.modalidades.inserted++;
      }
    }
    console.log(`Modalidades processadas: ${stats.modalidades.inserted}`);

    // ============= FASE 2: INSERIR POLOS =============
    console.log('Fase 2: Inserindo polos...');
    
    // Inserir em lotes de 100
    const batchSize = 100;
    for (let i = 0; i < POLOS_DATA.length; i += batchSize) {
      const batch = POLOS_DATA.slice(i, i + batchSize);
      const { error } = await supabase
        .from('polos')
        .upsert(batch, { onConflict: 'nome', ignoreDuplicates: true });
      
      if (error) {
        console.error(`Erro ao inserir lote de polos ${i}-${i + batchSize}:`, error);
        stats.polos.errors += batch.length;
      } else {
        stats.polos.inserted += batch.length;
      }
    }
    console.log(`Polos processados: ${stats.polos.inserted}`);

    // ============= FASE 3: INSERIR CURSOS =============
    console.log('Fase 3: Inserindo cursos...');
    
    // Coletar todos os cursos únicos
    const allCursos = new Set<string>();
    for (const cursos of Object.values(MODALIDADES_CURSOS)) {
      cursos.forEach(curso => allCursos.add(curso));
    }
    
    const cursosArray = Array.from(allCursos).map(nome => ({ nome }));
    
    // Inserir em lotes de 100
    for (let i = 0; i < cursosArray.length; i += batchSize) {
      const batch = cursosArray.slice(i, i + batchSize);
      const { error } = await supabase
        .from('cursos')
        .upsert(batch, { onConflict: 'nome', ignoreDuplicates: true });
      
      if (error) {
        console.error(`Erro ao inserir lote de cursos ${i}-${i + batchSize}:`, error);
        stats.cursos.errors += batch.length;
      } else {
        stats.cursos.inserted += batch.length;
      }
    }
    console.log(`Cursos processados: ${stats.cursos.inserted}`);

    // ============= FASE 4: CRIAR VÍNCULOS CURSO-MODALIDADE =============
    console.log('Fase 4: Criando vínculos curso-modalidade...');
    
    // Buscar IDs das modalidades
    const { data: modalidades } = await supabase
      .from('modalidades')
      .select('id, nome');
    
    const modalidadeMap = new Map(
      (modalidades || []).map(m => [m.nome, m.id])
    );
    
    // Buscar IDs dos cursos
    const { data: cursos } = await supabase
      .from('cursos')
      .select('id, nome');
    
    const cursoMap = new Map(
      (cursos || []).map(c => [c.nome, c.id])
    );
    
    // Criar vínculos
    const vinculos: { curso_id: string; modalidade_id: string }[] = [];
    
    for (const [modalidadeNome, cursoNames] of Object.entries(MODALIDADES_CURSOS)) {
      const modalidadeId = modalidadeMap.get(modalidadeNome);
      if (!modalidadeId) continue;
      
      for (const cursoNome of cursoNames) {
        const cursoId = cursoMap.get(cursoNome);
        if (!cursoId) continue;
        
        vinculos.push({
          curso_id: cursoId,
          modalidade_id: modalidadeId,
        });
      }
    }
    
    // Inserir vínculos em lotes
    for (let i = 0; i < vinculos.length; i += batchSize) {
      const batch = vinculos.slice(i, i + batchSize);
      const { error } = await supabase
        .from('curso_modalidades')
        .upsert(batch, { onConflict: 'curso_id,modalidade_id', ignoreDuplicates: true });
      
      if (error) {
        console.error(`Erro ao inserir lote de vínculos ${i}-${i + batchSize}:`, error);
        stats.vinculos.errors += batch.length;
      } else {
        stats.vinculos.inserted += batch.length;
      }
    }
    console.log(`Vínculos processados: ${stats.vinculos.inserted}`);

    // ============= RETORNAR RELATÓRIO =============
    const response = {
      success: true,
      message: 'Migração concluída com sucesso!',
      stats: {
        modalidades: stats.modalidades.inserted,
        polos: stats.polos.inserted,
        cursos: stats.cursos.inserted,
        vinculos: stats.vinculos.inserted,
      },
      errors: {
        modalidades: stats.modalidades.errors,
        polos: stats.polos.errors,
        cursos: stats.cursos.errors,
        vinculos: stats.vinculos.errors,
      },
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na migração:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
