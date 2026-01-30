
# Plano para Corrigir a Migração de Dados Incompletos

## Problema Identificado

A Edge Function `migrate-mock-data` contém dados incompletos em comparação ao arquivo mock original:

| Categoria | Edge Function | Mock Original | Diferença |
|-----------|---------------|---------------|-----------|
| Polos | 378 | ~1470 | ~1092 faltando |
| Modalidades | ~20 | ~26 | ~6 faltando |
| Cursos | ~400 | ~700+ | ~300+ faltando |

A Edge Function foi criada com apenas uma parte dos dados do arquivo `src/mock/formsData.ts`, especificamente:
- Polos: apenas até "Instituto Abraça-me" (linha 388), faltando ~1000 polos
- Pós-Graduação: faltando centenas de cursos "LATO SENSU"
- PROFISSIONALIZANTES PREMIUM: incompleto (só alguns cursos básicos)

## Solucao Proposta

### Fase 1: Reescrever a Edge Function

Modificar `supabase/functions/migrate-mock-data/index.ts` para importar os dados diretamente do arquivo mock original de forma dinâmica, em vez de ter os dados hardcoded:

```text
+------------------------------+
|   Edge Function (index.ts)   |
+------------------------------+
           |
           | Importa dados de
           v
+------------------------------+
|  shared/mock-data.ts (novo)  |
+------------------------------+
           |
           | Contém arrays completos:
           | - POLOS_DATA (1470 itens)
           | - MODALIDADES_CURSOS (26 categorias)
           v
+------------------------------+
|    Processa em lotes de 100  |
+------------------------------+
```

### Fase 2: Criar arquivo de dados compartilhado

Criar um novo arquivo `supabase/functions/_shared/mock-data.ts` contendo:

1. **POLOS_DATA**: Array com todos os ~1470 polos, extraidos de `poloTelefoneMap`
2. **MODALIDADES_CURSOS**: Objeto com todas as 26 modalidades e seus cursos, extraidos de `nivelEnsinoCursoMap`

### Fase 3: Atualizar a Edge Function

A Edge Function sera atualizada para:
1. Importar de `../_shared/mock-data.ts`
2. Manter a logica de processamento em lotes de 100
3. Usar `upsert` com `ignoreDuplicates: true` para evitar duplicatas

### Arquivos a Modificar

1. **Criar**: `supabase/functions/_shared/mock-data.ts`
   - Contera todos os dados de polos (~1470)
   - Contera todas as modalidades e cursos (~26 categorias, ~700+ cursos)

2. **Atualizar**: `supabase/functions/migrate-mock-data/index.ts`
   - Remover arrays de dados hardcoded
   - Importar de `../_shared/mock-data.ts`
   - Manter mesma logica de processamento progressivo

### Detalhes Tecnicos

O arquivo `_shared/mock-data.ts` sera estruturado assim:

```typescript
// Todos os polos com telefones
export const POLOS_DATA = [
  { nome: "POLO TESTE", telefone: "(44) 99905-6702" },
  // ... ~1470 polos
];

// Todas as modalidades com seus cursos
export const MODALIDADES_CURSOS = {
  "Aperfeicoamento De Estudos": [...],
  "Extensao Universitaria": [...],
  // ... ~26 categorias
};
```

### Resultado Esperado

Apos a implementacao:
- **Polos**: ~1470 registros
- **Modalidades**: ~26 registros
- **Cursos**: ~700+ registros (unicos)
- **Vinculos**: proporcional aos cursos/modalidades

O usuario podera clicar no botao "Migrar Dados do Mock" uma unica vez e todos os dados serao migrados progressivamente em lotes de 100.
