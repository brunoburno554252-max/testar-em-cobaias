import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formsConfig, globalSelectOptions, globalPoloOptions, globalCursoOptions, nivelEnsinoCursoMap } from "@/mock/formsData";
import { toast } from "sonner";
import { ArrowLeft, Send, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { DocumentStatusBlocks } from "@/components/DocumentStatusBlocks";

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
  const storageKey = `saved_form_${getSessionKey(formName)}`;
  const globalPlataformaKey = 'global_plataforma_value';
  
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
    
    // Validar campos obrigatórios (exceto Observações e campos opcionais)
    const optionalFields = sectionConfig?.optionalFields || [];
    const emptyFields = fields.filter(
      field => field !== "Observações" && !optionalFields.includes(field) && !formValues[field]
    );

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
          className="min-h-[120px] resize-none"
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
            <div className="text-sm text-muted-foreground italic p-3 border border-dashed rounded-md">
              Selecione primeiro o Nível de Ensino para visualizar os cursos disponíveis
            </div>
          );
        }
        
        // Se houver nível selecionado mas não houver cursos disponíveis
        if (options.length === 0) {
          return (
            <div className="text-sm text-muted-foreground italic p-3 border border-dashed rounded-md">
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
        <div className="space-y-1">
          <Input
            id={field}
            type={fieldType}
            value={formValues[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={statusAprovado ? "Digite a média" : "Selecione Status = Aprovado primeiro"}
            disabled={!statusAprovado}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
            min="0"
            max="10"
            step="0.1"
          />
          {!statusAprovado && (
            <p className="text-xs text-muted-foreground italic">
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
        className="disabled:opacity-70 disabled:cursor-not-allowed"
      />
    );
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl">{formName}</CardTitle>
                <CardDescription className="text-base mt-2">
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
                    className="shrink-0 gap-2 text-muted-foreground hover:text-foreground"
                    title="Salvar campos"
                  >
                    <Save className="w-4 h-4" />
                    <span className="text-xs">Salvar</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSavedFields}
                    className="shrink-0 gap-2 text-muted-foreground hover:text-destructive"
                    title="Limpar campos salvos"
                  >
                    <span className="text-xs">Limpar</span>
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field) => (
                  <div
                    key={field}
                    className={
                      getFieldType(field) === "textarea" || 
                      getFieldType(field) === "document-blocks" ||
                      field === "Central de Atendimento aos Licenciados"
                        ? "md:col-span-2"
                        : ""
                    }
                  >
                    {getFieldType(field) !== "document-blocks" && (
                      <Label htmlFor={field} className="text-base mb-2 block">
                        {field}
                        {field !== "Observações" && !sectionConfig?.optionalFields?.includes(field) && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </Label>
                    )}
                    {renderField(field)}
                    {field === "Colaborador" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Preenchido automaticamente com seu usuário
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  variant="success"
                  className="flex-1 h-12 text-base font-semibold gap-2"
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Enviando..." : "Enviar Formulário"}
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
