/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Home, 
  Mic, 
  BarChart3, 
  History, 
  HelpCircle,
  Calculator
} from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "voice", label: "Voice Input", icon: Mic },
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "calculator", label: "Calculator", icon: Calculator },
  { id: "history", label: "History", icon: History },
  { id: "help", label: "Help", icon: HelpCircle },
];

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <Card className="p-4 bg-card border-border shadow-card">
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size="lg"
              onClick={() => onSectionChange(item.id)}
              className={`w-full justify-start text-senior-base h-14 transition-all duration-200 ${
                isActive 
                  ? "bg-gradient-primary text-primary-foreground shadow-gentle" 
                  : "hover:bg-secondary hover:text-secondary-foreground"
              }`}
            >
              <Icon className="h-6 w-6 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </Card>
  );
}