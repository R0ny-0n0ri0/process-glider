
import { Process, SubProcess } from "@/types/api.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ProcessCardProps {
  process: Process;
  onEdit?: (process: Process) => void;
  onDelete?: (id: number) => void;
  onAddSubprocess?: (processId: number) => void;
}

export const ProcessCard = ({
  process,
  onEdit,
  onDelete,
  onAddSubprocess
}: ProcessCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="process-card animate-fade-in w-full">
      <CardHeader className="process-card-header space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2 bg-brand-50 text-brand-700 border-brand-200">
              {process.department?.name || 'Departamento'}
            </Badge>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{process.name}</CardTitle>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onEdit(process)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDelete(process.id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {process.description && (
          <p className="text-muted-foreground">{process.description}</p>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {process.subProcesses && process.subProcesses.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {process.subProcesses.map((subprocess: SubProcess) => (
              <div key={subprocess.id} className="subprocess-item flex items-center justify-between">
                <span className="text-sm">{subprocess.name}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0" 
                  onClick={() => navigate(`/subprocesses/${subprocess.id}`)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground text-sm">
            Nenhum subprocesso encontrado
          </div>
        )}

        {process.tools && process.tools.length > 0 && (
          <>
            <Separator />
            <div className="p-4">
              <h4 className="text-sm font-medium mb-2">Ferramentas Utilizadas:</h4>
              <div className="flex flex-wrap gap-2">
                {process.tools.map((tool, index) => (
                  <Badge key={index} variant="secondary">{tool}</Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {process.responsibles && process.responsibles.length > 0 && (
          <>
            <Separator />
            <div className="p-4">
              <h4 className="text-sm font-medium mb-2">Responsáveis:</h4>
              <p className="text-sm text-muted-foreground">
                {process.responsibles.join(', ')}
              </p>
            </div>
          </>
        )}

        {onAddSubprocess && (
          <>
            <Separator />
            <div className="p-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => onAddSubprocess(process.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Subprocesso
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
