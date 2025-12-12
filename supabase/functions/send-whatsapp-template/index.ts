import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapa de níveis de ensino para templates da Meta
// SUBSTITUA os valores pelos nomes reais dos seus templates na Meta
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

interface WhatsAppRequest {
  phone: string;
  nomeAluno: string;
  nomeCurso: string;
  nivelEnsino: string;
  dadosExtras?: Record<string, unknown>;
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

    const { phone, nomeAluno, nomeCurso, nivelEnsino, dadosExtras }: WhatsAppRequest = await req.json();

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

    // Formatar número de telefone (remover caracteres não numéricos e adicionar código do país se necessário)
    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('55')) {
      formattedPhone = '55' + formattedPhone;
    }

    console.log('Sending WhatsApp template message:', {
      phone: formattedPhone,
      template: templateName,
      nomeAluno,
      nomeCurso,
      nivelEnsino
    });

    // Montar payload para a API do WhatsApp
    // {{1}} = nome do aluno
    // {{2}} = nome do curso
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
            parameters: [
              { type: "text", text: nomeAluno },
              { type: "text", text: nomeCurso }
            ]
          }
        ]
      }
    };

    // Enviar requisição para a API do WhatsApp
    const whatsappResponse = await fetch(
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

    const responseData = await whatsappResponse.json();

    if (!whatsappResponse.ok) {
      console.error('WhatsApp API error:', responseData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: responseData.error?.message || 'Erro ao enviar mensagem WhatsApp',
          details: responseData
        }),
        { status: whatsappResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('WhatsApp message sent successfully:', responseData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: responseData.messages?.[0]?.id,
        data: responseData
      }),
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
