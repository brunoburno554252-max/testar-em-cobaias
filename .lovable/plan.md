

# Plano: Migrar Dados do Mock para o Banco de Dados

## ✅ CONCLUÍDO

### Implementado

1. ✅ **Hook `useFormData.ts`** criado em `src/hooks/useFormData.ts`
   - `usePolosData()`: busca polos do banco com fallback para mock
   - `useCursosData()`: busca cursos/modalidades do banco com fallback para mock

2. ✅ **DynamicForm.tsx** atualizado
   - Importa e usa os novos hooks
   - Substitui `globalPoloOptions` por `poloOptions` do hook
   - Substitui `nivelEnsinoCursoMap` e `poloTelefoneMap` pelos dados dos hooks

3. ✅ **Script SQL de Migração** criado em `scripts/migrate-mock-data.sql`
   - Contém ~300+ registros de modalidades, cursos e vínculos
   - Pode ser executado no Supabase SQL Editor

---

## Próximos Passos (Manual)

Para popular o banco de dados com todos os dados do mock:

1. Acesse o **Supabase SQL Editor**
2. Copie e execute o conteúdo de `scripts/migrate-mock-data.sql`
3. O DynamicForm passará a usar os dados do banco automaticamente

---

## Como Funciona

### Fallback Automático

```typescript
// usePolosData
if (isLoading || polos.length === 0) {
  return { poloOptions: mockData, isUsingMock: true };
}
return { poloOptions: dbData, isUsingMock: false };
```

### Fluxo de Dados

1. **Banco vazio** → Usa dados do mock (comportamento atual)
2. **Banco populado** → Usa dados do banco
3. **Erro no banco** → Fallback automático para mock

---

## Arquivos Modificados/Criados

| Arquivo | Status |
|---------|--------|
| `src/hooks/useFormData.ts` | ✅ Criado |
| `src/components/DynamicForm.tsx` | ✅ Atualizado |
| `scripts/migrate-mock-data.sql` | ✅ Criado |
| `src/mock/formsData.ts` | Mantido (fallback) |

