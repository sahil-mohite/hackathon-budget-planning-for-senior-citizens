import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { WelcomeSection } from "@/components/WelcomeSection";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { BudgetDashboard } from "@/components/BudgetDashboard";
import { SimpleCalculator } from "@/components/SimpleCalculator";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { HelpSection } from "@/components/HelpSection";
import { X } from "lucide-react";
import { History } from "@/components/History";
import { useNavigate } from "react-router";

// Types
interface FinancialDetails {
  additionalDetails: string;
  income: string;
  getsPension: boolean;
  pensionAmount: string;
  investsInStocks: boolean;
  yearlyStockInvestment: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string,
  address: string;
  phone: string;
  financialDetails: FinancialDetails;
}

const Index = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("home");
  const [transcript, setTranscript] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8050/getUserData", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(res.status==401){
          localStorage.removeItem('token')
          navigate('/login')
        }
        else{
          const data = await res.json();

          if (res.ok) {
            setUserData(data);
          } else {
            console.error("User fetch failed:", data);
          }
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
    if (userLoading) {
      return <p className="text-center text-muted-foreground">Loading user data...</p>;
    }

    switch (activeSection) {
      case "home":
        return (
          <WelcomeSection
            onGetStarted={handleGetStarted}
            firstName={userData?.firstName}
            secondName={userData?.lastName}
          />
        );

      case "voice":
        return <VoiceRecorder />;

      case "dashboard":
        return <BudgetDashboard />;

      case "calculator":
        return <SimpleCalculator />;

      case "history":
        return (
          <History />
        );

      case "help":
        return (
          <HelpSection />
        );

      default:
        return (
          <WelcomeSection
            onGetStarted={handleGetStarted}
            firstName={userData?.firstName}
            secondName={userData?.lastName}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} showMenuButton={true} userData={userData} />

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
