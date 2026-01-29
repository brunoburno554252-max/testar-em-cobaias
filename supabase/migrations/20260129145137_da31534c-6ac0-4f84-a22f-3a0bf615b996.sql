-- Tabela: polos
CREATE TABLE public.polos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela: modalidades
CREATE TABLE public.modalidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela: cursos
CREATE TABLE public.cursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela: curso_modalidades (relacionamento N:N)
CREATE TABLE public.curso_modalidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
  modalidade_id UUID NOT NULL REFERENCES public.modalidades(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(curso_id, modalidade_id)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.polos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modalidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curso_modalidades ENABLE ROW LEVEL SECURITY;

-- RLS para polos
CREATE POLICY "Authenticated users can read polos"
  ON public.polos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin master can insert polos"
  ON public.polos FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can update polos"
  ON public.polos FOR UPDATE
  TO authenticated
  USING (public.is_admin_master_user())
  WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can delete polos"
  ON public.polos FOR DELETE
  TO authenticated
  USING (public.is_admin_master_user());

-- RLS para modalidades
CREATE POLICY "Authenticated users can read modalidades"
  ON public.modalidades FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin master can insert modalidades"
  ON public.modalidades FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can update modalidades"
  ON public.modalidades FOR UPDATE
  TO authenticated
  USING (public.is_admin_master_user())
  WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can delete modalidades"
  ON public.modalidades FOR DELETE
  TO authenticated
  USING (public.is_admin_master_user());

-- RLS para cursos
CREATE POLICY "Authenticated users can read cursos"
  ON public.cursos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin master can insert cursos"
  ON public.cursos FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can update cursos"
  ON public.cursos FOR UPDATE
  TO authenticated
  USING (public.is_admin_master_user())
  WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can delete cursos"
  ON public.cursos FOR DELETE
  TO authenticated
  USING (public.is_admin_master_user());

-- RLS para curso_modalidades
CREATE POLICY "Authenticated users can read curso_modalidades"
  ON public.curso_modalidades FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin master can insert curso_modalidades"
  ON public.curso_modalidades FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can update curso_modalidades"
  ON public.curso_modalidades FOR UPDATE
  TO authenticated
  USING (public.is_admin_master_user())
  WITH CHECK (public.is_admin_master_user());

CREATE POLICY "Admin master can delete curso_modalidades"
  ON public.curso_modalidades FOR DELETE
  TO authenticated
  USING (public.is_admin_master_user());

-- Índices para performance
CREATE INDEX idx_polos_nome ON public.polos(nome);
CREATE INDEX idx_modalidades_nome ON public.modalidades(nome);
CREATE INDEX idx_cursos_nome ON public.cursos(nome);
CREATE INDEX idx_curso_modalidades_curso_id ON public.curso_modalidades(curso_id);
CREATE INDEX idx_curso_modalidades_modalidade_id ON public.curso_modalidades(modalidade_id);