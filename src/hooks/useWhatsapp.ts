import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SendMessageParams {
  phone: string;
  nomeAluno: string;
  nomeCurso: string;
  nivelEnsino: string;
  plataforma?: string;
  dadosExtras?: Record<string, unknown>;
}

interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export const useWhatsapp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async ({
    phone,
    nomeAluno,
    nomeCurso,
    nivelEnsino,
    plataforma,
    dadosExtras
  }: SendMessageParams): Promise<SendMessageResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validação dos campos obrigatórios
      if (!phone || !nomeAluno || !nomeCurso || !nivelEnsino) {
        const errorMsg = 'Todos os campos são obrigatórios: telefone, nome do aluno, nome do curso e nível de ensino';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Validação básica do telefone
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 13) {
        const errorMsg = 'Número de telefone inválido';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      console.log('Calling send-whatsapp-template edge function:', {
        phone: cleanPhone,
        nomeAluno,
        nomeCurso,
        nivelEnsino,
        plataforma
      });

      const { data, error: functionError } = await supabase.functions.invoke(
        'send-whatsapp-template',
        {
          body: {
            phone: cleanPhone,
            nomeAluno,
            nomeCurso,
            nivelEnsino,
            plataforma,
            dadosExtras
          }
        }
      );

      if (functionError) {
        console.error('Edge function error:', functionError);
        const errorMsg = functionError.message || 'Erro ao enviar mensagem';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      if (!data?.success) {
        const errorMsg = data?.error || 'Erro desconhecido ao enviar mensagem';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      toast.success('Mensagem enviada com sucesso para a certificadora!');
      return { success: true, messageId: data.messageId };

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
      console.error('Error sending WhatsApp message:', err);
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    error
  };
};
