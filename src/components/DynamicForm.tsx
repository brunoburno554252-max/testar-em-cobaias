import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formsConfig, globalSelectOptions, globalPoloOptions, globalCursoOptions, nivelEnsinoCursoMap } from "@/mock/formsData";
import { toast } from "sonner";
import { ArrowLeft, Send, Save, Trash2, FileText, Sparkles, MessageCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DocumentStatusBlocks } from "@/components/DocumentStatusBlocks";
import { useWhatsapp } from "@/hooks/useWhatsapp";

interface DynamicFormProps {
  formName: string;
  username: string;
  onBack: () => void;
}

// Mapear nome do formulário para sessão da tabela
const getSessionKey = (formName: string): string => {
  const mapping: Record<string, string> = {
    "CERTIFICAÇÃO": "certificacao",
    "MATRÍCULA": "matriculas",
    "PEDAGÓGICO": "pedagogia",
    "ATENDIMENTO": "atendimento",
    "SECRETARIA ACADÊMICA": "secretaria",
    "COMPETÊNCIA": "competencia",
    "OUVIDORIA": "ouvidoria",
    "Central de Atendimento aos Licenciados": "central-licenciados",
    "BITRIX24": "bitrix24",
  };
  return mapping[formName] || formName.toLowerCase();
};

const DynamicForm = ({ formName, username, onBack }: DynamicFormProps) => {
  const sectionConfig = formsConfig[formName];
  const fields = sectionConfig?.fields || [];
  const isCompetenciaForm = formName === "COMPETÊNCIA";
  const isCertificacaoForm = formName === "CERTIFICAÇÃO";
  const storageKey = `saved_form_${getSessionKey(formName)}`;
  const globalPlataformaKey = 'global_plataforma_value';
  
  // Hook do WhatsApp para envio de templates
  const { sendMessage, isLoading: isWhatsappLoading } = useWhatsapp();
  
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {
      Colaborador: username,
    };
    
    // Preencher Data automaticamente se o campo existir
    if (fields.includes("Data")) {
      const today = new Date().toISOString().split('T')[0];
      initialValues.Data = today;
    }
    
    // Carregar Plataforma global se o campo existir
    if (fields.includes("Plataforma")) {
      const savedPlataforma = localStorage.getItem(globalPlataformaKey);
      if (savedPlataforma) {
        initialValues.Plataforma = savedPlataforma;
      }
    }
    
    return initialValues;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar valores salvos ao montar o componente (apenas para Competência)
  useEffect(() => {
    if (isCompetenciaForm) {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          // Manter a data atual se não estiver nos dados salvos
          const today = new Date().toISOString().split('T')[0];
          setFormValues(prev => ({ 
            ...prev, 
            ...parsed, 
            Colaborador: username,
            Data: parsed.Data || today 
          }));
        } catch (error) {
          console.error("Erro ao carregar dados salvos:", error);
        }
      }
    }
  }, [formName, username, isCompetenciaForm, storageKey, fields]);

  const saveSelectableFields = () => {
    if (!isCompetenciaForm) return;
    
    // Salvar campos selecionáveis, Aluno e Data (exceto Colaborador e Observações)
    const selectableData: Record<string, string> = {};
    fields.forEach(field => {
      const fieldType = getFieldType(field);
      if (formValues[field] && field !== "Colaborador" && field !== "Observações") {
        if (fieldType === "select" || field === "Aluno" || field === "Data") {
          selectableData[field] = formValues[field];
        }
      }
    });
    
    localStorage.setItem(storageKey, JSON.stringify(selectableData));
    toast.success("Campos salvos com sucesso!");
  };

  const clearSavedFields = () => {
    if (!isCompetenciaForm) return;
    
    localStorage.removeItem(storageKey);
    setFormValues({ Colaborador: username });
    toast.success("Campos limpos com sucesso!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("🔍 Iniciando envio do formulário...");
    console.log("📝 Form Name:", formName);
    console.log("👤 Username:", username);
    console.log("📊 Form Values:", formValues);
    
    // Validar campos obrigatórios (exceto Observações, campos opcionais e campos condicionais não visíveis)
    const optionalFields = sectionConfig?.optionalFields || [];
    const conditionalFields = sectionConfig?.conditionalFields || {};
    
    const emptyFields = fields.filter(field => {
      // Ignorar Observações
      if (field === "Observações") return false;
      // Ignorar campos opcionais
      if (optionalFields.includes(field)) return false;
      
      // Verificar se é um campo condicional
      const conditionalConfig = conditionalFields[field];
      if (conditionalConfig) {
        const dependsOnValue = formValues[conditionalConfig.dependsOn];
        const showWhenValues = Array.isArray(conditionalConfig.showWhen) 
          ? conditionalConfig.showWhen 
          : [conditionalConfig.showWhen];
        
        // Se o campo não está visível, ignorar na validação
        if (!showWhenValues.includes(dependsOnValue)) {
          return false;
        }
      }
      
      // Verificar se está vazio
      return !formValues[field];
    });

    if (emptyFields.length > 0) {
      console.log("❌ Campos vazios:", emptyFields);
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const sessionKey = getSessionKey(formName);
      console.log("🔑 Session Key:", sessionKey);
      
      // Obter usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }
      
      // Obter o próximo número de linha
      const { data: existingData, error: fetchError } = await supabase
        .from("forms_submissions")
        .select("line_number")
        .eq("session_key", sessionKey)
        .order("line_number", { ascending: false })
        .limit(1);

      console.log("📥 Existing Data:", existingData);
      console.log("❓ Fetch Error:", fetchError);

      if (fetchError) {
        console.error("❌ Erro ao buscar dados existentes:", fetchError);
        throw fetchError;
      }

      const nextLineNumber = existingData && existingData.length > 0 
        ? existingData[0].line_number + 1 
        : 1;

      console.log("🔢 Next Line Number:", nextLineNumber);

      // Inserir dados na tabela forms_submissions
      const insertPayload = {
        user_id: user.id,
        form_name: formName,
        session_key: sessionKey,
        line_number: nextLineNumber,
        form_data: formValues,
      };
      
      console.log("📤 Insert Payload:", insertPayload);

      const { data: insertData, error: insertError } = await supabase
        .from("forms_submissions")
        .insert(insertPayload)
        .select();

      console.log("✅ Insert Data:", insertData);
      console.log("❓ Insert Error:", insertError);

      if (insertError) {
        console.error("❌ Erro ao inserir dados:", insertError);
        throw insertError;
      }

      // Salvar registro na tabela de auditoria
      if (insertData && insertData.length > 0) {
        const registroPayload = {
          submission_id: insertData[0].id,
          user_id: user.id,
          user_name: username,
          session_key: sessionKey,
          form_name: formName,
          line_number: nextLineNumber,
          form_data: formValues,
        };

        const { error: registroError } = await supabase
          .from("forms_registry")
          .insert(registroPayload);

        if (registroError) {
          console.error("⚠️ Erro ao salvar registro:", registroError);
          // Não bloquear o fluxo se falhar o registro
        }
      }

      // Enviar WhatsApp automaticamente se for CERTIFICAÇÃO e Atividade = "Enviado à certificadora"
      if (isCertificacaoForm && formValues["Atividade"] === "Enviado à certificadora") {
        const telefone = formValues["Telefone WhatsApp"];
        const nomeAluno = formValues["Aluno"];
        const nomeCurso = formValues["Curso"];
        const nivelEnsino = formValues["Nível de Ensino"];

        if (telefone && nomeAluno && nomeCurso && nivelEnsino) {
          console.log("📱 Enviando WhatsApp para a certificadora...");
          await sendMessage({
            phone: telefone,
            nomeAluno,
            nomeCurso,
            nivelEnsino,
            dadosExtras: formValues
          });
        }
      }

      toast.success("✅ Dados salvos com sucesso!");
      
      // Para COMPETÊNCIA, salvar automaticamente os campos após envio
      // Para outros forms, limpar o formulário
      if (isCompetenciaForm) {
        saveSelectableFields();
        // Limpar apenas Observações
        setFormValues(prev => ({ ...prev, Observações: "" }));
      } else {
        // Manter Plataforma global se existir
        const savedPlataforma = localStorage.getItem(globalPlataformaKey);
        const resetValues: Record<string, string> = { Colaborador: username };
        
        // Adicionar Data automaticamente se o campo existir
        if (fields.includes("Data")) {
          const today = new Date().toISOString().split('T')[0];
          resetValues.Data = today;
        }
        
        // Manter Plataforma global se o campo existir e houver valor salvo
        if (fields.includes("Plataforma") && savedPlataforma) {
          resetValues.Plataforma = savedPlataforma;
        }
        
        setFormValues(resetValues);
      }
    } catch (error: any) {
      console.error("❌ Erro completo:", error);
      console.error("📋 Error details:", JSON.stringify(error, null, 2));
      toast.error("Erro ao salvar dados: " + (error.message || "Erro desconhecido"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormValues(prev => {
      const newValues = { ...prev, [field]: value };
      
      // Se o campo alterado for "Nível de Ensino", limpar o campo "Curso"
      if (field === "Nível de Ensino") {
        newValues["Curso"] = "";
        console.log("🎓 Nível de Ensino selecionado:", value);
        console.log("📚 Cursos disponíveis:", nivelEnsinoCursoMap[value] || "Nenhum");
      }
      
      // Se Plataforma mudar, salvar globalmente
      if (field === "Plataforma") {
        localStorage.setItem(globalPlataformaKey, value);
      }
      
      return newValues;
    });
  };

  const getFieldType = (field: string): string => {
    // Buscar tipo específico da seção primeiro
    if (sectionConfig?.fieldTypes?.[field]) {
      return sectionConfig.fieldTypes[field];
    }
    return "text";
  };

  const getSelectOptions = (field: string): string[] => {
    // Buscar opções específicas da seção primeiro
    if (sectionConfig?.selectOptions?.[field]) {
      return sectionConfig.selectOptions[field];
    }
    
    // Usar listas globais para Polo
    if (field === "Polo") {
      return globalPoloOptions;
    }
    
    // Para o campo Curso, filtrar baseado no Nível de Ensino selecionado
    if (field === "Curso") {
      const nivelEnsinoSelecionado = formValues["Nível de Ensino"];
      
      // Se houver um nível de ensino selecionado e existe mapeamento para ele
      if (nivelEnsinoSelecionado && nivelEnsinoCursoMap[nivelEnsinoSelecionado]) {
        return nivelEnsinoCursoMap[nivelEnsinoSelecionado];
      }
      
      // Se não houver nível selecionado, retornar lista vazia para forçar seleção do nível primeiro
      if (!nivelEnsinoSelecionado) {
        return [];
      }
      
      // Fallback para lista global se o nível não tiver mapeamento específico
      return globalCursoOptions;
    }
    
    // Fallback para opções globais
    return globalSelectOptions[field] || [];
  };

  const renderField = (field: string) => {
    const fieldType = getFieldType(field);
    const isColaborador = field === "Colaborador";
    
    // Campo especial para blocos de documentos na SECRETARIA ACADÊMICA
    if (fieldType === "document-blocks") {
      const availableDocuments = getSelectOptions(field);
      let parsedValue = [];
      
      try {
        const rawValue = formValues[field];
        if (typeof rawValue === "string") {
          parsedValue = JSON.parse(rawValue);
        } else if (Array.isArray(rawValue)) {
          parsedValue = rawValue;
        }
      } catch (e) {
        parsedValue = [];
      }
      
      return (
        <DocumentStatusBlocks
          value={parsedValue}
          onChange={(blocks) => handleChange(field, JSON.stringify(blocks))}
          availableDocuments={availableDocuments}
        />
      );
    }
    
    // Lógica especial para o campo Média no formulário PEDAGÓGICO
    const isPedagogicoForm = formName === "PEDAGÓGICO";
    const isMediaField = field === "Média";
    const statusAprovado = formValues["Status"] === "Aprovado";

    if (fieldType === "textarea") {
      return (
        <Textarea
          id={field}
          value={formValues[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={`Digite ${field.toLowerCase()}`}
          className="min-h-[120px] resize-none bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
        />
      );
    }

    if (fieldType === "select") {
      const options = getSelectOptions(field);
      
      // Validação especial para o campo Curso
      if (field === "Curso") {
        const nivelEnsinoSelecionado = formValues["Nível de Ensino"];
        
        // Se não houver nível de ensino selecionado
        if (!nivelEnsinoSelecionado) {
          return (
            <div className="text-sm text-muted-foreground italic p-4 border border-dashed border-border/50 rounded-xl bg-secondary/20">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary/60" />
                Selecione primeiro o Nível de Ensino para visualizar os cursos disponíveis
              </span>
            </div>
          );
        }
        
        // Se houver nível selecionado mas não houver cursos disponíveis
        if (options.length === 0) {
          return (
            <div className="text-sm text-muted-foreground italic p-4 border border-dashed border-border/50 rounded-xl bg-secondary/20">
              Nenhum curso disponível para este nível de ensino.
            </div>
          );
        }
      }
      
      return (
        <Combobox
          options={options}
          value={formValues[field] || ""}
          onValueChange={(value) => handleChange(field, value)}
          placeholder={`Selecione ${field.toLowerCase()}`}
          searchPlaceholder="Pesquisar..."
          emptyText="Nenhuma opção encontrada."
        />
      );
    }

    // Para o campo Média no PEDAGÓGICO, desabilitar se Status não for "Aprovado"
    if (isPedagogicoForm && isMediaField) {
      return (
        <div className="space-y-2">
          <Input
            id={field}
            type={fieldType}
            value={formValues[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={statusAprovado ? "Digite a média" : "Selecione Status = Aprovado primeiro"}
            disabled={!statusAprovado}
            className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            min="0"
            max="10"
            step="0.1"
          />
          {!statusAprovado && (
            <p className="text-xs text-muted-foreground/70 italic flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              O campo Média só pode ser preenchido quando o Status for "Aprovado"
            </p>
          )}
        </div>
      );
    }

    return (
      <Input
        id={field}
        type={fieldType}
        value={formValues[field] || ""}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={isColaborador ? username : `Digite ${field.toLowerCase()}`}
        disabled={isColaborador}
        className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      />
    );
  };

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="absolute top-20 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '-3s' }} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2 hover:bg-secondary/50 hover:text-primary transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Voltar
        </Button>

        {/* Main card */}
        <Card className="glass-strong shadow-2xl border-0 animate-fade-in overflow-hidden">
          {/* Header gradient accent */}
          <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
          
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/10">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                    {formName}
                  </CardTitle>
                </div>
                <CardDescription className="text-base text-muted-foreground/80">
                  Preencha os campos abaixo com as informações solicitadas
                </CardDescription>
              </div>
              
              {isCompetenciaForm && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={saveSelectableFields}
                    className="shrink-0 gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                    title="Salvar campos"
                  >
                    <Save className="w-4 h-4" />
                    <span className="text-xs font-medium">Salvar</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSavedFields}
                    className="shrink-0 gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                    title="Limpar campos salvos"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Limpar</span>
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field, index) => {
                  // Verificar se o campo é condicional
                  const conditionalConfig = sectionConfig?.conditionalFields?.[field];
                  if (conditionalConfig) {
                    const dependsOnValue = formValues[conditionalConfig.dependsOn];
                    const showWhenValues = Array.isArray(conditionalConfig.showWhen) 
                      ? conditionalConfig.showWhen 
                      : [conditionalConfig.showWhen];
                    
                    // Se o valor do campo dependente não corresponde, não renderizar
                    if (!showWhenValues.includes(dependsOnValue)) {
                      return null;
                    }
                  }

                  return (
                    <div
                      key={field}
                      className={`space-y-2 animate-fade-in ${
                        getFieldType(field) === "textarea" || 
                        getFieldType(field) === "document-blocks" ||
                        field === "Central de Atendimento aos Licenciados"
                          ? "md:col-span-2"
                          : ""
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {getFieldType(field) !== "document-blocks" && (
                        <Label 
                          htmlFor={field} 
                          className="text-sm font-semibold text-foreground/90 flex items-center gap-1"
                        >
                          {field}
                          {field !== "Observações" && !sectionConfig?.optionalFields?.includes(field) && (
                            <span className="text-destructive text-base">*</span>
                          )}
                        </Label>
                      )}
                      {renderField(field)}
                      {field === "Colaborador" && (
                        <p className="text-xs text-muted-foreground/60 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          Preenchido automaticamente com seu usuário
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  type="submit"
                  className="flex-1 h-14 text-base font-bold gap-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
                  disabled={isSubmitting || isWhatsappLoading}
                >
                  {isSubmitting || isWhatsappLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Formulário
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DynamicForm;
