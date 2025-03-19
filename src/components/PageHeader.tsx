
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  onAdd?: () => void;
  addButtonText?: string;
}

export const PageHeader = ({
  title,
  description,
  onAdd,
  addButtonText = "Adicionar"
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 animate-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {onAdd && (
        <Button 
          onClick={onAdd} 
          className="mt-4 md:mt-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          {addButtonText}
        </Button>
      )}
    </div>
  );
};
