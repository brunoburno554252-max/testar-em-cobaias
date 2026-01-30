-- Primeiro, remover duplicados mantendo apenas o primeiro de cada nome (usando ctid)
DELETE FROM polos p1
USING polos p2
WHERE p1.nome = p2.nome 
AND p1.ctid > p2.ctid;

-- Remover duplicados de modalidades
DELETE FROM modalidades m1
USING modalidades m2
WHERE m1.nome = m2.nome 
AND m1.ctid > m2.ctid;

-- Remover duplicados de cursos
DELETE FROM cursos c1
USING cursos c2
WHERE c1.nome = c2.nome 
AND c1.ctid > c2.ctid;

-- Remover duplicados de curso_modalidades
DELETE FROM curso_modalidades cm1
USING curso_modalidades cm2
WHERE cm1.curso_id = cm2.curso_id 
AND cm1.modalidade_id = cm2.modalidade_id
AND cm1.ctid > cm2.ctid;

-- Agora adicionar as constraints UNIQUE
ALTER TABLE public.polos ADD CONSTRAINT polos_nome_unique UNIQUE (nome);
ALTER TABLE public.modalidades ADD CONSTRAINT modalidades_nome_unique UNIQUE (nome);
ALTER TABLE public.cursos ADD CONSTRAINT cursos_nome_unique UNIQUE (nome);
ALTER TABLE public.curso_modalidades ADD CONSTRAINT curso_modalidades_unique UNIQUE (curso_id, modalidade_id);