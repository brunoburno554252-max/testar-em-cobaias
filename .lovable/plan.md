

# Plano: Regra Especial de WhatsApp para Polo EDUKS

## Objetivo

Implementar uma regra especial para o polo "Polo EDUKS EAD LTDA" (ou variações como "EDUKS"):
1. **NAO enviar mensagem para o aluno** quando este polo for selecionado
2. **Enviar mensagem para 3 numeros diferentes** (template de polo):
   - Jean: (17) 981043712
   - Igor: (17) 992318527
   - Atendimento EDUKS: (17) 996362464

---

## Arquivos a Modificar

| Arquivo | Acao |
|---------|------|
| `src/hooks/useWhatsapp.ts` | Adicionar suporte para multiplos telefones de polo |
| `supabase/functions/send-whatsapp-template/index.ts` | Adicionar logica especial para EDUKS |
| `src/components/DynamicForm.tsx` | Ajustar validacao do telefone WhatsApp para EDUKS |

---

## Detalhes Tecnicos

### 1. Edge Function - Adicionar Configuracao EDUKS

Adicionar constante com os telefones do polo EDUKS e logica para detectar e enviar para multiplos numeros:

```typescript
// Configuracao especial para polo EDUKS
const EDUKS_CONFIG = {
  poloNames: ["Polo EDUKS EAD LTDA", "EDUKS"],
  phones: [
    { name: "Jean", phone: "17981043712" },
    { name: "Igor", phone: "17992318527" },
    { name: "Atendimento EDUKS", phone: "17996362464" }
  ],
  skipStudentMessage: true // NAO enviar para o aluno
};

// Funcao para verificar se e polo EDUKS
function isPoloEDUKS(nomePolo: string): boolean {
  return EDUKS_CONFIG.poloNames.some(name => 
    nomePolo?.toUpperCase().includes("EDUKS")
  );
}
```

### 2. Edge Function - Modificar Handler

Na logica de envio:

```typescript
// Verificar se e polo EDUKS
const isEDUKS = isPoloEDUKS(nomePolo || "");

// 1. Enviar para ALUNO (apenas se NAO for EDUKS e telefone fornecido)
if (phone && !isEDUKS) {
  // ... logica existente de envio para aluno
}

// 2. Enviar para POLO
if (isEDUKS) {
  // Enviar para os 3 numeros do EDUKS
  for (const contact of EDUKS_CONFIG.phones) {
    const formattedPhone = formatPhoneNumber(contact.phone);
    // ... enviar mensagem de polo para cada numero
  }
} else if (telefonePolo && nomePolo) {
  // ... logica existente de envio para polo unico
}
```

### 3. DynamicForm - Ajustar Validacao

Adicionar EDUKS a lista de polos que nao exigem telefone do aluno (similar ao FOR YOU):

```typescript
// Verificar se e polo especial (FOR YOU ou EDUKS)
const isPoloForYou = formValues["Polo"] === "FOR YOU";
const isPoloEDUKS = formValues["Polo"]?.toUpperCase().includes("EDUKS");
const isPoloEspecial = isPoloForYou || isPoloEDUKS;

// Telefone WhatsApp NAO obrigatorio para polos especiais
const isTelefoneWhatsAppRequired = (
  // ... logica existente ...
) && !isPoloEspecial;
```

### 4. Response da Edge Function

Atualizar interface para suportar multiplas mensagens de polo:

```typescript
interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  poloMessageIds?: string[]; // Array para multiplos IDs
  error?: string;
}
```

---

## Fluxo de Envio com EDUKS

```text
Formulario Submetido
        |
        v
   Polo = EDUKS?
        |
    +---+---+
    |       |
   SIM     NAO
    |       |
    v       v
  Pular    Enviar para
  Aluno    Aluno (se tel)
    |       |
    v       v
  Enviar   Enviar para
  para 3   Polo unico
  numeros  (se tel)
```

---

## Consideracoes

1. **Nomenclatura do polo**: O polo pode estar cadastrado como "Polo EDUKS EAD LTDA" ou variantes. A verificacao usa `.includes("EDUKS")` para ser flexivel.

2. **Telefone do Polo no formulario**: Para EDUKS, o telefone preenchido automaticamente sera ignorado e usaremos os 3 numeros fixos.

3. **Logs**: Adicionar logs claros para identificar quando a regra EDUKS esta sendo aplicada.

4. **Sucesso parcial**: Se falhar enviar para 1 dos 3 numeros, continua tentando os outros e reporta quais falharam.

---

## Ordem de Implementacao

1. Modificar a Edge Function `send-whatsapp-template/index.ts` com a configuracao EDUKS
2. Atualizar o hook `useWhatsapp.ts` se necessario
3. Ajustar validacao no `DynamicForm.tsx` para nao exigir telefone do aluno para EDUKS
4. Testar o fluxo completo

