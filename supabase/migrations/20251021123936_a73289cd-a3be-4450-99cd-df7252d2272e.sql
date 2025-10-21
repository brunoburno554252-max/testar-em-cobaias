-- Permitir que qualquer um possa inserir dados na tabela planilhas_dados
CREATE POLICY "Anyone can insert planilhas dados"
ON public.planilhas_dados
FOR INSERT
WITH CHECK (true);

-- Permitir que qualquer um possa atualizar dados na tabela planilhas_dados
CREATE POLICY "Anyone can update planilhas dados"
ON public.planilhas_dados
FOR UPDATE
USING (true)
WITH CHECK (true);