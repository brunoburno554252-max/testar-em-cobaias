

# Plano: Migrar Dados do Mock para o Banco de Dados

## Objetivo

Importar os dados do arquivo `src/mock/formsData.ts` para as tabelas `polos`, `modalidades`, `cursos` e `curso_modalidades` no banco de dados, e atualizar o `DynamicForm` para buscar dados do banco com fallback para o mock (garantindo que tudo continue funcionando).

---

## Dados a Migrar

| Tipo | Quantidade | Origem no Mock |
|------|------------|----------------|
| Polos | ~700 | `poloTelefoneMap` |
| Modalidades | 17 | chaves do `nivelEnsinoCursoMap` |
| Cursos | ~1000+ | valores do `nivelEnsinoCursoMap` (deduplicados) |
| Vinculos | ~1500+ | cada curso vinculado à(s) sua(s) modalidade(s) |

### Modalidades (Nível de Ensino)

```text
1. Aperfeiçoamento De Estudos
2. Extensão Universitária
3. Pós-Graduação
4. Segunda Licenciatura
5. Superior Sequencial
6. Aproveitamento/Competência
7. EJA
8. Técnico regular
9. Profissionalizante Avançado
10. Profissionalizante Especial
11. Pós Técnico
12. PROFISSIONALIZANTES PREMIUM
13-17. (outras categorias do arquivo)
```

---

## Estratégia de Implementação

### Fase 1: Criar Hooks para Buscar Dados do Banco

Criar novos hooks que buscam dados do banco com fallback para o mock:

- `usePolosData.ts` - Busca polos do banco, fallback para `poloTelefoneMap`
- `useModalidadesData.ts` - Busca modalidades do banco, fallback para chaves do `nivelEnsinoCursoMap`
- `useCursosData.ts` - Busca cursos do banco com relacionamento, fallback para `nivelEnsinoCursoMap`

### Fase 2: Atualizar o DynamicForm

Modificar o `DynamicForm.tsx` para usar os novos hooks:

1. Substituir uso direto de `globalPoloOptions` pelo hook `usePolosData`
2. Substituir uso direto de `nivelEnsinoCursoMap` pelo hook `useCursosData`
3. Manter `poloTelefoneMap` para preenchimento automático do telefone (ou buscar do banco)

### Fase 3: Script de Migração de Dados

Criar um script SQL para importar os dados do mock. Como o volume é grande (~2000+ registros), será feito via SQL direto:

1. Inserir todas as modalidades
2. Inserir todos os cursos (deduplicados)
3. Criar os vínculos curso_modalidades

---

## Detalhes Técnicos

### Hook usePolosData

```typescript
export const usePolosData = () => {
  const { polos, isLoading } = usePolos();
  
  // Se banco vazio ou carregando, usar mock
  if (isLoading || polos.length === 0) {
    return {
      poloOptions: Object.keys(poloTelefoneMap),
      poloTelefoneMap: poloTelefoneMap,
      isLoading
    };
  }
  
  // Usar dados do banco
  return {
    poloOptions: polos.map(p => p.nome),
    poloTelefoneMap: Object.fromEntries(
      polos.map(p => [p.nome, p.telefone || ''])
    ),
    isLoading
  };
};
```

### Hook useCursosData

```typescript
export const useCursosData = () => {
  const { cursos, isLoading } = useCursos();
  const { modalidades } = useModalidades();
  
  // Se banco vazio, usar mock
  if (isLoading || cursos.length === 0) {
    return {
      nivelEnsinoCursoMap: nivelEnsinoCursoMap,
      modalidadeOptions: Object.keys(nivelEnsinoCursoMap),
      isLoading
    };
  }
  
  // Construir mapa modalidade -> cursos
  const map: Record<string, string[]> = {};
  modalidades.forEach(mod => {
    map[mod.nome] = cursos
      .filter(c => c.modalidades?.some(m => m.id === mod.id))
      .map(c => c.nome);
  });
  
  return {
    nivelEnsinoCursoMap: map,
    modalidadeOptions: modalidades.map(m => m.nome),
    isLoading
  };
};
```

### Alterações no DynamicForm

```typescript
// Antes
import { nivelEnsinoCursoMap, poloTelefoneMap, globalPoloOptions } from "@/mock/formsData";

// Depois
import { usePolosData, useCursosData } from "@/hooks/useFormData";

const DynamicForm = ({ ... }) => {
  const { poloOptions, poloTelefoneMap } = usePolosData();
  const { nivelEnsinoCursoMap, modalidadeOptions } = useCursosData();
  
  // Resto do código permanece igual, apenas usando os dados dos hooks
};
```

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `src/hooks/useFormData.ts` | Criar (hooks usePolosData e useCursosData) |
| `src/components/DynamicForm.tsx` | Modificar (usar hooks) |
| `src/mock/formsData.ts` | Manter (fallback) |

---

## Script de Migração (Execução Manual)

Devido ao volume de dados (~2000+ registros), a migração será feita via script SQL que pode ser executado no Supabase SQL Editor. O script:

1. Insere as 17 modalidades
2. Insere os cursos (deduplicados de todas as modalidades)
3. Cria os vínculos curso_modalidades

**Nota**: Este script será gerado e executado separadamente após a implementação dos hooks, permitindo testar o sistema antes com os dados mock.

---

## Vantagens desta Abordagem

1. **Zero downtime**: O sistema continua funcionando com dados mock enquanto o banco está vazio
2. **Migração gradual**: Pode-se importar dados aos poucos
3. **Fallback automático**: Se houver problema no banco, volta a usar mock
4. **Código limpo**: Os hooks encapsulam a lógica de decisão

---

## Ordem de Implementação

1. Criar `src/hooks/useFormData.ts` com os hooks `usePolosData` e `useCursosData`
2. Atualizar `DynamicForm.tsx` para usar os novos hooks
3. Testar que tudo continua funcionando (usando dados mock)
4. Executar script de migração para popular o banco
5. Verificar que os dados agora vêm do banco

