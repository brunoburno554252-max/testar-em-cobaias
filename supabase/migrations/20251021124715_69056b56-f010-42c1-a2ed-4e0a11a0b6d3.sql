-- Criar tabela para registro de ações
CREATE TABLE public.registro_acoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sessao text NOT NULL,
  registro_id uuid NOT NULL,
  linha_numero integer NOT NULL,
  dados_resumo jsonb,
  usuario text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Criar índice para melhor performance
CREATE INDEX idx_registro_acoes_sessao ON public.registro_acoes(sessao);
CREATE INDEX idx_registro_acoes_created_at ON public.registro_acoes(created_at DESC);

-- Habilitar RLS
ALTER TABLE public.registro_acoes ENABLE ROW LEVEL SECURITY;

-- Permitir que qualquer um possa inserir registros
CREATE POLICY "Anyone can insert registro"
ON public.registro_acoes
FOR INSERT
WITH CHECK (true);

-- Permitir que qualquer um possa ler registros
CREATE POLICY "Public can read registros"
ON public.registro_acoes
FOR SELECT
USING (true);

-- Admin master pode gerenciar tudo
CREATE POLICY "Admin master can manage registros"
ON public.registro_acoes
FOR ALL
USING (is_admin_master_user());