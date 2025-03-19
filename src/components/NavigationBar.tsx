
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Building2, 
  LayoutGrid, 
  ListTodo, 
  Menu, 
  X,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      title: "Departamentos",
      path: "/departments",
      icon: <Building2 className="h-5 w-5 mr-2" />
    },
    {
      title: "Processos",
      path: "/processes",
      icon: <LayoutGrid className="h-5 w-5 mr-2" />
    },
    {
      title: "Subprocessos",
      path: "/subprocesses",
      icon: <ListTodo className="h-5 w-5 mr-2" />
    }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="z-10 border-b bg-white/90 backdrop-blur-sm dark:bg-gray-950/90 sticky top-0">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-brand-600 dark:text-brand-400 font-bold text-xl">ProcessFlow</span>
            </a>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname.includes(item.path) ? "default" : "ghost"}
                  className={cn(
                    "flex items-center transition-all",
                    location.pathname.includes(item.path) 
                      ? "bg-brand-100 text-brand-700 hover:bg-brand-200" 
                      : "hover:bg-brand-50 hover:text-brand-600"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  {item.title}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left hover:bg-brand-50 hover:text-brand-600",
                  location.pathname.includes(item.path) && "bg-brand-100 text-brand-700"
                )}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
              >
                {item.icon}
                {item.title}
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
