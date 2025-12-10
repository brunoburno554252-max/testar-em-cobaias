import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formsData } from "@/mock/formsData";
import { FileText, LogOut, ClipboardList, Sparkles, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormSelectorProps {
  username: string;
  onSelectForm: (formName: string) => void;
  onLogout: () => void;
}

const FormSelector = ({ username, onSelectForm, onLogout }: FormSelectorProps) => {
  const formNames = Object.keys(formsData);

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pattern-grid opacity-50" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: 'var(--gradient-primary)' }}>
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold">
                <span className="gradient-text">Sistema</span> de Formulários
              </h1>
            </div>
            <p className="text-lg text-muted-foreground ml-0 md:ml-15">
              Olá, <span className="font-semibold text-foreground">{username}</span>! 
              Selecione um formulário para começar.
            </p>
          </div>
          <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Button 
              variant="default" 
              asChild
              className="gap-2 h-11 px-5 shadow-lg hover:shadow-xl transition-all"
            >
              <a href="https://dash.laeducacao.com.br" target="_blank" rel="noopener noreferrer">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </a>
            </Button>
            <Button 
              variant="outline" 
              onClick={onLogout} 
              className="gap-2 h-11 px-5 glass hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Form Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formNames.map((formName, index) => (
            <Card
              key={formName}
              className="cursor-pointer glass hover-lift group animate-fade-in border-0 overflow-hidden"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              onClick={() => onSelectForm(formName)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="space-y-4 relative z-10">
                <div className="w-14 h-14 bg-secondary group-hover:bg-primary/10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <FileText className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <div>
                  <CardTitle className="text-xl mb-2 font-display group-hover:text-primary transition-colors">
                    {formName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                      {formsData[formName].length - 1} campos
                    </span>
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}

          {/* Registro Card - Special styling */}
          <Card
            className="cursor-pointer glass hover-lift group animate-fade-in border-0 overflow-hidden relative"
            style={{ animationDelay: `${0.1 * (formNames.length + 1)}s` }}
            onClick={() => onSelectForm("REGISTRO")}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'var(--gradient-primary)', opacity: 0.05 }} />
            <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full blur-2xl"
              style={{ background: 'var(--gradient-primary)', opacity: 0.2 }} />
            <CardHeader className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg"
                style={{ background: 'var(--gradient-primary)' }}>
                <ClipboardList className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl mb-2 font-display group-hover:gradient-text transition-colors">
                  REGISTRO
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Histórico
                  </span>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FormSelector;