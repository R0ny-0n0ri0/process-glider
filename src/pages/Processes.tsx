
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavigationBar } from "@/components/NavigationBar";
import { PageHeader } from "@/components/PageHeader";
import { ProcessDialog } from "@/components/ProcessDialog";
import { SubProcessDialog } from "@/components/SubProcessDialog";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { ProcessCard } from "@/components/ProcessCard";
import { ProcessService } from "@/services/process.service";
import { DepartmentService } from "@/services/department.service";
import { SubProcessService } from "@/services/subprocess.service";
import { Process, Department, CreateProcessDto, UpdateProcessDto, CreateSubProcessDto } from "@/types/api.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Processes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialDepartmentId = queryParams.get('departmentId');

  const [processes, setProcesses] = useState<Process[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(initialDepartmentId);
  const [isLoading, setIsLoading] = useState(true);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [subprocessDialogOpen, setSubprocessDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentProcess, setCurrentProcess] = useState<Process | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState<number | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (departments.length > 0) {
      fetchProcesses();
    }
  }, [departments, selectedDepartmentId]);

  const fetchDepartments = async () => {
    try {
      const data = await DepartmentService.getAll();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchProcesses = async () => {
    setIsLoading(true);
    try {
      let data: Process[];
      if (selectedDepartmentId) {
        data = await ProcessService.getByDepartmentId(parseInt(selectedDepartmentId));
      } else {
        data = await ProcessService.getAll();
      }
      
      // Fetch subprocesses for each process
      for (const process of data) {
        try {
          const subprocesses = await SubProcessService.getByProcessId(process.id);
          process.subProcesses = subprocesses.sort((a, b) => (a.order || 0) - (b.order || 0));
        } catch (error) {
          console.error(`Error fetching subprocesses for process ${process.id}:`, error);
        }
      }
      
      setProcesses(data);
    } catch (error) {
      console.error("Error fetching processes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartmentId(value);
    
    // Update the URL with the new department ID without reloading the page
    const newUrl = value 
      ? `${location.pathname}?departmentId=${value}` 
      : location.pathname;
    
    navigate(newUrl, { replace: true });
  };

  const handleAddProcessClick = () => {
    setCurrentProcess(undefined);
    setProcessDialogOpen(true);
  };

  const handleEditProcessClick = (process: Process) => {
    setCurrentProcess(process);
    setProcessDialogOpen(true);
  };

  const handleDeleteProcessClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleAddSubprocessClick = (processId: number) => {
    setSelectedProcessId(processId);
    setSubprocessDialogOpen(true);
  };

  const handleProcessDialogSubmit = async (data: CreateProcessDto | UpdateProcessDto) => {
    try {
      if (currentProcess) {
        await ProcessService.update(currentProcess.id, data as UpdateProcessDto);
        toast.success("Processo atualizado com sucesso!");
      } else {
        await ProcessService.create(data as CreateProcessDto);
        toast.success("Processo criado com sucesso!");
      }
      fetchProcesses();
    } catch (error) {
      console.error("Error submitting process:", error);
      toast.error("Erro ao salvar processo.");
    }
  };

  const handleSubprocessDialogSubmit = async (data: CreateSubProcessDto) => {
    try {
      await SubProcessService.create(data);
      toast.success("Subprocesso criado com sucesso!");
      fetchProcesses();
    } catch (error) {
      console.error("Error submitting subprocess:", error);
      toast.error("Erro ao criar subprocesso.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingId === null) return;
    
    setIsDeleting(true);
    try {
      await ProcessService.delete(deletingId);
      toast.success("Processo excluído com sucesso!");
      fetchProcesses();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting process:", error);
      toast.error("Erro ao excluir processo.");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <PageHeader 
          title="Processos" 
          description="Gerencie os processos da sua organização."
          onAdd={handleAddProcessClick}
          addButtonText="Novo Processo"
        />

        <div className="mt-6 mb-8 max-w-xs">
          <Label htmlFor="departmentFilter">Filtrar por Departamento</Label>
          <Select 
            value={selectedDepartmentId || ""} 
            onValueChange={handleDepartmentChange}
          >
            <SelectTrigger id="departmentFilter">
              <SelectValue placeholder="Todos os departamentos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os departamentos</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando processos...</p>
          </div>
        ) : processes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                {selectedDepartmentId 
                  ? "Nenhum processo encontrado para este departamento." 
                  : "Nenhum processo encontrado."}
              </p>
              <Button onClick={handleAddProcessClick}>Adicionar Processo</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {processes.map((process) => (
              <ProcessCard
                key={process.id}
                process={process}
                onEdit={handleEditProcessClick}
                onDelete={handleDeleteProcessClick}
                onAddSubprocess={handleAddSubprocessClick}
              />
            ))}
          </div>
        )}
      </div>

      <ProcessDialog
        isOpen={processDialogOpen}
        onClose={() => setProcessDialogOpen(false)}
        onSubmit={handleProcessDialogSubmit}
        process={currentProcess}
        departments={departments}
      />

      <SubProcessDialog
        isOpen={subprocessDialogOpen}
        onClose={() => setSubprocessDialogOpen(false)}
        onSubmit={handleSubprocessDialogSubmit}
        processes={processes}
        preselectedProcessId={selectedProcessId || undefined}
      />

      <DeleteConfirmation
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Processo"
        description="Tem certeza que deseja excluir este processo? Esta ação não pode ser desfeita e também excluirá todos os subprocessos relacionados."
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Processes;
