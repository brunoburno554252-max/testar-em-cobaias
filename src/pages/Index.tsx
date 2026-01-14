import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import LoginPage from "@/components/LoginPage";
import FormSelector from "@/components/FormSelector";
import DynamicForm from "@/components/DynamicForm";
import RegistroPage from "@/components/RegistroPage";
import ProdutividadeDiaria from "@/components/ProdutividadeDiaria";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUsername(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from("forms_users")
      .select("full_name, email")
      .eq("user_id", userId)
      .single();

    if (data) {
      setUsername(data.full_name || data.email.split("@")[0]);
    }
  };

  const handleLogin = () => {
    // Authentication is handled in LoginPage
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUsername(null);
    setSelectedForm(null);
  };

  const handleSelectForm = (formName: string) => {
    setSelectedForm(formName);
  };

  const handleBack = () => {
    setSelectedForm(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user || !username) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (selectedForm) {
    if (selectedForm === "REGISTRO") {
      return (
        <RegistroPage
          username={username}
          onBack={handleBack}
        />
      );
    }

    if (selectedForm === "PRODUTIVIDADE") {
      return (
        <ProdutividadeDiaria
          onBack={handleBack}
        />
      );
    }
    
    return (
      <DynamicForm
        formName={selectedForm}
        username={username}
        onBack={handleBack}
      />
    );
  }

  return (
    <FormSelector
      username={username}
      onSelectForm={handleSelectForm}
      onLogout={handleLogout}
    />
  );
};

export default Index;
