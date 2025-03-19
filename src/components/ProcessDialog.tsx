
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Process, CreateProcessDto, UpdateProcessDto, Department } from "@/types/api.types";
import { X } from "lucide-react";

interface ProcessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProcessDto | UpdateProcessDto) => void;
  process?: Process;
  departments: Department[];
  title?: string;
}

export const ProcessDialog = ({
  isOpen,
  onClose,
  onSubmit,
  process,
  departments,
  title = "Adicionar Processo"
}: ProcessDialogProps) => {
  const [formData, setFormData] = useState<CreateProcessDto | UpdateProcessDto>({
    name: "",
    description: "",
    departmentId: departments[0]?.id || 0,
    tools: [],
    responsibles: [],
    documentation: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTool, setCurrentTool] = useState("");
  const [currentResponsible, setCurrentResponsible] = useState("");
  const [currentDocument, setCurrentDocument] = useState("");

  useEffect(() => {
    if (process) {
      setFormData({
        name: process.name,
        description: process.description || "",
        departmentId: process.departmentId,
        tools: process.tools || [],
        responsibles: process.responsibles || [],
        documentation: process.documentation || []
      });
    } else {
      setFormData({
        name: "",
        description: "",
        departmentId: departments[0]?.id || 0,
        tools: [],
        responsibles: [],
        documentation: []
      });
    }
  }, [process, departments, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      departmentId: parseInt(value)
    }));
  };

  const addTool = () => {
    if (currentTool.trim()) {
      setFormData((prev) => ({
        ...prev,
        tools: [...(prev.tools || []), currentTool.trim()]
      }));
      setCurrentTool("");
    }
  };

  const removeTool = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tools: (prev.tools || []).filter((_, i) => i !== index)
    }));
  };

  const addResponsible = () => {
    if (currentResponsible.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibles: [...(prev.responsibles || []), currentResponsible.trim()]
      }));
      setCurrentResponsible("");
    }
  };

  const removeResponsible = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibles: (prev.responsibles || []).filter((_, i) => i !== index)
    }));
  };

  const addDocument = () => {
    if (currentDocument.trim()) {
      setFormData((prev) => ({
        ...prev,
        documentation: [...(prev.documentation || []), currentDocument.trim()]
      }));
      setCurrentDocument("");
    }
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documentation: (prev.documentation || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{process ? "Editar Processo" : title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome do processo"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="departmentId">Departamento *</Label>
            <Select 
              value={formData.departmentId?.toString()} 
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descrição do processo"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Ferramentas Utilizadas</Label>
            <div className="flex">
              <Input
                value={currentTool}
                onChange={(e) => setCurrentTool(e.target.value)}
                placeholder="Adicionar ferramenta"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addTool} 
                className="ml-2"
                disabled={!currentTool.trim()}
              >
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tools?.map((tool, index) => (
                <div 
                  key={index} 
                  className="bg-muted text-muted-foreground px-3 py-1 rounded-full flex items-center text-sm"
                >
                  {tool}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 text-muted-foreground"
                    onClick={() => removeTool(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Responsáveis</Label>
            <div className="flex">
              <Input
                value={currentResponsible}
                onChange={(e) => setCurrentResponsible(e.target.value)}
                placeholder="Adicionar responsável"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addResponsible} 
                className="ml-2"
                disabled={!currentResponsible.trim()}
              >
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.responsibles?.map((responsible, index) => (
                <div 
                  key={index} 
                  className="bg-muted text-muted-foreground px-3 py-1 rounded-full flex items-center text-sm"
                >
                  {responsible}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 text-muted-foreground"
                    onClick={() => removeResponsible(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Documentação</Label>
            <div className="flex">
              <Input
                value={currentDocument}
                onChange={(e) => setCurrentDocument(e.target.value)}
                placeholder="Adicionar documento"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addDocument} 
                className="ml-2"
                disabled={!currentDocument.trim()}
              >
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.documentation?.map((doc, index) => (
                <div 
                  key={index} 
                  className="bg-muted text-muted-foreground px-3 py-1 rounded-full flex items-center text-sm"
                >
                  {doc}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 text-muted-foreground"
                    onClick={() => removeDocument(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.departmentId}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
