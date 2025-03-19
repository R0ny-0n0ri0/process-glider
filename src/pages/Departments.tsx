
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "@/components/NavigationBar";
import { PageHeader } from "@/components/PageHeader";
import { DepartmentDialog } from "@/components/DepartmentDialog";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { DepartmentService } from "@/services/department.service";
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from "@/types/api.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Departments = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await DepartmentService.getAll();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setCurrentDepartment(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (department: Department) => {
    setCurrentDepartment(department);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDialogSubmit = async (data: CreateDepartmentDto | UpdateDepartmentDto) => {
    try {
      if (currentDepartment) {
        await DepartmentService.update(currentDepartment.id, data as UpdateDepartmentDto);
        toast.success("Departamento atualizado com sucesso!");
      } else {
        await DepartmentService.create(data as CreateDepartmentDto);
        toast.success("Departamento criado com sucesso!");
      }
      fetchDepartments();
    } catch (error) {
      console.error("Error submitting department:", error);
      toast.error("Erro ao salvar departamento.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingId === null) return;
    
    setIsDeleting(true);
    try {
      await DepartmentService.delete(deletingId);
      toast.success("Departamento excluído com sucesso!");
      fetchDepartments();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Erro ao excluir departamento.");
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
          title="Departamentos" 
          description="Gerencie os departamentos da sua organização."
          onAdd={handleAddClick}
          addButtonText="Novo Departamento"
        />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando departamentos...</p>
          </div>
        ) : departments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum departamento encontrado.</p>
              <Button onClick={handleAddClick}>Adicionar Departamento</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {departments.map((department) => (
              <Card key={department.id} className="process-card">
                <CardHeader className="process-card-header space-y-1">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{department.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditClick(department)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteClick(department.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {department.description && (
                    <p className="text-muted-foreground">{department.description}</p>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/processes?departmentId=${department.id}`)}
                  >
                    Ver Processos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <DepartmentDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        department={currentDepartment}
      />

      <DeleteConfirmation
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Departamento"
        description="Tem certeza que deseja excluir este departamento? Esta ação não pode ser desfeita e também pode afetar processos relacionados."
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Departments;
