
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
import { SubProcess, CreateSubProcessDto, UpdateSubProcessDto, Process } from "@/types/api.types";

interface SubProcessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubProcessDto | UpdateSubProcessDto) => void;
  subprocess?: SubProcess;
  processes: Process[];
  preselectedProcessId?: number;
  title?: string;
}

export const SubProcessDialog = ({
  isOpen,
  onClose,
  onSubmit,
  subprocess,
  processes,
  preselectedProcessId,
  title = "Adicionar Subprocesso"
}: SubProcessDialogProps) => {
  const [formData, setFormData] = useState<CreateSubProcessDto | UpdateSubProcessDto>({
    name: "",
    description: "",
    processId: preselectedProcessId || processes[0]?.id || 0,
    order: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (subprocess) {
      setFormData({
        name: subprocess.name,
        description: subprocess.description || "",
        processId: subprocess.processId,
        order: subprocess.order || 0
      });
    } else {
      setFormData({
        name: "",
        description: "",
        processId: preselectedProcessId || processes[0]?.id || 0,
        order: 0
      });
    }
  }, [subprocess, processes, preselectedProcessId, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value
    }));
  };

  const handleProcessChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      processId: parseInt(value)
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{subprocess ? "Editar Subprocesso" : title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome do subprocesso"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="processId">Processo *</Label>
            <Select 
              value={formData.processId?.toString()} 
              onValueChange={handleProcessChange}
              disabled={!!preselectedProcessId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um processo" />
              </SelectTrigger>
              <SelectContent>
                {processes.map((proc) => (
                  <SelectItem key={proc.id} value={proc.id.toString()}>
                    {proc.name}
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
              placeholder="Descrição do subprocesso"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="order">Ordem</Label>
            <Input
              id="order"
              name="order"
              type="number"
              value={formData.order?.toString() || "0"}
              onChange={handleChange}
              placeholder="Ordem de exibição"
              min={0}
            />
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
              disabled={isSubmitting || !formData.name || !formData.processId}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
