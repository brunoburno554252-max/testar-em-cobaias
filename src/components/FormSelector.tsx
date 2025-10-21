import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formsData } from "@/mock/formsData";
import { FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormSelectorProps {
  username: string;
  onSelectForm: (formName: string) => void;
  onLogout: () => void;
}

const FormSelector = ({ username, onSelectForm, onLogout }: FormSelectorProps) => {
  const formNames = Object.keys(formsData);

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Sistema de Formulários</h1>
            <p className="text-lg text-muted-foreground">
              Olá, <span className="font-semibold text-foreground">{username}</span>! 
              Selecione um formulário para começar.
            </p>
          </div>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formNames.map((formName) => (
            <Card
              key={formName}
              className="cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 hover:bg-accent/10 hover:border-accent border-0 shadow-md group"
              onClick={() => onSelectForm(formName)}
            >
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 group-hover:bg-accent/20 rounded-xl flex items-center justify-center transition-colors">
                  <FileText className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <CardTitle className="text-xl mb-2">{formName}</CardTitle>
                  <CardDescription>
                    {formsData[formName].length - 1} campos para preencher
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}

          {/* Seção de Registro */}
          <Card
            className="cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 hover:bg-accent/10 hover:border-accent border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 group"
            onClick={() => onSelectForm("REGISTRO")}
          >
            <CardHeader className="space-y-4">
              <div className="w-12 h-12 bg-primary/20 group-hover:bg-accent/20 rounded-xl flex items-center justify-center transition-colors">
                <FileText className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
              </div>
              <div>
                <CardTitle className="text-xl mb-2">REGISTRO</CardTitle>
                <CardDescription>
                  Visualizar histórico de registros
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
