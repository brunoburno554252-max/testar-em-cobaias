import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
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

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Documentos</Label>
      
      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="flex flex-col sm:flex-row gap-3 p-4 border border-border rounded-lg bg-card"
        >
          <div className="flex-1 space-y-2">
            <Label htmlFor={`doc-${block.id}`} className="text-sm">
              Documento
            </Label>
            <Select
              value={block.document}
              onValueChange={(value) => updateBlock(block.id, "document", value)}
            >
              <SelectTrigger id={`doc-${block.id}`} className="bg-background">
                <SelectValue placeholder="Selecione um documento" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                {getAvailableDocumentsForBlock(block.id).map((doc) => (
                  <SelectItem key={doc} value={doc}>
                    {doc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <Label htmlFor={`status-${block.id}`} className="text-sm">
              Status
            </Label>
            <Select
              value={block.status}
              onValueChange={(value) => updateBlock(block.id, "status", value)}
            >
              <SelectTrigger id={`status-${block.id}`} className="bg-background">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Negado">Negado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeBlock(block.id)}
              disabled={blocks.length === 1}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addBlock}
        className="w-full sm:w-auto"
        disabled={blocks.length >= availableDocuments.length}
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar outro documento
      </Button>
    </div>
  );
};
