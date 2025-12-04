import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, FileCheck, FileX, File, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentBlock {
  id: string;
  document: string;
  status: string;
}

interface DocumentStatusBlocksProps {
  value: DocumentBlock[];
  onChange: (blocks: DocumentBlock[]) => void;
  availableDocuments: string[];
}

export const DocumentStatusBlocks = ({
  value,
  onChange,
  availableDocuments,
}: DocumentStatusBlocksProps) => {
  const [blocks, setBlocks] = useState<DocumentBlock[]>(
    value.length > 0 ? value : [{ id: crypto.randomUUID(), document: "", status: "" }]
  );

  const updateBlocks = (newBlocks: DocumentBlock[]) => {
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const addBlock = () => {
    const newBlock: DocumentBlock = {
      id: crypto.randomUUID(),
      document: "",
      status: "",
    };
    updateBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    if (blocks.length === 1) return; // Manter pelo menos um bloco
    updateBlocks(blocks.filter((block) => block.id !== id));
  };

  const updateBlock = (id: string, field: "document" | "status", value: string) => {
    updateBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, [field]: value } : block
      )
    );
  };

  const getAvailableDocumentsForBlock = (currentBlockId: string) => {
    const selectedDocuments = blocks
      .filter((block) => block.id !== currentBlockId && block.document)
      .map((block) => block.document);
    return availableDocuments.filter((doc) => !selectedDocuments.includes(doc));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <FileCheck className="w-4 h-4 text-emerald-500" />;
      case "Negado":
        return <FileX className="w-4 h-4 text-destructive" />;
      default:
        return <File className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "border-emerald-500/30 bg-emerald-500/10";
      case "Negado":
        return "border-destructive/30 bg-destructive/10";
      default:
        return "border-border/50 bg-secondary/30";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/10">
          <File className="w-4 h-4 text-primary" />
        </div>
        <Label className="text-base font-semibold text-foreground/90">Documentos</Label>
        <span className="text-xs text-muted-foreground/60 ml-auto">
          {blocks.filter(b => b.document && b.status).length} de {availableDocuments.length} documentos
        </span>
      </div>
      
      {/* Document blocks */}
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className={`relative flex flex-col sm:flex-row gap-4 p-5 rounded-xl border transition-all duration-300 hover:shadow-md animate-fade-in ${getStatusBadgeClass(block.status)}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Block number indicator */}
            <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg">
              {index + 1}
            </div>

            {/* Document select */}
            <div className="flex-1 space-y-2">
              <Label htmlFor={`doc-${block.id}`} className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary/60" />
                Documento
              </Label>
              <Select
                value={block.document}
                onValueChange={(value) => updateBlock(block.id, "document", value)}
              >
                <SelectTrigger 
                  id={`doc-${block.id}`} 
                  className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                >
                  <SelectValue placeholder="Selecione um documento" />
                </SelectTrigger>
                <SelectContent className="bg-popover/95 backdrop-blur-xl border-border/50 shadow-xl z-50">
                  {getAvailableDocumentsForBlock(block.id).map((doc) => (
                    <SelectItem 
                      key={doc} 
                      value={doc}
                      className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <File className="w-3.5 h-3.5 text-muted-foreground" />
                        {doc}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status select */}
            <div className="flex-1 space-y-2">
              <Label htmlFor={`status-${block.id}`} className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
                {getStatusIcon(block.status)}
                Status
              </Label>
              <Select
                value={block.status}
                onValueChange={(value) => updateBlock(block.id, "status", value)}
              >
                <SelectTrigger 
                  id={`status-${block.id}`} 
                  className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                >
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-popover/95 backdrop-blur-xl border-border/50 shadow-xl z-50">
                  <SelectItem 
                    value="Aprovado"
                    className="hover:bg-emerald-500/10 focus:bg-emerald-500/10 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Aprovado
                    </span>
                  </SelectItem>
                  <SelectItem 
                    value="Negado"
                    className="hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileX className="w-3.5 h-3.5 text-destructive" />
                      Negado
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Delete button */}
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeBlock(block.id)}
                disabled={blocks.length === 1}
                className="shrink-0 h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30 transition-all duration-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add button */}
      <Button
        type="button"
        variant="outline"
        onClick={addBlock}
        className="w-full sm:w-auto gap-2 border-dashed border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 text-primary/80 hover:text-primary transition-all duration-300"
        disabled={blocks.length >= availableDocuments.length}
      >
        <Plus className="h-4 w-4" />
        Adicionar outro documento
      </Button>

      {/* Info text when all documents are added */}
      {blocks.length >= availableDocuments.length && (
        <p className="text-xs text-muted-foreground/60 italic flex items-center gap-1.5 animate-fade-in">
          <Sparkles className="w-3 h-3" />
          Todos os documentos disponíveis foram adicionados
        </p>
      )}
    </div>
  );
};