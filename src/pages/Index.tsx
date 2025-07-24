import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { WelcomeSection } from "@/components/WelcomeSection";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { BudgetDashboard } from "@/components/BudgetDashboard";
import { SimpleCalculator } from "@/components/SimpleCalculator";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { HelpSection } from "@/components/HelpSection";
import { HistorySection } from "@/components/HistorySection";
import { Clock, HelpCircle, X } from "lucide-react";
import { History } from "@/components/History";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [transcript, setTranscript] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [userEmail, setUserEmail] = useState(""); // ✅ User email from JWT
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/getUserData", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUserEmail(data.email);
        } else {
          console.error("User fetch failed:", data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleGetStarted = () => {
    setActiveSection("voice");
    setMobileMenuOpen(false);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <WelcomeSection onGetStarted={handleGetStarted} userEmail={userEmail} />;

      case "voice":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-senior-xl font-bold text-foreground">Voice Budget Input</h2>
              <p className="text-senior-base text-muted-foreground">
                Speak naturally about your income and expenses
              </p>
            </div>
            <VoiceRecorder />
            {transcript && (
              <Card className="p-4 bg-accent">
                <h3 className="text-senior-base font-medium text-accent-foreground mb-2">
                  Processing your input...
                </h3>
                <p className="text-senior-sm text-accent-foreground">AI is analyzing: "{transcript}"</p>
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
          <HistorySection/>
        );

      case "help":
        return (
          <HelpSection />
        );

      default:
        return <WelcomeSection onGetStarted={handleGetStarted} userEmail={userEmail} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} showMenuButton={true} />

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-card border-r border-border shadow-card">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-senior-lg font-semibold text-foreground">Menu</h2>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <Navigation activeSection={activeSection} onSectionChange={handleSectionChange} />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <Navigation activeSection={activeSection} onSectionChange={handleSectionChange} />
          </div>
          <div className="lg:col-span-3">
            <div className="w-full max-w-none">{renderContent()}</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
