
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "@/components/NavigationBar";
import { PageHeader } from "@/components/PageHeader";
import { SubProcessDialog } from "@/components/SubProcessDialog";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { SubProcessService } from "@/services/subprocess.service";
import { ProcessService } from "@/services/process.service";
import { SubProcess, Process, CreateSubProcessDto, UpdateSubProcessDto } from "@/types/api.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MoveUp, MoveDown, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const SubProcesses = () => {
  const navigate = useNavigate();
  const [subprocesses, setSubprocesses] = useState<SubProcess[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentSubprocess, setCurrentSubprocess] = useState<SubProcess | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProcesses();
    fetchSubprocesses();
  }, []);

  const fetchProcesses = async () => {
    try {
      const data = await ProcessService.getAll();
      setProcesses(data);
    } catch (error) {
      console.error("Error fetching processes:", error);
    }
  };

  const fetchSubprocesses = async () => {
    setIsLoading(true);
    try {
      const data = await SubProcessService.getAll();
      // Sort by process and then by order
      data.sort((a, b) => {
        if (a.processId !== b.processId) {
          return a.processId - b.processId;
        }
        return (a.order || 0) - (b.order || 0);
      });
      setSubprocesses(data);
    } catch (error) {
      console.error("Error fetching subprocesses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProcessName = (processId: number) => {
    const process = processes.find(p => p.id === processId);
    return process ? process.name : "Processo desconhecido";
  };

  const handleAddClick = () => {
    setCurrentSubprocess(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (subprocess: SubProcess) => {
    setCurrentSubprocess(subprocess);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleChangeOrder = async (subprocess: SubProcess, direction: 'up' | 'down') => {
    const currentOrder = subprocess.order || 0;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    if (newOrder < 0) return;
    
    try {
      await SubProcessService.update(subprocess.id, { order: newOrder });
      toast.success("Ordem atualizada com sucesso!");
      fetchSubprocesses();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Erro ao atualizar ordem.");
    }
  };

  const handleDialogSubmit = async (data: CreateSubProcessDto | UpdateSubProcessDto) => {
    try {
      if (currentSubprocess) {
        await SubProcessService.update(currentSubprocess.id, data as UpdateSubProcessDto);
        toast.success("Subprocesso atualizado com sucesso!");
      } else {
        await SubProcessService.create(data as CreateSubProcessDto);
        toast.success("Subprocesso criado com sucesso!");
      }
      fetchSubprocesses();
    } catch (error) {
      console.error("Error submitting subprocess:", error);
      toast.error("Erro ao salvar subprocesso.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingId === null) return;
    
    setIsDeleting(true);
    try {
      await SubProcessService.delete(deletingId);
      toast.success("Subprocesso excluído com sucesso!");
      fetchSubprocesses();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting subprocess:", error);
      toast.error("Erro ao excluir subprocesso.");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  // Group subprocesses by process
  const groupedSubprocesses = subprocesses.reduce((acc, subprocess) => {
    const processId = subprocess.processId;
    if (!acc[processId]) {
      acc[processId] = [];
    }
    acc[processId].push(subprocess);
    return acc;
  }, {} as Record<number, SubProcess[]>);

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <PageHeader 
          title="Subprocessos" 
          description="Gerencie os subprocessos da sua organização."
          onAdd={handleAddClick}
          addButtonText="Novo Subprocesso"
        />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando subprocessos...</p>
          </div>
        ) : Object.keys(groupedSubprocesses).length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum subprocesso encontrado.</p>
              <Button onClick={handleAddClick}>Adicionar Subprocesso</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8 mt-8">
            {Object.entries(groupedSubprocesses).map(([processId, items]) => (
              <Card key={processId} className="overflow-hidden">
                <CardHeader className="bg-brand-50 dark:bg-brand-900/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-semibold">
                        {getProcessName(parseInt(processId))}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">
                        {items.length} subprocesso{items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/processes?processId=${processId}`)}
                    >
                      Ver Processo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {items.map((subprocess, index) => (
                      <div 
                        key={subprocess.id} 
                        className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                      >
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-50 text-brand-700 border-brand-200">
                            {subprocess.order || index + 1}
                          </Badge>
                          <div>
                            <h4 className="font-medium">{subprocess.name}</h4>
                            {subprocess.description && (
                              <p className="text-sm text-muted-foreground mt-1">{subprocess.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleChangeOrder(subprocess, 'up')}
                            className="h-8 w-8"
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleChangeOrder(subprocess, 'down')}
                            className="h-8 w-8"
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditClick(subprocess)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteClick(subprocess.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <SubProcessDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        subprocess={currentSubprocess}
        processes={processes}
      />

      <DeleteConfirmation
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Subprocesso"
        description="Tem certeza que deseja excluir este subprocesso? Esta ação não pode ser desfeita."
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default SubProcesses;
