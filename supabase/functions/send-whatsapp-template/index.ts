import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapa de níveis de ensino para templates da Meta
const TEMPLATE_MAP: Record<string, string> = {
  "Aperfeiçoamento De Estudos": "template_aperfeicoamento",
  "Extensão Universitária": "template_extensao",
  "Formação Pedagógica": "template_formacao_pedagogica",
  "Graduação": "template_graduacao",
  "Pós-Graduação": "template_pos_graduacao",
  "Segunda Licenciatura": "template_segunda_licenciatura",
  "Superior Sequencial": "template_superior_sequencial",
  "Aproveitamento/Competência": "template_aproveitamento",
  "EJA": "template_eja",
  "Técnico regular": "template_tecnico_regular",
  "Profissionalizante Avançado": "template_profissionalizante_avancado",
  "Profissionalizante Especial": "template_profissionalizante_especial",
  "Pós Técnico": "template_pos_tecnico",
  "PROFISSIONALIZANTES PREMIUM": "template_profissionalizantes_premium",
  "DOUTORADOS/MESTRADOS/PÓS DOUTORADO - IVY ENBER": "template_doutorados_mestrados",
  "PÓS-GRADUAÇÃO CHANCELA": "template_pos_chancela",
};

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

    // Validação dos campos obrigatórios
    if (!phone || !nomeAluno || !nomeCurso || !nivelEnsino) {
      console.error('Missing required fields:', { phone: !!phone, nomeAluno: !!nomeAluno, nomeCurso: !!nomeCurso, nivelEnsino: !!nivelEnsino });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Campos obrigatórios não preenchidos: telefone, nome do aluno, nome do curso e nível de ensino são necessários' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar o template correspondente ao nível de ensino
    const templateName = TEMPLATE_MAP[nivelEnsino];
    if (!templateName) {
      console.error('Template not found for nivel:', nivelEnsino);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Template não encontrado para o nível de ensino: ${nivelEnsino}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formattedPhone = formatPhoneNumber(phone);
    const plataformaValue = plataforma || "LA EDUCAÇÃO";

    console.log('Sending WhatsApp template message to student:', {
      phone: formattedPhone,
      template: templateName,
      nomeAluno,
      nomeCurso,
      nivelEnsino,
      plataforma: plataformaValue
    });

    // 1. Enviar mensagem para o ALUNO
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
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: studentResult.error,
          details: studentResult.details
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('WhatsApp message sent successfully to student:', studentResult.messageId);

    const response: WhatsAppResponse = {
      success: true,
      messageId: studentResult.messageId
    };

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
