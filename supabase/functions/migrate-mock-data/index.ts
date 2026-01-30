import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============= DADOS DOS POLOS (COMPLETO) =============
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
  { nome: "Destaque Colégio e Curso", telefone: "(83) 98832-0460" },
  { nome: "Multplick cursos", telefone: "(17) 99661-1012" },
  { nome: "DOMCURSOS EAD", telefone: "(92) 99234-3571" },
  { nome: "Institituto de Ensino e Tecnologia Aesj LTDA", telefone: "(86) 99591-3843" },
  { nome: "Tnc cursos Educacional", telefone: "(11) 93314-7420" },
  { nome: "EDUCACIONAL LOPES", telefone: "(73) 99945-7466" },
  { nome: "CENTRO DE FORMAÇÃO CONTINUADA, CONSULTORIA EDUCACIONAL LIMITADA", telefone: "(73) 99986-0476" },
  { nome: "contro c tecnologia", telefone: "(21) 98853-7611" },
  { nome: "Elevare Educação", telefone: "(88) 99293-6996" },
  { nome: "DIGITAL COMMERCE SOLUÇÕES EDUCACIONAIS LTDA", telefone: "(34) 99875-0102" },
  { nome: "ASSOCIAÇÃO SÃO GABRIEL", telefone: "(67) 4042-9154" },
  { nome: "Mac Instituto", telefone: "(47) 8446-5830" },
  { nome: "Instituto modelo", telefone: "(12) 98290-2749" },
  { nome: "MM TORRES FACULDADES EAD", telefone: "(83) 99970-1000" },
  { nome: "SONHAR CURSOS LTDA", telefone: "(91) 98851-1106" },
  { nome: "UniNorte Educacional", telefone: "(91) 98626-8842" },
  { nome: "Grupo Educacional Castelo Branco", telefone: "(61) 97402-6194" },
  { nome: "58.504.784 Carlos Eduardo dos Santos", telefone: "(21) 99762-3143" },
  { nome: "Única Mais", telefone: "(91) 98558-6738" },
  { nome: "Gislaine Rodrigues dos Santos", telefone: "(14) 99694-2403" },
  { nome: "Instituto Pérola de Responsabilidade Social", telefone: "(99) 98164-5197" },
  { nome: "46.624.251 GERCINO GARCIA SOBRINHO", telefone: "(69) 99937-6318" },
  { nome: "Thiago Pinheiro", telefone: "(97) 98803-7970" },
  { nome: "weelington educacao", telefone: "(35) 9867-4458" },
  { nome: "Eprem", telefone: "(13) 98196-3836" },
  { nome: "S&A ENSINO À DISTÂNCIA", telefone: "(19) 98769-3887" },
  { nome: "REPRESENTAÇÕES ATAIDE", telefone: "(11) 96324-0214" },
  { nome: "REDE DICLER - GRUPO INOV CONSULTORIA EMPRESARIAL", telefone: null },
  { nome: "REDE DICLER - LISBOA GESTÃO EDUCACIONAL LTDA", telefone: null },
  { nome: "REDE DICLER - IOLY EDUCACAO PARA TODOS", telefone: null },
  { nome: "REDE DICLER - ELISABETE BELTRAME", telefone: "(55) 99167-8664" },
  { nome: "REDE DICLER - CEI-CURSOS- CENTRO EDUCACIONAL IGARAPAVA", telefone: "(16) 99176-8598" },
  { nome: "SA Educacional", telefone: "(18) 99729-2947" },
  { nome: "CENTRO DE ESTUDO PARTICULAR APLICAR (CEPA)", telefone: "(32) 99172-2320" },
  { nome: "Saber São Paulo", telefone: "(11) 96723-1721" },
  { nome: "Satelis e Frezzarin", telefone: "(19) 98383-3152" },
  { nome: "SERVICO NACIONAL DE APRENDIZAGEM TECNICA E PROFISSIONALIZANTE DE VOTUPORANGA LTDA", telefone: "(17) 98158-4607" },
  { nome: "RD Ensino Online", telefone: "(18) 99799-8850" },
  { nome: "Simone Martins Lourenço Moretti", telefone: "(11) 99317-6466" },
  { nome: "RAFAEL SOUZA COELHO", telefone: "(11) 95860-8880" },
  { nome: "Sistema de Aprendizagem Corporativa e Executiva Ltda", telefone: "(11) 5198-6990" },
  { nome: "SOLUCIONAEDU ASSESSORIA EDUCACIONAL LTDA", telefone: "(11) 91013-7241" },
  { nome: "Sucevon", telefone: "(13) 99601-6049" },
  { nome: "Suliane Mariano Rocha LTDA", telefone: "(14) 99922-8926" },
  { nome: "T. S. de Souza Dias Ltda", telefone: "(11) 94908-0225" },
  { nome: "Torrez Cursos EAD", telefone: "(11) 97463-6519" },
  { nome: "UNG universidade de negócios globais", telefone: "(11) 91336-8895" },
  { nome: "Unieducação", telefone: "(19) 99214-5522" },
  { nome: "UniFIB", telefone: "(16) 99240-2248" },
  { nome: "unisena serviços educacionais", telefone: "(11) 91077-0547" },
  { nome: "UP Centro de Formação Educacional e Profissionalizante", telefone: "(19) 97417-2712" },
  { nome: "USSF UNIVERSIDADE SABEDORIA SEM FRONTEIRAS", telefone: "(11) 91474-3852" },
  { nome: "Viver Ead", telefone: "(11) 93099-1109" },
  { nome: "Vou Passei Cursos", telefone: "(11) 92007-4129" },
  { nome: "Rafael Alencar Queiroz", telefone: "(11) 97700-0049" },
  { nome: "Q-mais Educação", telefone: "(15) 99783-5007" },
  { nome: "R.J.Pereira Gestão", telefone: "(19) 98289-0000" },
  { nome: "Alexssander Thome de Souza", telefone: "(15) 99783-5007" },
  { nome: "55530667 Antônio Roberto de Almeida Junior", telefone: "(16) 99774-8174" },
  { nome: "Curso Profissionalizante Bragantino / Nova Biotec-POLO WILSON", telefone: "(11) 97250-2429" },
  { nome: "Instituto de Ensino EAP", telefone: "(91) 99395-2953" },
  { nome: "QualifiesPlus", telefone: "(11) 99565-5661" },
  { nome: "PSB Cursos EAD", telefone: "(11) 91530-7219" },
  { nome: "PROSPERARGROUP SERVICOS E NEGOCIOS LTDA", telefone: "(15) 98168-5655" },
  { nome: "Pronatec", telefone: "(11) 97200-5931" },
  { nome: "Professor Felipe Narvaes", telefone: "(55) 11981-6314" },
  { nome: "Primetime Palestras, Treinamentos E Editora Ltda", telefone: "(11) 98196-2110" },
  { nome: "Prepara Cursos Consultoria CLP Ltda", telefone: "(11) 94905-4661" },
  { nome: "Flavio de Macedo Sudario", telefone: "(11) 99907-4337" },
  { nome: "Pontello Cursos e Treinamentos", telefone: "(13) 99777-6125" },
  { nome: "ELITE EDUCAÇÃO ITAQUIRAI", telefone: "(67) 9985-0434" },
  { nome: "ECID", telefone: "(11) 93081-2525" },
  { nome: "WHOISAI EDUCATION LTDA", telefone: "(11) 94080-7686" },
  { nome: "WIND", telefone: null },
  { nome: "Polo São Vicente", telefone: "(13) 99629-5093" },
  { nome: "Polo Resgate", telefone: "(18) 3928-0622" },
  { nome: "SEGMED SST LTDA", telefone: "(79) 98803-0356" },
  { nome: "Polo parceiro La Educação", telefone: "(19) 99658-2977" },
  { nome: "Polo Osasco - Jardim Veloso", telefone: "(11) 99705-4688" },
  { nome: "Polo Itaqua de Educação", telefone: "(11) 94749-1079" },
  { nome: "Polo FETEC", telefone: "(11) 91667-0105" },
  { nome: "POLO EDUCAR GUARUJÁ", telefone: "(13) 97421-4338" },
  { nome: "Polo Educacional EAD - Pinda", telefone: "(12) 98209-5181" },
  { nome: "Pay4u administração Ltda", telefone: "(11) 94750-9680" },
  { nome: "PauliCargas Cursos Preparátórios e Consultoria Tecnica", telefone: "(19) 98303-6839" },
  { nome: "Paola Baldin Lourenço", telefone: "(11) 98250-4616" },
  { nome: "ORIENTE ENGENHARIA E SERVIÇOS DE SMS", telefone: "(11) 91202-7780" },
  { nome: "Nicks Academy", telefone: "(11) 98181-4610" },
  { nome: "MVL Cursos Livres", telefone: "(13) 99174-3468" },
  { nome: "Multipla EAD", telefone: "(11) 97073-9875" },
  { nome: "Moratocursostecnicos", telefone: "(11) 95197-4871" },
  { nome: "Carolina,Função:educação", telefone: "(11) 96068-7955" },
  { nome: "Polo Ronan Vanini", telefone: "(16) 97404-4747" },
  { nome: "VALE CURSOS EDUCACIONAL", telefone: "(12) 98815-0442" },
  { nome: "Polo Educacional La Educação", telefone: "(18) 99644-2364" },
  { nome: "Oris Educacional", telefone: "(11) 96081-3160" },
  { nome: "Bruno Crispim", telefone: "(15) 99767-0209" },
  { nome: "Mente Brilhante", telefone: "(14) 98176-8498" },
  { nome: "Lumani Maquina de Vendas", telefone: "(11) 97330-9575" },
  { nome: "PNP BRASIL - PROGRAMA NACIONAL PROFISSIONALIZANTE DO BRASIL LTDA", telefone: "(11) 91417-8624" },
  { nome: "H2FP CONSULTORIA E TREINAMENTOS LTDA", telefone: "(14) 98832-0122" },
  { nome: "RR TREINAMENTOS", telefone: "(48) 99200-1420" },
  { nome: "SAMUEL AUGUSTO", telefone: "(12) 99208-1353" },
  { nome: "CIEB - CENTRO INTEGRADO DE EDUCAÇÃO", telefone: "(11) 98501-7710" },
  { nome: "Iefer Educacional", telefone: "(17) 99717-3079" },
  { nome: "Tríade educação", telefone: "(61) 9957-9390" },
  { nome: "Loren Cursos", telefone: "(12) 98134-8469" },
  { nome: "Polo Cidade de Feliz", telefone: "(51) 99546-2803" },
  { nome: "Formação LA", telefone: "(96) 98808-8812" },
  { nome: "Gajewski Produtos e Serviços Ltda", telefone: "(11) 97543-6435" },
  { nome: "Esec-Educacional Superior Eclesiástico Ceiadebras", telefone: "(55) 1197239-3955" },
  { nome: "MS Educacional e Consultoria", telefone: "(11) 97024-3383" },
  { nome: "Ulysses Lago Alves", telefone: "(91) 98218-2006" },
  { nome: "Itiel cursos", telefone: "(11) 96839-8736" },
  { nome: "49.055.012 JONATHAN GUSTAVO DE SANTANA ALVES", telefone: "(43) 99639-1611" },
  { nome: "MDA Soluções Digitais LTDA", telefone: "(42) 9102-8158" },
  { nome: "Polo JULIANO SANTOS", telefone: "(41) 9918-6031" },
  { nome: "polo kylvia", telefone: null },
  { nome: "Peterson Carlos de Oliveira", telefone: "(43) 99647-3438" },
  { nome: "PAOLLA CASAGRANDE ULGUIM LTDA545-13", telefone: "(51) 2160-5808" },
  { nome: "polo ricardo", telefone: "(22) 98814-4532" },
  { nome: "POLO SOLUÇÕES EDUCACIONAIS", telefone: "(51) 99539-4151" },
  { nome: "MR EDUCACIONAL", telefone: "(51) 9337-8089" },
  { nome: "Polo Unidombosco", telefone: "(41) 98708-3446" },
  { nome: "MAURICIO KUCHLA ME", telefone: "(42) 99927-3270" },
  { nome: "Popbras Representções", telefone: "(47) 99606-6553" },
  { nome: "LA EDUCAÇÃO - POLO CURITIBA", telefone: "(41) 9564-8008" },
  { nome: "Portal do Saber", telefone: "(54) 99704-3241" },
  { nome: "Primazia Gestão de Cursos Preparatórios", telefone: "(47) 8857-2204" },
  { nome: "Joao bosco tavares", telefone: "(92) 98600-7978" },
  { nome: "Instituto Técnico Nacional", telefone: null },
  { nome: "PROPULSOR EDUCACIONAL", telefone: "(55) 44881-3766" },
  { nome: "RC Educacional", telefone: "(47) 99154-0971" },
  { nome: "ELEVA CURSOS EAD", telefone: "(41) 99803-4043" },
  { nome: "Mestre EAD Educação", telefone: "(14) 99832-3999" },
  { nome: "Mazetti & Valini", telefone: "(22) 32017-6802" },
  { nome: "Manoel Gualberto bezerra Candido", telefone: "(11) 98637-2933" },
  { nome: "MaisEduTec - Educação e Tecnologia", telefone: "(11) 93304-3186" },
  { nome: "Lions Idiomas- POLO WILSON", telefone: null },
  { nome: "Leonardo Guaicuru Sanches", telefone: null },
  { nome: "LA EDUCAÇÃO - SÃO PAULO", telefone: "(11) 99129-2154" },
  { nome: "Jutale Personality training", telefone: "(11) 93905-3913" },
  { nome: "Jonatas Allan Marim", telefone: "(11) 94903-5370" },
  { nome: "Jeniffer Hellen Barros Pimentel", telefone: null },
  { nome: "Instituto Teológico Daniel Berg.", telefone: "(16) 99187-6103" },
  { nome: "Instituto Sucessus Cursos e Treinamentos LTDA", telefone: "(11) 98256-3038" },
  { nome: "Instituto Educacional JPS Solução", telefone: null },
  { nome: "Instituto Dra. Bruna Valencio", telefone: null },
  { nome: "Instituto do Trabalhador", telefone: null },
  { nome: "instituto de ensino ead", telefone: "(11) 99993-1019" },
  { nome: "Daciana", telefone: null },
  { nome: "Robson Rodrigues Negócios Me", telefone: "(51) 99603-6339" },
  { nome: "ROUTSEG", telefone: "(51) 9802-8586" },
  { nome: "Sem nome ainda", telefone: null },
  { nome: "Seven Intelligence", telefone: "(51) 8130-3834" },
  { nome: "Imobiliária marechal", telefone: "(11) 96953-7631" },
  { nome: "Silvio de Melo Almeida", telefone: "(41) 98741-0858" },
  { nome: "IAD Instituto Antônio Diogo", telefone: "(19) 98934-9095" },
  { nome: "Sindicato dos Servidores do Município de Concórdia e Região - SSMCR", telefone: "(49) 9907-0000" },
  { nome: "Henrique da Silva Corrêa", telefone: "(17) 99264-6060" },
  { nome: "STAND CONSULTORIA- POLO wILSON", telefone: null },
  { nome: "GUAIRA FIRE BOMBEIROS", telefone: "(17) 99972-0698" },
  { nome: "GS Educacional", telefone: "(18) 99116-9863" },
  { nome: "Gatti Cell Tecnologia Comunicação e Marketing", telefone: "(11) 2449-6731" },
  { nome: "G12 Educacional", telefone: "(11) 99833-5934" },
  { nome: "Focat", telefone: "(11) 97320-3808" },
  { nome: "FISIOREATIVA CENTRO INTEGRADO DE SAUDE INTEGRATIVA LTDA", telefone: "(19) 98859-0170" },
  { nome: "thiago polo", telefone: "(12) 97850-6113" },
  { nome: "Tutor Rodrigues Cursos", telefone: "(48) 99972-7451" },
  { nome: "FACULDADE EAD CENTER", telefone: "(11) 98376-8016" },
  { nome: "U.A.P. Almirante Tamandaré", telefone: "(41) 99801-0626" },
  { nome: "Faculdade de Ensino Setaad", telefone: "(19) 98368-9846" },
  { nome: "UFEM", telefone: "(45) 99927-1036" },
  { nome: "Unidifranco", telefone: "(51) 99011-1111" },
  { nome: "Uniensinos", telefone: "(47) 99905-1219" },
  { nome: "Universo Negócios e Serviços Empresariais Ltda", telefone: "(55) 99608-7696" },
  { nome: "Upper Cursos Virtual", telefone: "(45) 99118-3302" },
  { nome: "VAGNER HILDO MARQUES", telefone: "(47) 99780-5843" },
  { nome: "Vai no Schmidt", telefone: "(47) 98414-4486" },
  { nome: "WESLEY SOUSA CASTRO", telefone: null },
  { nome: "WGS socursos", telefone: "(53) 99241-3354" },
  { nome: "Yoo cursos", telefone: "(47) 99674-5743" },
  { nome: "CEE EDUCACIONAL", telefone: null },
  { nome: "Gabi", telefone: "(42) 99109-9207" },
  { nome: "RRX SERVIÇOS DE APOIO A ADM. LTDA", telefone: "(53) 98126-4730" },
  { nome: "Inovaçao", telefone: "(51) 99236-1146" },
  { nome: "L A EDUCAÇÃO CAPÃO DA CANOA", telefone: "(51) 98058-1841" },
  { nome: "Instituto de desenvolvimento profissional Maria umbelina drekener dos Santos", telefone: "(55) 9689-3645" },
  { nome: "Grupo Vittal de ensino", telefone: "(51) 99676-1384" },
  { nome: "Tim Professor Escola de Formação", telefone: "(31) 98554-3147" },
  { nome: "Angelina", telefone: "(93) 99182-7479" },
  { nome: "Educasul escola de profissões", telefone: "(47) 98468-8870" },
  { nome: "50 786 195 Matheus Felipe Ferreira Costa", telefone: "(33) 99822-9545" },
  { nome: "Espaço Curiosa", telefone: "(64) 9973-6171" },
  { nome: "AGUILAR FORMACAO PROFISSIONAL EIRELI - ME", telefone: "(21) 98225-5508" },
  { nome: "Pro Ensino", telefone: "(65) 98115-4068" },
  { nome: "AM Producoes Digitais", telefone: "(27) 99811-3073" },
  { nome: "EDUARDO HENRIQUE DA SILVA MARQUES", telefone: "(67) 99235-2136" },
  { nome: "APROVE CONSULTORIA EDUCACIONAL- POLO WILSON", telefone: null },
  { nome: "ASSOCIAÇÃO ACADEMICA CAMINHO DO SABER", telefone: "(22) 99601-2314" },
  { nome: "Omni Educa", telefone: "(61) 98448-4554" },
  { nome: "DIALEKTOS EDUCACIONAL", telefone: "(21) 96909-0010" },
  { nome: "Viva Melhor ead", telefone: "(61) 99905-4890" },
  { nome: "Unidiversum", telefone: "(61) 99966-5014" },
  { nome: "Unicv cpa 2", telefone: "(65) 99808-5570" },
  { nome: "Brain cursos e especializações", telefone: "(27) 99643-0294" },
  { nome: "Bruna", telefone: "(31) 98943-8020" },
  { nome: "CAPITAL INTEGRA - ALPHA DUO- polo Wilson", telefone: null },
  { nome: "PROFISSIONALIZA", telefone: "(93) 9177-7527" },
  { nome: "EPMVet", telefone: null },
  { nome: "FAMMA EDUCACIONAL LTDA", telefone: "(67) 9650-0404" },
  { nome: "CJF educacional", telefone: "(49) 98815-0350" },
  { nome: "CASTELLO LARANJA EDUCACIONAL", telefone: "(35) 99144-5364" },
  { nome: "CCPI- CENTRO DE CAPACITAÇÃO PROFISSIONAL INTERMEDIUM", telefone: "(21) 96773-0799" },
  { nome: "Cecave", telefone: "(27) 98848-5391" },
  { nome: "CENTRO BRASIL DE ENSINO CBE", telefone: "(34) 9175-8766" },
  { nome: "Centro de Educação Rio de Janeiro", telefone: "(21) 99323-4118" },
  { nome: "CENTRO EDUCA NEXT", telefone: "(22) 99945-5324" },
  { nome: "CENTRO EDUCACIONAL DIGITAL", telefone: "(34) 8817-1452" },
  { nome: "Centro Pedagógico Avançado de Minas Gerais", telefone: "(35) 98704-7686" },
  { nome: "CEPEAD Centro Educacional", telefone: "(21) 97390-1117" },
  { nome: "Cetelun", telefone: "(28) 99968-6438" },
  { nome: "CAD Cursos a Distância", telefone: "(21) 99275-7928" },
  { nome: "CURSO PREPARATÓRIO ESTUDANDO POR QUESTÕES", telefone: "(21) 97980-0766" },
  { nome: "Cursos Atlas", telefone: "(55) 2799921-8784" },
  { nome: "CURSOS WF", telefone: "(21) 98826-1232" },
  { nome: "Método Ensino", telefone: "(16) 99727-7610" },
  { nome: "cursosead.iadominio.com.br", telefone: "(34) 93300-5125" },
  { nome: "meritocursos.com.br", telefone: "(31) 8383-7611" },
  { nome: "DIEGO ELIAS PEREIRA", telefone: "(31) 99647-2176" },
  { nome: "EAD Dinâmico", telefone: "(21) 98399-9788" },
  { nome: "EAD PARA VOCÊ", telefone: "(31) 99920-2548" },
  { nome: "EBN Treinamentos", telefone: "(21) 97599-5743" },
  { nome: "Edu casaluci ltda", telefone: "(21) 98982-5796" },
  { nome: "EducaGlobal", telefone: "(32) 9141-0399" },
  { nome: "educarcursos.com.br", telefone: "(38) 98805-6833" },
  { nome: "Eduk Novo Ensino", telefone: "(32) 99106-8326" },
  { nome: "Elite educacional", telefone: "(21) 97221-7845" },
  { nome: "Eliza Dantas", telefone: "(21) 99264-9058" },
  { nome: "Escolha Certa Educação Profissional Ltda", telefone: "(34) 99885-0059" },
  { nome: "Marcelo Raymundo", telefone: "(12) 97409-0998" },
  { nome: "Fagedi", telefone: "(47) 99774-9300" },
  { nome: "Instituto Bits", telefone: "(92) 9303-5791" },
  { nome: "Estante Digital", telefone: "(27) 99803-0769" },
  { nome: "Eu Conectado Educação Profissionalizante", telefone: "(21) 98772-1339" },
  { nome: "EU QUERO TER 1 MILHÃO DE AMIGOS", telefone: "(21) 96552-1712" },
  { nome: "Evidência em Educação e Saúde", telefone: "(22) 99224-5714" },
  { nome: "Fa Perfect Educacional", telefone: "(21) 96604-2250" },
  { nome: "Faculdade e Instituto Nova", telefone: "(28) 99924-3409" },
  { nome: "UNIVERSIDADE EDUCA BRASIL LTDA", telefone: "(35) 99131-5122" },
  { nome: "virtual grupo Lá", telefone: "(11) 95600-2682" },
  { nome: "Polo fênix", telefone: "(11) 99987-8787" },
  { nome: "Jucilene Evaristo", telefone: "(15) 99126-2211" },
  { nome: "NATURAL BANK PAGAMENTOS LTDA", telefone: "(12) 97401-5031" },
  { nome: "JONATHAN OLIVEIRA CARVALHO ME", telefone: "(55) 14981-0304" },
  { nome: "Instituto Educ.: Transbordo", telefone: "(11) 96504-0370" },
  { nome: "Lions tec", telefone: "(21) 98258-8591" },
  { nome: "ILSEAD", telefone: "(11) 95996-3677" },
  { nome: "FACULDADE FACTEFERJ", telefone: "(21) 98136-6461" },
  { nome: "Faculdade Popular", telefone: "(31) 99135-8854" },
  { nome: "FACULTECH", telefone: "(34) 99976-0667" },
  { nome: "FACUVALE - FACULDADE DOS VALES EAD LTDA", telefone: "(31) 99261-6575" },
  { nome: "Fatcontagem", telefone: "(31) 99906-0371" },
  { nome: "Fênix EAD Educação & Negócios", telefone: null },
  { nome: "Ferreira Hub Educaciona", telefone: null },
  { nome: "G8 Soluções Integradas em SMS", telefone: "(22) 99764-8814" },
  { nome: "Genius ead", telefone: "(21) 97187-9862" },
  { nome: "Grupo Cadê Marcas", telefone: null },
  { nome: "GRUPO MS - RIO DAS PSTRAS", telefone: "(22) 99242-7758" },
  { nome: "Honorato cursos", telefone: "(34) 98878-7368" },
  { nome: "IBSE Educação e Tecnologia", telefone: "(22) 99929-1728" },
  { nome: "IFS CursoUp", telefone: null },
  { nome: "INOVAEDU", telefone: "(27) 98122-3395" },
  { nome: "Instituto Abraça-me", telefone: "(31) 98237-1114" },
];

// ============= DADOS DAS MODALIDADES E CURSOS (COMPLETO do mock) =============
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
    "EDUCAÇÃO, HISTÓRIA, CULTURA E PRÁTICAS INDÍGENAS I",
    "EDUCAÇÃO, HISTÓRIA, CULTURA E PRÁTICAS INDÍGENAS II",
    "ENSINO EM AMBIENTE NATURAL (NET)",
    "ESCOLA E COMUNIDADE",
    "ESPIRITUALIDADE E SOCIEDADE",
    "ESTRATÉGIA PEDAGÓGICA: A IMPORTÂNCIA DA INTERAÇÃO NO ESPAÇO ESCOLAR",
    "ESTRATÉGIAS PEDAGÓGICAS E INTERAÇÃO NO ESPAÇO ESCOLAR",
    "ESTUDOS GEOGRÁFICOS",
    "FACILITANDO O ENSINO DA CIÊNCIA",
    "FACILITANDO O ENSINO DA MATEMÁTICA",
    "FILOSOFIA DAS ARTES E ESTÉTICA",
    "FISIOLOGIA DO EXERCÍCIO E AVALIAÇÃO POSTURAL",
    "FORMAÇÃO E ATUAÇÃO DO INTÉRPRETE DE LIBRAS",
    "GESTÃO ADMINISTRATIVA E FINANCEIRA DA ESCOLA",
    "GESTÃO DO PPP",
    "GESTÃO EDUCACIONAL, PLANEJAMENTO E CURRÍCULO",
    "GESTÃO ESCOLAR",
    "GRAMÁTICA DA LÍNGUA INGLESA",
    "HISTORICIDADE DA LÍNGUA BRASILEIRA DE SINAIS (LIBRAS)",
    "HISTÓRIA ANTIGA E MEDIEVAL",
    "HISTÓRIA BRASILEIRA",
    "HISTÓRIA DA ARTE: DA PRÉ-HISTÓRIA À ARTE CONTEMPORÂNEA",
    "HISTÓRIA DA EDUCAÇÃO DE JOVENS E ADULTOS",
    "HISTÓRIA DA EDUCAÇÃO ESCOLAR",
    "HISTÓRIA DA EDUCAÇÃO ESPECIAL E INCLUSIVA NO BRASIL",
    "HISTÓRIA DA FILOSOFIA MODERNA",
    "HISTÓRIA MODERNA E CONTEMPORÂNEA",
    "HISTÓRIA MUNDIAL",
    "INCLUSÃO SOCIOEDUCACIONAL",
    "INTÉRPRETE DE LIBRAS EM SALA DE AULA",
    "JOGOS E BRINCADEIRAS EDUCACIONAIS",
    "JOGOS E RECREAÇÃO",
    "LINGUAGEM DAS ARTES PLÁSTICAS",
    "LINGUAGENS EM ARTETERAPIA",
    "LINGUÍSTICA DA LÍNGUA INGLESA",
    "LINGUÍSTICA DA LÍNGUA PORTUGUESA",
    "LITERATURA INGLESA",
    "LOGÍSTICA DE PESSOAL",
    "LUDICIDADE EDUCAÇÃO",
    "LUDOPEDAGOGIA",
    "METODOLOGIA DO ENSINO DA MATEMÁTICA",
    "METODOLOGIA DO ENSINO DE ARTES",
    "MODELO EDUCACIONAL HÍBRIDO",
    "MORFOLOGIA DA LÍNGUA PORTUGUESA",
    "MÚSICA E O DESENVOLVIMENTO DA CRIANÇA",
    "NEUROEDUCAÇÃO",
    "NEUROLOGIA DO DESENVOLVIMENTO",
    "NEUROPEDAGOGIA",
    "NEUROPSICOPEDAGOGIA",
    "NOVAS TECNOLOGIAS E TENDÊNCIAS",
    "PARADIGMA DA INCLUSÃO",
    "ORGANIZAÇÃO DO ENSINO DA LÍNGUA PORTUGUESA",
    "ORTOGRAFIA E PRONÚNCIA DA LÍNGUA INGLESA",
    "PEDAGOGIA DE PROJETOS",
    "PEDAGOGIA EMPRESARIAL",
    "EPLANEJAMENTO EDUCACIONAL NA EDUCAÇÃO DE JOVENS E ADULTOS",
    "POLÍTICAS EDUCACIONAIS E GESTÃO ESCOLAR",
    "POLÍTICAS PÚBLICAS NA EDUCAÇÃO",
    "EPREVENÇÃO E COMBATE A INCÊNDIO",
    "PROCESSOS DE ENSINO E APRENDIZAGEM",
    "PRÁTICAS EDUCATIVAS COLABORATIVAS",
    "EPRÁTICAS EDUCATIVAS NA EDUCAÇÃO INFANTIL",
    "PRÁTICAS PEDAGÓGICAS",
    "PSICOLOGIA DA APRENDIZAGEM E DO DESENVOLVIMENTO",
    "PSICOLOGIA DA EDUCAÇÃO",
    "PSICOLOGIA EDUCACIONAL",
    "PSICOMOTRICIDADE",
    "PSICOMOTRICIDADE E LINGUAGEM NA ALFABETIZAÇÃO",
    "PSICOMOTRICIDADE E LUDOPEDAGOGIA",
    "PSICOMOTRICIDADE E LUDOTERAPIA",
    "PSICOMOTRICIDADE NA EDUCAÇÃO ESPECIAL",
    "PSICOPEDAGOGIA INSTITUCIONAL",
    "ROTINA DE TRABALHO NA EDUCAÇÃO INFANTIL",
    "SUPERVISÃO E ORIENTAÇÃO PEDAGÓGICA",
    "SUPERVISÃO ESCOLAR",
    "SUPERVISÃO ESCOLAR COM ÊNFASE EM EDUCAÇÃO INCLUSIVA",
    "TEA: CONTEXTO E INCLUSÃO",
    "TECNOLOGIAS E APRENDIZADO",
    "TRANSTORNO DO ESPECTRO AUTISTA",
    "ENSINO NA EDUCAÇÃO INFANTIL",
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
    "TECNÓLOGO EM GESTÃO DE RECURSOS HUMANOS - 12M",
    "TECNÓLOGO EM LOGÍSTICA",
    "TECNÓLOGO EM LOGÍSTICA - 12M",
    "TECNÓLOGO EM MARKETING",
    "TECNÓLOGO EM MARKETING - 12 M",
    "TECNÓLOGO EM PROCESSOS GERENCIAIS",
    "TECNÓLOGO EM PROCESSOS GERENCIAIS - 12M",
    "TECNÓLOGO EM SEGURANÇA PÚBLICA - 12M",
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
    "CIÊNCIAS SOCIAIS",
    "EDUCAÇÃO ESPECIAL",
    "EDUCAÇÃO FÍSICA",
    "FILOSOFIA",
    "FÍSICA",
    "GEOGRAFIA",
    "INGLÊS",
    "LETRAS EM PORTUGUÊS/INGLÊS",
    "LETRAS LÍNGUA PORTUGUESA",
    "LETRAS PORTUGUÊS/ESPANHOL",
    "LIBRAS",
    "MÚSICA",
    "PEDAGOGIA",
    "QUÍMICA",
    "EDUCAÇÃO ESPECIAL - FM",
    "HISTÓRIA",
    "LETRAS (PORTUGUÊS/LIBRAS)",
    "LETRAS PORTUGUÊS / INGLÊS",
    "MATEMÁTICA",
    "SOCIOLOGIA",
  ],
  "Superior Sequencial": [
    "GESTÃO EM TEOLOGIA",
    "ALFABETIZAÇÃO E LETRAMENTO",
    "ANÁLISES DE DADOS",
    "CADEIA DE SUPPLY CHAIN",
    "EDUCAÇÃO ESPECIAL",
    "FORMAÇÃO DOCENTE PARA EAD",
    "GESTÃO AMBIENTAL",
    "GESTÃO COMERCIAL E VENDAS",
    "GESTÃO DA AUDITORIA",
    "GESTÃO DA PRODUÇÃO",
    "GESTÃO DE EMPRESAS",
    "GESTÃO DE LOGÍSTICA",
    "GESTÃO DE OBRAS CIVIS",
    "GESTÃO DE PESSOAS",
    "GESTÃO DE PESSOAS E COACHING",
    "GESTÃO DE PROJETOS",
    "GESTÃO E LIDERANÇA",
    "GESTÃO EDUCACIONAL E PEDAGÓGICA",
    "GESTÃO EM CONTABILIDADE",
    "GESTÃO EM MARKETING",
    "GESTÃO EM RECURSOS HUMANOS",
    "GESTÃO EM SAÚDE",
    "GESTÃO EM TRÂNSITO",
    "GESTÃO ESCOLAR",
    "GESTÃO FINANCEIRA",
    "GESTÃO HOSPITALAR",
    "GESTÃO PÚBLICA",
    "GESTÃO SEGURANÇA PÚBLICA E PRIVADA",
    "NEUROEDUCAÇÃO",
    "RECUPERAÇÃO DE DADOS",
    "SEGURANÇA PÚBLICA E PRIVADA",
    "TECNOLOGIA DA INFORMAÇÃO",
    "TRANSTORNO DO ESPECTRO AUTISTA",
  ],
  "Aproveitamento/Competência": [
    "TÉCNICO EM AGRIMENSURA",
    "TÉCNICO EM MARKETING",
    "TÉCNICO EM MECÂNICA",
    "TÉCNICO EM MEIO AMBIENTE",
    "TÉCNICO EM TTI",
    "TÉCNICO EM AGENTE COMUNITÁRIO DE SAÚDE",
    "TÉCNICO EM ANÁLISE CLÍNICA",
    "TÉCNICO EM CONTABILIDADE",
    "TÉCNICO EM EDIFICAÇÕES",
    "TÉCNICO EM ELETRÔNICA",
    "TÉCNICO EM ESTÉTICA",
    "TÉCNICO EM LOGÍSTICA",
    "TÉCNICO EM MECATRÔNICA",
    "TÉCNICO EM NUTRIÇÃO",
    "TÉCNICO EM VETERINÁRIA",
    "TÉCNICO EM RECURSOS HUMANOS",
    "TÉCNICO EM DESENVOLVIMENTO DE SISTEMAS",
    "TÉCNICO EM ENERGIAS RENOVÁVEL",
    "TÉCNICO EM QUALIDADE",
    "TÉCNICO EM SECRETARIADO",
    "TÉCNICO EM ADMINISTRAÇÃO",
    "TÉCNICO EM AUTOMAÇÃO",
    "TÉCNICO EM AUTOMAÇÃO INDUSTRIAL",
    "TÉCNICO EM CONSTRUÇÃO NAVAL",
    "TÉCNICO EM CUIDADOR DE IDOSO",
    "TÉCNICO EM ELETROTÉCNICA",
    "TÉCNICO EM ESP. EM GEORREFERENCIAMENTO",
    "TÉCNICO EM FABRICAÇÃO MECÂNICA",
    "TÉCNICO EM INSPETOR DE EQUIPAMENTOS",
    "TÉCNICO EM INSPETOR DE SOLDAGEM",
    "TÉCNICO EM INSTRUMENTAÇÃO INDUSTRIAL",
    "TÉCNICO EM MECÂNICA INDUSTRIAL",
    "TÉCNICO EM METALURGIA",
    "TÉCNICO EM PETRÓLEO E GÁS",
    "TÉCNICO EM QUÍMICA",
    "TÉCNICO EM SECRETARIA ESCOLAR",
    "TÉCNICO EM SEGURANÇA DO TRABALHO",
    "TÉCNICO EM TURISMO",
    "TÉCNICO EM PAPEL E CELULOSE",
    "TÉCNICO EM COMPETÊNCIA EM ELETRÔNICA",
    "TÉCNICO EM REFRIGERAÇÃO E CLIMATIZAÇÃO",
    "TÉCNICO EM TRANSAÇÃO IMOBILIÁRIA",
    "TÈCNICO EM ELETROMECÂNICA",
    "TÉCNICO EM INFORMÁTICA",
    "TÉCNICO EM TELECOMUNICAÇÕES",
    "TÉCNICO EM FARMÁCIA",
    "TÉCNICO EM AGRICULTURA",
    "TÉCNICO EM AGROPECUÁRIA",
    "TÉCNICO EM RADIOLOGIA",
    "TÉCNICO EM NUTRIÇÃO E DIETÉTICA",
    "TÉCNICO EM SAÚDE BUCAL",
    "TÉCNICO EM ÓPTICA",
    "TÉCNICO EM SERVIÇOS JURÍDICOS",
    "TÉCNICO EM VENDAS",
    "TÉCNICO EM DESIGN GRÁFICO",
    "TÉCNICO EM REDES DE COMPUTADORES",
    "TÉCNICO EM SISTEMAS DE ENERGIA RENOVÁVEL",
    "TÉCNICO EM MANUTENÇÃO DE MÁQUINAS INDUSTRIAIS",
    "TÉCNICO EM SOLDAGEM",
    "TÉCNICO EM PREVENÇÃO E COMBATE AO INCÊNDIO",
    "TÉCNICO EM AGROINDÚSTRIA",
    "TÉCNICO EM GASTRONOMIA",
    "TÉCNICO EM ENFERMAGEM",
    "TÉCNICO EM Mineração",
    "Eletroeletrônica",
  ],
  "EJA": [
    "EJA - EDUCAÇÃO DE JOVENS E ADULTOS",
    "EJA - EDUCAÇÃO DE JOVENS E ADULTOS 2.0",
    "EJA - EDUCAÇÃO DE JOVENS E ADULTOS - D.O",
    "EJA - EDUCAÇÃO DE JOVENS E ADULTOS - V2",
    "EJA - EDUCAÇÃO DE JOVENS E ADULTOS 2.0 - D.O",
    "EJA - FUNDAMENTAL",
    "EJA - EDUCAÇÃO DE JOVENS E ADULTOS - MG",
    "EJA - EDUCAÇÃO DE JOVENS E ADULTOS 2.0 - MG",
  ],
  "Técnico regular": [
    "TÉCNICO EM ADMINISTRAÇÃO",
    "TÉCNICO EM AGRICULTURA",
    "TÉCNICO EM AGROPECUÁRIA",
    "TÉCNICO EM ANÁLISES CLÍNICAS",
    "TÉCNICO EM COMPLIANCE",
    "TÉCNICO EM CRIPTOMOEDAS",
    "TÉCNICO EM CUIDADOR DE IDOSOS",
    "TÉCNICO EM ELETROELETRÔNICA",
    "TÉCNICO EM ELETROMECÂNICA",
    "TÉCNICO EM ELETROTÉCNICA",
    "TÉCNICO EM ELETRÔNICA",
    "TÉCNICO EM ESTÉTICA",
    "TÉCNICO EM FARMÁCIA",
    "TÉCNICO EM FINANÇAS",
    "TÉCNICO EM GUIA DE TURISMO",
    "TÉCNICO EM INFORMÁTICA",
    "TÉCNICO EM INTELIGÊNCIA ARTIFICIAL",
    "TÉCNICO EM LOGÍSTICA",
    "TÉCNICO EM MECÂNICA",
    "TÉCNICO EM MEIO AMBIENTE",
    "TÉCNICO EM MINERAÇÃO",
    "TÉCNICO EM PAPEL E CELULOSE",
    "TÉCNICO EM REFRIGERAÇÃO E CLIMATIZAÇÃO",
    "TÉCNICO EM SECRETARIA ESCOLAR",
    "TÉCNICO EM SEGURANÇA DO TRABALHO",
    "TÉCNICO EM TELECOMUNICAÇÕES",
    "TÉCNICO EM TEOLOGIA",
    "TÉCNICO EM TRANSAÇÕES IMOBILIÁRIAS",
    "TÉCNICO EM TRANSAÇÕES TRADER",
    "TÉCNICO EM VETERINÁRIA",
    "TÉCNICO EM QUÍMICA",
    "TÉCNICO EM AGENTE COMUNITÁRIO DE SAÚDE",
    "TÉCNICO EM AGRIMENSURA",
    "TÉCNICO EM AGROINDÚSTRIA",
    "TÉCNICO EM AGRONEGÓCIOS",
    "TÉCNICO EM AUTOMAÇÃO INDUSTRIAL",
    "TÉCNICO EM COMPUTAÇÃO GRÁFICA",
    "TÉCNICO EM CONTABILIDADE",
    "TÉCNICO EM DESIGN GRÁFICO",
    "TÉCNICO EM DESENVOLVIMENTO DE SISTEMAS",
    "TÉCNICO EM EDIFICAÇÕES",
    "TÉCNICO EM GASTRONOMIA",
    "TÉCNICO EM MANUTENÇÃO AUTOMOTIVA",
    "TÉCNICO EM MANUTENÇÃO DE MÁQUINAS INDUSTRIAIS",
    "TÉCNICO EM MARKETING",
    "TÉCNICO EM METALURGIA",
    "TÉCNICO EM NUTRIÇÃO E DIETÉTICA",
    "TÉCNICO EM OPTOMETRIA",
    "TÉCNICO EM PETRÓLEO E GÁS",
    "TÉCNICO EM PODOLOGIA",
    "TÉCNICO EM PRÓTESE DENTÁRIA",
    "TÉCNICO EM QUALIDADE",
    "TÉCNICO EM REDES DE COMPUTADORES",
    "TÉCNICO EM SAÚDE BUCAL",
    "TÉCNICO EM SERVIÇOS JURÍDICOS",
    "TÉCNICO EM SISTEMAS DE ENERGIA RENOVÁVEL",
    "TÉCNICO EM VENDAS",
    "TÉCNICO EM RECURSOS HUMANOS",
    "MECATRÓNICA",
  ],
  "Profissionalizante Avançado": [
    "ADMINISTRAÇÃO PARA MICRO E MÉDIAS EMPRESAS",
    "AROMATERAPIA",
    "AUDITORIA EM ENFERMAGEM",
    "AUTISMO",
    "AUXILIAR DE CONTABILIDADE",
    "LEGISLAÇÃO DA EDUCAÇÃO E LDB",
    "CUIDADOR DE IDOSOS",
    "GESTÃO DE RECURSOS HUMANOS",
    "AUXILIAR DE ENFERMAGEM AVANÇADO",
    "GESTÃO BANCÁRIA",
    "INTELIGÊNCIA ARTIFICIAL",
    "MARKETING DIGITAL",
    "ENFERMAGEM DO TRABALHO",
    "GESTÃO EM FINANÇAS NO SISTEMA",
    "MASSAGENS CORPORAIS E FACIAIS",
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
    "CÁLCULOS TRABALHISTAS",
    "ENERGIA SOLAR FOTOVOLTAICA",
    "FARMÁCIA HOSPITALAR",
    "GESTÃO DA PRODUÇÃO",
    "HIGIENE OCUPACIONAL",
    "INFORMAÇÃO E DOCUMENTAÇÃO ESCOLAR",
    "MANIPULAÇÃO EM LABORATÓRIO DE FARMÁCIA",
    "MÍDIAS DIGITAIS",
    "ONCOLOGIA",
    "PREVENÇÃO E COMBATE A INCÊNDIOS",
    "PROGRAMAS DE QUALIDADE NA CONSTRUÇÃO CIVIL",
    "REDAÇÃO DE CONTRATOS",
    "SAÚDE DO TRABALHADOR",
    "SAÚDE PÚBLICA",
    "SEGURANÇA ALIMENTAR E NUTRICIONAL",
    "SEGURANÇA DO TRABALHO NA CONSTRUÇÃO CIVIL",
    "TERAPIA INTENSIVA",
    "TREINAMENTO E DESENVOLVIMENTO",
    "URGÊNCIA E EMERGÊNCIA/APH",
    "ERGONOMIA",
    "SECRETARIA ESCOLAR",
    "GEORREFERENCIAMENTO, GEOPROCESSAMENTO E SENSORIAMENTO REMOTO",
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
};

// Tipos para controle de progresso
interface MigrationRequest {
  phase?: 'modalidades' | 'polos' | 'cursos' | 'vinculos';
  offset?: number;
  batchSize?: number;
}

interface MigrationResponse {
  success: boolean;
  phase: string;
  processed: number;
  total: number;
  hasMore: boolean;
  nextOffset: number;
  message: string;
  stats: {
    inserted: number;
    errors: number;
  };
}

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

    // Parse request body
    let body: MigrationRequest = {};
    try {
      body = await req.json();
    } catch {
      // Body vazio ou inválido - usar defaults
    }

    const phase = body.phase || 'modalidades';
    const offset = body.offset || 0;
    const batchSize = body.batchSize || 100;

    // Criar cliente Supabase com service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let response: MigrationResponse;

    switch (phase) {
      case 'modalidades': {
        const modalidadeNames = Object.keys(MODALIDADES_CURSOS);
        const batch = modalidadeNames.slice(offset, offset + batchSize);
        let inserted = 0;
        let errors = 0;

        for (const nome of batch) {
          const { error } = await supabase
            .from('modalidades')
            .upsert({ nome }, { onConflict: 'nome', ignoreDuplicates: true });
          
          if (error) {
            console.error(`Erro ao inserir modalidade ${nome}:`, error);
            errors++;
          } else {
            inserted++;
          }
        }

        const hasMore = offset + batchSize < modalidadeNames.length;
        response = {
          success: true,
          phase: 'modalidades',
          processed: batch.length,
          total: modalidadeNames.length,
          hasMore: hasMore,
          nextOffset: hasMore ? offset + batchSize : 0,
          message: hasMore 
            ? `Modalidades: ${offset + batch.length}/${modalidadeNames.length} processadas`
            : `Modalidades concluídas! Total: ${modalidadeNames.length}`,
          stats: { inserted, errors }
        };
        break;
      }

      case 'polos': {
        const batch = POLOS_DATA.slice(offset, offset + batchSize);
        let inserted = 0;
        let errors = 0;

        // Inserir em lote
        const { error } = await supabase
          .from('polos')
          .upsert(batch, { onConflict: 'nome', ignoreDuplicates: true });
        
        if (error) {
          console.error('Erro ao inserir polos:', error);
          errors = batch.length;
        } else {
          inserted = batch.length;
        }

        const hasMore = offset + batchSize < POLOS_DATA.length;
        response = {
          success: true,
          phase: 'polos',
          processed: batch.length,
          total: POLOS_DATA.length,
          hasMore: hasMore,
          nextOffset: hasMore ? offset + batchSize : 0,
          message: hasMore 
            ? `Polos: ${offset + batch.length}/${POLOS_DATA.length} processados`
            : `Polos concluídos! Total: ${POLOS_DATA.length}`,
          stats: { inserted, errors }
        };
        break;
      }

      case 'cursos': {
        // Coletar todos os cursos únicos
        const allCursos = new Set<string>();
        for (const cursos of Object.values(MODALIDADES_CURSOS)) {
          for (const curso of cursos) {
            allCursos.add(curso);
          }
        }
        const cursosArray = Array.from(allCursos);
        
        const batch = cursosArray.slice(offset, offset + batchSize);
        let inserted = 0;
        let errors = 0;

        // Inserir em lote
        const cursosToInsert = batch.map(nome => ({ nome }));
        const { error } = await supabase
          .from('cursos')
          .upsert(cursosToInsert, { onConflict: 'nome', ignoreDuplicates: true });
        
        if (error) {
          console.error('Erro ao inserir cursos:', error);
          errors = batch.length;
        } else {
          inserted = batch.length;
        }

        const hasMore = offset + batchSize < cursosArray.length;
        response = {
          success: true,
          phase: 'cursos',
          processed: batch.length,
          total: cursosArray.length,
          hasMore: hasMore,
          nextOffset: hasMore ? offset + batchSize : 0,
          message: hasMore 
            ? `Cursos: ${offset + batch.length}/${cursosArray.length} processados`
            : `Cursos concluídos! Total: ${cursosArray.length}`,
          stats: { inserted, errors }
        };
        break;
      }

      case 'vinculos': {
        // Buscar IDs de modalidades e cursos
        const { data: modalidades } = await supabase.from('modalidades').select('id, nome');
        const { data: cursos } = await supabase.from('cursos').select('id, nome');

        if (!modalidades || !cursos) {
          throw new Error('Falha ao buscar modalidades ou cursos');
        }

        const modalidadeMap = new Map(modalidades.map(m => [m.nome, m.id]));
        const cursoMap = new Map(cursos.map(c => [c.nome, c.id]));

        // Coletar todos os vínculos
        const allVinculos: { modalidade: string; curso: string }[] = [];
        for (const [modalidade, cursosArr] of Object.entries(MODALIDADES_CURSOS)) {
          for (const curso of cursosArr) {
            allVinculos.push({ modalidade, curso });
          }
        }

        const batch = allVinculos.slice(offset, offset + batchSize);
        let inserted = 0;
        let errors = 0;

        // Processar em lote
        const vinculosToInsert = batch
          .filter(v => modalidadeMap.has(v.modalidade) && cursoMap.has(v.curso))
          .map(v => ({
            modalidade_id: modalidadeMap.get(v.modalidade),
            curso_id: cursoMap.get(v.curso)
          }));

        if (vinculosToInsert.length > 0) {
          const { error } = await supabase
            .from('curso_modalidades')
            .upsert(vinculosToInsert, { 
              onConflict: 'curso_id,modalidade_id', 
              ignoreDuplicates: true 
            });
          
          if (error) {
            console.error('Erro ao inserir vinculos:', error);
            errors = vinculosToInsert.length;
          } else {
            inserted = vinculosToInsert.length;
          }
        }

        const hasMore = offset + batchSize < allVinculos.length;
        response = {
          success: true,
          phase: 'vinculos',
          processed: batch.length,
          total: allVinculos.length,
          hasMore: hasMore,
          nextOffset: hasMore ? offset + batchSize : 0,
          message: hasMore 
            ? `Vínculos: ${offset + batch.length}/${allVinculos.length} processados`
            : `Migração concluída! Vínculos: ${allVinculos.length}`,
          stats: { inserted, errors }
        };
        break;
      }

      default:
        throw new Error(`Fase desconhecida: ${phase}`);
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Erro na migração:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        phase: 'error',
        hasMore: false
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
