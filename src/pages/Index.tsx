
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <NavigationBar />
      
      <div className="container max-w-6xl mx-auto px-4 py-16 flex-1 flex flex-col">
        <main className={`flex-1 flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center max-w-3xl mx-auto">
            <div className="glass-panel inline-block px-3 py-1 rounded-full text-sm text-brand-600 font-medium mb-6">
              Gerenciamento de Processos
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-6">
              Organize seus processos e fluxos de trabalho
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Mapeie processos, organize subprocessos e mantenha o controle das ferramentas e responsáveis em um único lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-brand-600 hover:bg-brand-700 text-white"
                onClick={() => navigate('/departments')}
              >
                Começar agora
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/processes')}
              >
                Ver processos
              </Button>
            </div>
          </div>
        </main>

        <footer className="mt-auto pt-8 pb-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ProcessFlow - Gerenciamento de Processos</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
