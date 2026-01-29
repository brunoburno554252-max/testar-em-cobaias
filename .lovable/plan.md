# Plano: Regra Especial de WhatsApp para Polo EDUKS

## ✅ IMPLEMENTADO

### Objetivo
Implementar uma regra especial para o polo "EDUKS":
1. **NÃO enviar mensagem para o aluno** quando este polo for selecionado
2. **Enviar mensagem para 3 números diferentes** (template de polo):
   - Jean: (17) 981043712
   - Igor: (17) 992318527
   - Atendimento EDUKS: (17) 996362464

---

## Alterações Realizadas

### 1. Edge Function (`supabase/functions/send-whatsapp-template/index.ts`)
- Adicionada constante `EDUKS_CONFIG` com os 3 telefones
- Adicionada função `isPoloEDUKS()` para detectar o polo pelo nome
- Modificada lógica de envio:
  - Se polo = EDUKS: pula mensagem do aluno e envia para os 3 números
  - Se polo normal: mantém comportamento anterior
- Adicionado campo `poloMessageIds?: string[]` na resposta

### 2. Hook (`src/hooks/useWhatsapp.ts`)
- Interface `SendMessageResult` atualizada com `poloMessageIds?: string[]`
- Mensagem de sucesso personalizada para EDUKS

### 3. Formulário (`src/components/DynamicForm.tsx`)
- EDUKS adicionado como "polo especial" junto com FOR YOU
- Telefone WhatsApp do aluno não é obrigatório para EDUKS

---

## Fluxo de Envio

```text
Formulário Submetido
        |
        v
   Polo = EDUKS?
        |
    +---+---+
    |       |
   SIM     NÃO
    |       |
    v       v
  Pular    Enviar para
  Aluno    Aluno (se tel)
    |       |
    v       v
  Enviar   Enviar para
  para 3   Polo único
  números  (se tel)
```
