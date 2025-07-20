import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { WelcomeSection } from "@/components/WelcomeSection";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { BudgetDashboard } from "@/components/BudgetDashboard";
import { SimpleCalculator } from "@/components/SimpleCalculator";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Clock, FileText, HelpCircle, X } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [transcript, setTranscript] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    setActiveSection("voice");
    setMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <WelcomeSection onGetStarted={handleGetStarted} />;
      
      case "voice":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-senior-xl font-bold text-foreground">
                Voice Budget Input
              </h2>
              <p className="text-senior-base text-muted-foreground">
                Speak naturally about your income and expenses
              </p>
            </div>
            <VoiceRecorder onTranscript={setTranscript} />
            {transcript && (
              <Card className="p-4 bg-accent">
                <h3 className="text-senior-base font-medium text-accent-foreground mb-2">
                  Processing your input...
                </h3>
                <p className="text-senior-sm text-accent-foreground">
                  AI is analyzing: "{transcript}"
                </p>
              </Card>
            )}
          </div>
        );
      
      case "dashboard":
        return <BudgetDashboard />;
      
      case "calculator":
        return <SimpleCalculator />;
      
      case "history":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-senior-xl font-bold text-foreground flex items-center justify-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                Budget History
              </h2>
              <p className="text-senior-base text-muted-foreground">
                Review your past budget entries and spending patterns
              </p>
            </div>
            <Card className="p-8 text-center">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-senior-lg font-semibold text-foreground mb-2">
                History Coming Soon
              </h3>
              <p className="text-senior-base text-muted-foreground">
                Start recording your budget to see history here
              </p>
              <Button 
                onClick={() => setActiveSection("voice")} 
                className="mt-4 text-senior-base"
              >
                Record Your First Budget
              </Button>
            </Card>
          </div>
        );
      
      case "help":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-senior-xl font-bold text-foreground flex items-center justify-center gap-3">
                <HelpCircle className="h-8 w-8 text-primary" />
                Help & Support
              </h2>
              <p className="text-senior-base text-muted-foreground">
                Get help using BudgetWise Senior
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-senior-lg font-semibold text-foreground mb-4">
                  How to Use Voice Input
                </h3>
                <ul className="space-y-2 text-senior-base text-muted-foreground">
                  <li>• Click the microphone button</li>
                  <li>• Speak clearly about your expenses</li>
                  <li>• Example: "I spent $50 on groceries"</li>
                  <li>• The AI will organize your data</li>
                </ul>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-senior-lg font-semibold text-foreground mb-4">
                  Understanding Your Dashboard
                </h3>
                <ul className="space-y-2 text-senior-base text-muted-foreground">
                  <li>• View spending by category</li>
                  <li>• See trends with colored arrows</li>
                  <li>• Track monthly savings</li>
                  <li>• Monitor remaining budget</li>
                </ul>
              </Card>
            </div>
          </div>
        );
      
      default:
        return <WelcomeSection onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        showMenuButton={true}
      />
      
      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-card border-r border-border shadow-card">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-senior-lg font-semibold text-foreground">Menu</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <Navigation 
                activeSection={activeSection} 
                onSectionChange={handleSectionChange} 
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-1">
            <Navigation 
              activeSection={activeSection} 
              onSectionChange={handleSectionChange} 
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="w-full max-w-none">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
