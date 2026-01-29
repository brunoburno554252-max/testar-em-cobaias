import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuração especial para polo EDUKS
const EDUKS_CONFIG = {
  phones: [
    { name: "Jean", phone: "17981043712" },
    { name: "Igor", phone: "17992318527" },
    { name: "Atendimento EDUKS", phone: "17996362464" }
  ],
  skipStudentMessage: true // NÃO enviar para o aluno
};

// Função para verificar se é polo EDUKS
function isPoloEDUKS(nomePolo: string): boolean {
  return nomePolo?.toUpperCase().includes("EDUKS") ?? false;
}

// Templates de 30 dias
const TEMPLATE_30_DIAS: string[] = [
  "Aperfeiçoamento De Estudos",
  "Extensão Universitária",
  "Pós-Graduação",
  "Superior Sequencial",
  "Aproveitamento/Competência",
  "EJA",
  "Técnico regular",
  "Profissionalizante Avançado",
  "Profissionalizante Especial",
  "Pós Técnico",
  "PROFISSIONALIZANTES PREMIUM",
  "PÓS - GRADUAÇÕES - VINCIT",
  "PÓS - GRADUAÇÕES - UNIMAIS",
  "PROFISSIONALIZANTES COMUM",
  "DOUTORADOS/MESTRADOS/PÓS DOUTORADO - IVY ENBER",
  "TREINAMENTO PARA PARCEIROS LA",
  "PÓS-GRADUAÇÃO CHANCELA",
  "TÉCNICO CHANCELA"
];

// Templates de 120 dias
const TEMPLATE_120_DIAS: string[] = [
  "Formação Pedagógica",
  "Graduação",
  "Segunda Licenciatura",
  "BACHAREL/ LICENCIATURA - UNIMAIS",
  "SEGUNDA LICENCIATURA/FORMAÇÃO PEDAGÓGICA - UNIMAIS",
  "TECNÓLOGOS - UNIMAIS",
  "FORMAÇÃO SPEED - UNIMAIS",
  "GRADUAÇÃO CHANCELA"
];

// Templates para ALUNO
const TEMPLATE_NEGADO = "certificacao_negada";

// Templates para POLO (Licenciados)
const TEMPLATE_POLO_NEGADO = "certificacao_negada_licenciado";
const TEMPLATE_POLO_30 = "template_30_licenciado";
const TEMPLATE_POLO_120 = "template_120_licenciado";

// Função para obter o template do ALUNO baseado no nível de ensino e tipo de ação
function getTemplateForNivel(nivelEnsino: string, tipoAcao: string = "aprovado"): string | null {
  // Se for negado, usa template específico
  if (tipoAcao === "negado") {
    return TEMPLATE_NEGADO;
  }
  
  // Se for aprovado, usa template baseado no prazo
  if (TEMPLATE_30_DIAS.includes(nivelEnsino)) {
    return "template_30";
  }
  if (TEMPLATE_120_DIAS.includes(nivelEnsino)) {
    return "template_120";
  }
  return null;
}

// Função para obter o template do POLO baseado no nível de ensino e tipo de ação
function getTemplateForPolo(nivelEnsino: string, tipoAcao: string = "aprovado"): string | null {
  // Se for negado, usa template específico para polo
  if (tipoAcao === "negado") {
    return TEMPLATE_POLO_NEGADO;
  }
  
  // Se for aprovado, usa template baseado no prazo
  if (TEMPLATE_30_DIAS.includes(nivelEnsino)) {
    return TEMPLATE_POLO_30;
  }
  if (TEMPLATE_120_DIAS.includes(nivelEnsino)) {
    return TEMPLATE_POLO_120;
  }
  return null;
}

interface WhatsAppRequest {
  phone: string;
  nomeAluno: string;
  nomeCurso: string;
  nivelEnsino: string;
  plataforma?: string;
  nomePolo?: string;
  telefonePolo?: string;
  tipoAcao?: string; // "aprovado" ou "negado"
  observacoes?: string; // Para template negado
  dadosExtras?: Record<string, unknown>;
}

interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  poloMessageId?: string;
  poloMessageIds?: string[]; // Array para múltiplos IDs (EDUKS)
  error?: string;
  details?: unknown;
}

// Função auxiliar para enviar mensagem WhatsApp
async function sendWhatsAppMessage(
  phoneNumberId: string,
  accessToken: string,
  formattedPhone: string,
  templateName: string,
  parameters: { type: string; text: string }[]
): Promise<{ success: boolean; messageId?: string; error?: string; details?: unknown }> {
  const payload = {
    messaging_product: "whatsapp",
    to: formattedPhone,
    type: "template",
    template: {
      name: templateName,
      language: { code: "pt_BR" },
      components: [
        {
          type: "body",
          parameters: parameters
        }
      ]
    }
  };

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    console.error('WhatsApp API error:', responseData);
    return {
      success: false,
      error: responseData.error?.message || 'Erro ao enviar mensagem WhatsApp',
      details: responseData
    };
  }

  return {
    success: true,
    messageId: responseData.messages?.[0]?.id
  };
}

// Função para formatar número de telefone
function formatPhoneNumber(phone: string): string {
  let formattedPhone = phone.replace(/\D/g, '');
  if (!formattedPhone.startsWith('55')) {
    formattedPhone = '55' + formattedPhone;
  }
  return formattedPhone;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
    const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

    if (!accessToken || !phoneNumberId) {
      console.error('Missing WhatsApp credentials');
      return new Response(
        JSON.stringify({ success: false, error: 'Credenciais do WhatsApp não configuradas' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { phone, nomeAluno, nomeCurso, nivelEnsino, plataforma, nomePolo, telefonePolo, tipoAcao, observacoes, dadosExtras }: WhatsAppRequest = await req.json();

    // Validação dos campos obrigatórios (telefone do aluno agora é opcional)
    if (!nomeAluno || !nomeCurso || !nivelEnsino) {
      console.error('Missing required fields:', { nomeAluno: !!nomeAluno, nomeCurso: !!nomeCurso, nivelEnsino: !!nivelEnsino });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Campos obrigatórios não preenchidos: nome do aluno, nome do curso e nível de ensino são necessários' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se há pelo menos um telefone para enviar
    if (!phone && !telefonePolo) {
      console.error('No phone numbers provided');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'É necessário fornecer pelo menos um número de telefone (aluno ou polo)' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar o template correspondente ao nível de ensino e tipo de ação
    const templateName = getTemplateForNivel(nivelEnsino, tipoAcao || "aprovado");
    if (!templateName) {
      console.log('No template found for nivel:', nivelEnsino, '- skipping WhatsApp message');
      // Não é erro, apenas não envia mensagem para níveis sem template
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Nível de ensino "${nivelEnsino}" não requer envio de mensagem WhatsApp` 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const plataformaValue = plataforma || "LA EDUCAÇÃO";

    const response: WhatsAppResponse = {
      success: true
    };

    // Verificar se é polo EDUKS
    const isEDUKS = isPoloEDUKS(nomePolo || "");
    
    if (isEDUKS) {
      console.log('🔵 EDUKS polo detected - applying special rules');
      console.log('🔵 Skipping student message, sending to 3 EDUKS contacts');
    }

    // 1. Enviar mensagem para o ALUNO (apenas se telefone foi fornecido E NÃO for EDUKS)
    if (phone && !isEDUKS) {
      const formattedPhone = formatPhoneNumber(phone);
      const acaoAtual = tipoAcao || "aprovado";

      console.log('Sending WhatsApp template message to student:', {
        phone: formattedPhone,
        template: templateName,
        tipoAcao: acaoAtual,
        nomeAluno,
        nomeCurso,
        nivelEnsino,
        plataforma: plataformaValue
      });

      // Parâmetros variam conforme o tipo de ação
      const messageParams = acaoAtual === "negado"
        ? [
            { type: "text", text: nomeAluno },
            { type: "text", text: nomeCurso },
            { type: "text", text: observacoes || "Documentação pendente" }
          ]
        : [
            { type: "text", text: nomeAluno },
            { type: "text", text: nivelEnsino },
            { type: "text", text: nomeCurso }
          ];

      const studentResult = await sendWhatsAppMessage(
        phoneNumberId,
        accessToken,
        formattedPhone,
        templateName,
        messageParams
      );

      if (!studentResult.success) {
        console.error('Failed to send message to student:', studentResult.error);
        // Continuar para tentar enviar ao polo
      } else {
        console.log('WhatsApp message sent successfully to student:', studentResult.messageId);
        response.messageId = studentResult.messageId;
      }
    } else if (isEDUKS && phone) {
      console.log('🔵 EDUKS: Skipping student message as per special rule');
    }

    // 2. Enviar mensagem para o POLO
    if (isEDUKS) {
      // EDUKS: Enviar para os 3 números fixos
      const acaoAtual = tipoAcao || "aprovado";
      const poloTemplateName = getTemplateForPolo(nivelEnsino, acaoAtual);
      
      if (poloTemplateName) {
        const poloMessageIds: string[] = [];
        
        for (const contact of EDUKS_CONFIG.phones) {
          const formattedPoloPhone = formatPhoneNumber(contact.phone);
          
          console.log(`🔵 EDUKS: Sending to ${contact.name} (${formattedPoloPhone}):`, {
            template: poloTemplateName,
            tipoAcao: acaoAtual
          });

          // Parâmetros do polo - usar "EDUKS" como nome do polo
          const poloMessageParams = acaoAtual === "negado"
            ? [
                { type: "text", text: "EDUKS" },
                { type: "text", text: nomeCurso },
                { type: "text", text: nomeAluno },
                { type: "text", text: observacoes || "Documentação pendente" }
              ]
            : [
                { type: "text", text: "EDUKS" },
                { type: "text", text: nivelEnsino },
                { type: "text", text: nomeCurso },
                { type: "text", text: nomeAluno }
              ];

          const poloResult = await sendWhatsAppMessage(
            phoneNumberId,
            accessToken,
            formattedPoloPhone,
            poloTemplateName,
            poloMessageParams
          );

          if (poloResult.success) {
            console.log(`🔵 EDUKS: Message sent to ${contact.name}:`, poloResult.messageId);
            if (poloResult.messageId) {
              poloMessageIds.push(poloResult.messageId);
            }
          } else {
            console.error(`🔵 EDUKS: Failed to send to ${contact.name}:`, poloResult.error);
          }
        }
        
        response.poloMessageIds = poloMessageIds;
        console.log(`🔵 EDUKS: Sent ${poloMessageIds.length}/3 messages successfully`);
      } else {
        console.log('🔵 EDUKS: No polo template found for nivel:', nivelEnsino);
      }
    } else if (telefonePolo && nomePolo) {
      // Polo normal: enviar para único número
      const formattedPoloPhone = formatPhoneNumber(telefonePolo);
      const acaoAtual = tipoAcao || "aprovado";
      
      // Obter template do polo baseado no nível de ensino e tipo de ação
      const poloTemplateName = getTemplateForPolo(nivelEnsino, acaoAtual);
      
      if (poloTemplateName) {
        console.log('Sending WhatsApp template message to polo:', {
          phone: formattedPoloPhone,
          template: poloTemplateName,
          tipoAcao: acaoAtual,
          nomeAluno,
          nomeCurso,
          nomePolo,
          observacoes
        });

        // Parâmetros do polo variam conforme o tipo de ação
        // Ordem correta para negado: nomePolo, nomeCurso, nomeAluno, observacoes
        const poloMessageParams = acaoAtual === "negado"
          ? [
              { type: "text", text: nomePolo },
              { type: "text", text: nomeCurso },
              { type: "text", text: nomeAluno },
              { type: "text", text: observacoes || "Documentação pendente" }
            ]
          : [
              { type: "text", text: nomePolo },
              { type: "text", text: nivelEnsino },
              { type: "text", text: nomeCurso },
              { type: "text", text: nomeAluno }
            ];

        const poloResult = await sendWhatsAppMessage(
          phoneNumberId,
          accessToken,
          formattedPoloPhone,
          poloTemplateName,
          poloMessageParams
        );

        if (poloResult.success) {
          console.log('WhatsApp message sent successfully to polo:', poloResult.messageId);
          response.poloMessageId = poloResult.messageId;
        } else {
          console.error('Failed to send message to polo:', poloResult.error);
        }
      } else {
        console.log('No polo template found for nivel:', nivelEnsino, '- skipping polo message');
      }
    }

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Error in send-whatsapp-template function:', error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
