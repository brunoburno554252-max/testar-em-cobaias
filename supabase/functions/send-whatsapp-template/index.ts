import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

// Função para obter o template baseado no nível de ensino
function getTemplateForNivel(nivelEnsino: string): string | null {
  if (TEMPLATE_30_DIAS.includes(nivelEnsino)) {
    return "template_30";
  }
  if (TEMPLATE_120_DIAS.includes(nivelEnsino)) {
    return "template_120";
  }
  return null;
}

// Template específico para o Polo
const TEMPLATE_POLO = "template_polo";

interface WhatsAppRequest {
  phone: string;
  nomeAluno: string;
  nomeCurso: string;
  nivelEnsino: string;
  plataforma?: string;
  polo?: string;
  telefonePolo?: string;
  dadosExtras?: Record<string, unknown>;
}

interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  poloMessageId?: string;
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

    const { phone, nomeAluno, nomeCurso, nivelEnsino, plataforma, polo, telefonePolo, dadosExtras }: WhatsAppRequest = await req.json();

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

    // Buscar o template correspondente ao nível de ensino
    const templateName = getTemplateForNivel(nivelEnsino);
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

    // 1. Enviar mensagem para o ALUNO (apenas se telefone foi fornecido)
    if (phone) {
      const formattedPhone = formatPhoneNumber(phone);

      console.log('Sending WhatsApp template message to student:', {
        phone: formattedPhone,
        template: templateName,
        nomeAluno,
        nomeCurso,
        nivelEnsino,
        plataforma: plataformaValue
      });

      const studentResult = await sendWhatsAppMessage(
        phoneNumberId,
        accessToken,
        formattedPhone,
        templateName,
        [
          { type: "text", text: nomeAluno },
          { type: "text", text: nomeCurso },
          { type: "text", text: plataformaValue }
        ]
      );

      if (!studentResult.success) {
        console.error('Failed to send message to student:', studentResult.error);
        // Continuar para tentar enviar ao polo
      } else {
        console.log('WhatsApp message sent successfully to student:', studentResult.messageId);
        response.messageId = studentResult.messageId;
      }
    }

    // 2. Enviar mensagem para o POLO (se telefone do polo foi fornecido)
    if (telefonePolo && polo) {
      const formattedPoloPhone = formatPhoneNumber(telefonePolo);
      
      console.log('Sending WhatsApp template message to polo:', {
        phone: formattedPoloPhone,
        template: TEMPLATE_POLO,
        nomeAluno,
        nomeCurso,
        polo,
        plataforma: plataformaValue
      });

      const poloResult = await sendWhatsAppMessage(
        phoneNumberId,
        accessToken,
        formattedPoloPhone,
        TEMPLATE_POLO,
        [
          { type: "text", text: nomeAluno },
          { type: "text", text: nomeCurso },
          { type: "text", text: polo },
          { type: "text", text: plataformaValue }
        ]
      );

      if (poloResult.success) {
        console.log('WhatsApp message sent successfully to polo:', poloResult.messageId);
        response.poloMessageId = poloResult.messageId;
      } else {
        console.error('Failed to send message to polo:', poloResult.error);
        // Não falhar a operação inteira se a mensagem do polo falhar
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
