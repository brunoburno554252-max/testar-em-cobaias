import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LogIn, UserPlus, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignup && !name) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Email inválido");
      return;
    }

    if (password.length < 6) {
      toast.error("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: name,
            },
          },
        });

        if (error) throw error;
        
        toast.success("Cadastro realizado! Verifique seu email para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success("Login realizado com sucesso!");
        onLogin();
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar solicitação");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pattern-dots opacity-50" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      
      <Card className="w-full max-w-md glass-strong shadow-card animate-scale-in border-0 relative z-10">
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center shadow-glow relative overflow-hidden"
            style={{ background: 'var(--gradient-primary)' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
            {isSignup ? (
              <UserPlus className="w-9 h-9 text-primary-foreground relative z-10" />
            ) : (
              <LogIn className="w-9 h-9 text-primary-foreground relative z-10" />
            )}
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-display">
              {isSignup ? "Criar Conta" : "Bem-vindo"}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {isSignup
                ? "Cadastre-se para acessar o sistema"
                : "Faça login para gerenciar seus formulários"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="name" className="text-sm font-medium">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-secondary/50 border-border/50 focus:bg-card transition-colors"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-secondary/50 border-border/50 focus:bg-card transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-secondary/50 border-border/50 focus:bg-card transition-colors"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isSignup ? "Cadastrar" : "Entrar"}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="mt-6 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isSignup ? (
                <>
                  Já tem uma conta?{" "}
                  <span className="font-semibold gradient-text">Faça login</span>
                </>
              ) : (
                <>
                  Não tem uma conta?{" "}
                  <span className="font-semibold gradient-text">Cadastre-se</span>
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;