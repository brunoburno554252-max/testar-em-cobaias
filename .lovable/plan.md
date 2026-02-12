
# Corrigir Login Travado

## Problema

Ao fazer login, o fluxo é:
1. Supabase Auth autentica o usuario (funciona)
2. App tenta buscar `username` na tabela `forms_users` do Supabase
3. O banco de dados esta com timeout (nao responde)
4. `username` fica `null`
5. A condicao `if (!user || !username)` na linha 79 do `Index.tsx` mantém o usuario na tela de login

O usuario esta autenticado, mas o app nao reconhece porque nao conseguiu buscar o perfil.

## Solucao

Modificar `src/pages/Index.tsx` para ter um fallback quando a consulta ao banco falhar:

1. **Fallback para username**: Se a consulta a `forms_users` falhar ou retornar vazio, usar o email do usuario (disponivel no objeto `user` do Supabase Auth) como username temporario.

2. **Tratamento de erro em `loadUserProfile`**: Adicionar try/catch com timeout para nao ficar esperando indefinidamente.

3. **Timeout de seguranca**: Se apos 5 segundos o perfil nao carregar, usar o email como fallback.

### Mudancas no codigo

**Arquivo: `src/pages/Index.tsx`**

- Na funcao `loadUserProfile`: adicionar try/catch e fallback para `user.email`
- Alterar a logica para que, se o banco falhar, o usuario ainda consiga entrar usando o email como nome

```typescript
const loadUserProfile = async (userId: string, userEmail?: string) => {
  try {
    const { data, error } = await supabase
      .from("forms_users")
      .select("full_name, email")
      .eq("user_id", userId)
      .single();

    if (data) {
      setUsername(data.full_name || data.email.split("@")[0]);
    } else {
      // Fallback: usar email do auth
      setUsername(userEmail?.split("@")[0] || "Usuário");
    }
  } catch (error) {
    // Banco indisponível - usar email como fallback
    setUsername(userEmail?.split("@")[0] || "Usuário");
  }
};
```

- Atualizar as chamadas para passar o email:
  - `loadUserProfile(session.user.id, session.user.email)`

### Resultado

O usuario conseguira fazer login mesmo quando o banco de dados estiver lento ou indisponivel, usando o email como nome temporario.
