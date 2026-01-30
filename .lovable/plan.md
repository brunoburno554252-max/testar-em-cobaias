

# Plano: Edge Function para Migrar Todos os Dados do Mock

## Objetivo

Criar uma Edge Function que migra automaticamente todos os dados do arquivo mock (`src/mock/formsData.ts`) para as tabelas do Supabase (`polos`, `modalidades`, `cursos` e `curso_modalidades`), de forma contínua e sem precisar de lotes manuais.

## Resumo dos Dados a Migrar

| Tabela | Quantidade |
|--------|------------|
| Polos | ~1.475 (com telefone) |
| Modalidades | ~24 |
| Cursos | ~4.000+ |
| Vinculos (curso-modalidade) | ~5.000+ |

## Arquitetura da Solucao

```text
+---------------------+      +------------------------+      +-----------------+
|   Frontend React    | ---> |   Edge Function        | ---> |   Supabase DB   |
|   (botao Admin)     |      |   migrate-mock-data    |      |   (tabelas)     |
+---------------------+      +------------------------+      +-----------------+
                                      |
                                      v
                             +------------------+
                             |  Dados Embutidos |
                             |  (JSON inline)   |
                             +------------------+
```

## Detalhes Tecnicos

### 1. Criar Edge Function `migrate-mock-data`

**Arquivo:** `supabase/functions/migrate-mock-data/index.ts`

A Edge Function ira:

1. **Receber requisicao POST** com autenticacao de admin
2. **Executar em 4 fases sequenciais:**
   - Fase 1: Inserir todas as modalidades
   - Fase 2: Inserir todos os polos
   - Fase 3: Inserir todos os cursos
   - Fase 4: Criar vinculos curso-modalidade
3. **Retornar relatorio** com contagens de sucesso/erro

**Codigo principal:**

```typescript
// Dados embutidos diretamente na funcao (extraidos do mock)
const POLOS_DATA = [
  { nome: "POLO TESTE", telefone: "(44) 99905-6702" },
  { nome: "Programa Universidade Facil", telefone: "(44) 99846-8426" },
  // ... todos os 1.475 polos
];

const MODALIDADES = [
  "Aperfeicoamento De Estudos",
  "Extensao Universitaria",
  "Formacao Pedagogica",
  // ... todas as 24 modalidades
];

const CURSOS_POR_MODALIDADE = {
  "Aperfeicoamento De Estudos": ["ARTE E EDUCACAO", ...],
  "Extensao Universitaria": ["DIDATICA NAS SERIES INICIAIS", ...],
  // ... todos os cursos por modalidade
};

serve(async (req) => {
  // 1. Verificar autenticacao admin
  // 2. Conectar ao Supabase com service role
  // 3. Executar migracao em fases
  // 4. Retornar relatorio
});
```

### 2. Configurar no `supabase/config.toml`

```toml
[functions.migrate-mock-data]
verify_jwt = true  # Requer autenticacao
```

### 3. Adicionar Botao na Area Administrativa

**Arquivo:** `src/components/admin/AdminArea.tsx`

Adicionar um botao "Migrar Dados do Mock" que:
- Chama a Edge Function
- Mostra progresso/status
- Exibe relatorio final

### 4. Fluxo de Execucao

```text
1. Admin clica "Migrar Dados"
        |
        v
2. Frontend chama Edge Function
        |
        v
3. Edge Function conecta ao Supabase
        |
        v
4. Fase 1: INSERT modalidades (ON CONFLICT DO NOTHING)
        |
        v
5. Fase 2: INSERT polos (ON CONFLICT DO NOTHING)
        |
        v
6. Fase 3: INSERT cursos (ON CONFLICT DO NOTHING)
        |
        v
7. Fase 4: Buscar IDs e INSERT vinculos
        |
        v
8. Retornar { success: true, stats: {...} }
        |
        v
9. Frontend exibe "Migracao concluida!"
```

## Vantagens desta Abordagem

- **Automatico**: Um clique para migrar tudo
- **Idempotente**: Pode rodar multiplas vezes sem duplicar dados (ON CONFLICT)
- **Progressivo**: Reporta status de cada fase
- **Seguro**: Apenas admins podem executar
- **Sem dependencias**: Dados embutidos na funcao, nao precisa acessar arquivos

## Arquivos a Criar/Modificar

| Arquivo | Acao |
|---------|------|
| `supabase/functions/migrate-mock-data/index.ts` | Criar (nova edge function) |
| `supabase/config.toml` | Modificar (adicionar config da funcao) |
| `src/components/admin/AdminArea.tsx` | Modificar (adicionar botao de migracao) |

## Resultado Esperado

Apos executar a funcao, o banco tera:
- **~1.475 polos** com nome e telefone
- **~24 modalidades**
- **~4.000+ cursos** unicos
- **~5.000+ vinculos** entre cursos e modalidades

A area administrativa mostrara todos os dados corretamente, permitindo gestao completa.

