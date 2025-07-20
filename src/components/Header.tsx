import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Globe, Bell, DollarSign, Menu } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationCenter } from "./NotificationCenter";
import { SettingsPanel } from "./SettingsPanel";

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuToggle, showMenuButton = false }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  
  const unreadNotifications = 2; // This would come from your notification state

  return (
    <>
      <header className="bg-card border-b border-border shadow-gentle sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button + Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              {showMenuButton && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onMenuToggle}
                  className="lg:hidden p-2"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 sm:h-7 sm:w-7 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-senior-base sm:text-senior-lg font-bold text-foreground">
                    BudgetWise Senior
                  </h1>
                  <p className="text-senior-sm text-muted-foreground hidden md:block">
                    Your Smart Budget Assistant
                  </p>
                </div>
                {/* Mobile title */}
                <div className="sm:hidden">
                  <h1 className="text-senior-sm font-bold text-foreground">
                    BudgetWise
                  </h1>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <div onClick={() => setShowLanguageSelector(!showLanguageSelector)}>
                <LanguageSelector />
              </div>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="relative p-2"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="p-2"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Panels */}
      <div className="relative">
        {showNotifications && (
          <div className="fixed top-16 right-4 z-50 lg:absolute lg:top-0 lg:right-0">
            <NotificationCenter 
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        )}
        
        {showSettings && (
          <div className="fixed inset-0 z-50 lg:absolute lg:top-0 lg:right-0">
            <SettingsPanel 
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
            />
          </div>
        )}
      </div>
    </>
  );
}