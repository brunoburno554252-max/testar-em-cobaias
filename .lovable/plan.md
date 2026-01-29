
# Plano: Área Administrativa de Polos, Modalidades e Cursos

## Resumo

Transformar a página "Produtividade do Dia" em um **Painel Administrativo** completo com:
- Produtividade (aba existente, mantida)
- Gerenciamento de Polos (nome + telefone)
- Gerenciamento de Modalidades (apenas nome)
- Gerenciamento de Cursos (nome + vinculação com múltiplas modalidades)

Acesso restrito a **Admin Master** apenas.

---

## Banco de Dados

### Tabela: `polos`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador único |
| nome | TEXT | Nome do polo |
| telefone | TEXT | Telefone do polo |

### Tabela: `modalidades`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador único |
| nome | TEXT | Nome da modalidade |

### Tabela: `cursos`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador único |
| nome | TEXT | Nome do curso |

### Tabela: `curso_modalidades` (relacionamento N:N)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador único |
| curso_id | UUID (FK) | Referência ao curso |
| modalidade_id | UUID (FK) | Referência à modalidade |

### Políticas RLS
- **SELECT**: Todos usuários autenticados (para uso nos formulários dinâmicos)
- **INSERT/UPDATE/DELETE**: Apenas quem passar em `is_admin_master_user()`

---

## Dados a Migrar

Baseado na análise do arquivo `src/mock/formsData.ts`:

| Tipo | Quantidade | Origem |
|------|------------|--------|
| Polos | ~700 | `poloTelefoneMap` |
| Modalidades | 17 | chaves do `nivelEnsinoCursoMap` |
| Cursos | ~1000+ | valores do `nivelEnsinoCursoMap` (com deduplicação) |
| Vínculos | ~1500+ | cada curso vinculado às suas modalidades |

---

## Componentes a Criar

```text
src/
├── components/
│   └── admin/
│       ├── AdminArea.tsx           # Layout principal com Tabs
│       ├── PolosManager.tsx        # CRUD de Polos
│       ├── ModalidadesManager.tsx  # CRUD de Modalidades
│       └── CursosManager.tsx       # CRUD de Cursos
├── hooks/
│   ├── usePolos.ts                 # Hook CRUD polos
│   ├── useModalidades.ts           # Hook CRUD modalidades
│   ├── useCursos.ts                # Hook CRUD cursos
│   └── useIsAdminMaster.ts         # Verifica permissão
```

---

## Fluxo de Navegação

```text
FormSelector
    │
    └── Card "Área Administrativa" (substitui "Produtividade")
            │
            └── AdminArea (Tabs)
                    ├── Tab "Produtividade" → ProdutividadeDiaria (existente)
                    ├── Tab "Polos" → PolosManager
                    ├── Tab "Modalidades" → ModalidadesManager
                    └── Tab "Cursos" → CursosManager
```

---

## Interface dos Componentes

### PolosManager
- Tabela: Nome | Telefone | Ações (Editar, Excluir)
- Botão "Adicionar Polo" abre dialog/modal
- Campo de busca por nome
- Paginação

### ModalidadesManager
- Tabela: Nome | Qtd Cursos | Ações
- Botão "Adicionar Modalidade"
- Campo de busca

### CursosManager
- Tabela: Nome | Modalidades | Ações
- Ao adicionar/editar: checkboxes para selecionar múltiplas modalidades
- Filtro por modalidade
- Busca por nome

---

## Fases de Implementação

### Fase 1: Banco de Dados
1. Criar tabela `polos` com RLS
2. Criar tabela `modalidades` com RLS
3. Criar tabela `cursos` com RLS
4. Criar tabela `curso_modalidades` com RLS e FKs

### Fase 2: Hook de Permissão
1. Criar `useIsAdminMaster.ts` usando a função `is_admin_master_user()` existente

### Fase 3: Componente Principal
1. Criar `AdminArea.tsx` com sistema de Tabs (shadcn)
2. Integrar `ProdutividadeDiaria` como primeira aba
3. Atualizar `FormSelector` para usar "Área Administrativa"

### Fase 4: CRUD de Polos
1. Criar `usePolos.ts` (query + mutations)
2. Criar `PolosManager.tsx` (tabela + form em dialog)

### Fase 5: CRUD de Modalidades
1. Criar `useModalidades.ts`
2. Criar `ModalidadesManager.tsx`

### Fase 6: CRUD de Cursos
1. Criar `useCursos.ts` (com lógica para gerenciar vínculos N:N)
2. Criar `CursosManager.tsx` (com seleção múltipla de modalidades)

### Fase 7: Migração de Dados (Opcional/Manual)
1. Script SQL para importar polos do mock
2. Script SQL para importar modalidades
3. Script SQL para importar cursos e criar vínculos

### Fase 8: Integração com Formulários
1. Atualizar `DynamicForm` para buscar polos/cursos do banco
2. Manter fallback para dados mock se banco estiver vazio

---

## Detalhes Técnicos

### Hook useIsAdminMaster
```typescript
// Usa a função RPC existente is_admin_master_user()
const { data: isAdmin, isLoading } = useQuery({
  queryKey: ['is-admin-master'],
  queryFn: async () => {
    const { data } = await supabase.rpc('is_admin_master_user');
    return data === true;
  }
});
```

### Componente CursosManager - Seleção Múltipla
- Usa Checkbox do shadcn para cada modalidade
- Ao salvar: deleta vínculos antigos e insere novos na tabela `curso_modalidades`
- Exibe badges com as modalidades vinculadas na listagem

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/admin/AdminArea.tsx` | Criar |
| `src/components/admin/PolosManager.tsx` | Criar |
| `src/components/admin/ModalidadesManager.tsx` | Criar |
| `src/components/admin/CursosManager.tsx` | Criar |
| `src/hooks/useIsAdminMaster.ts` | Criar |
| `src/hooks/usePolos.ts` | Criar |
| `src/hooks/useModalidades.ts` | Criar |
| `src/hooks/useCursos.ts` | Criar |
| `src/components/FormSelector.tsx` | Modificar (atualizar card) |
| `src/pages/Index.tsx` | Modificar (adicionar rota para AdminArea) |
| Migration SQL | Criar (4 tabelas + RLS) |

**Total**: 8 arquivos novos + 2 modificados + 1 migration
