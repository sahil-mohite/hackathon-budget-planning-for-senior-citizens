import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, BarChart3, Shield, Globe } from "lucide-react";

interface WelcomeSectionProps {
  onGetStarted: () => void;
}

export function WelcomeSection({ onGetStarted }: WelcomeSectionProps) {
  const features = [
    {
      icon: Mic,
      title: "Voice Control",
      description: "Simply speak your expenses - no typing needed",
    },
    {
      icon: BarChart3,
      title: "Smart Insights",
      description: "AI-powered budget analysis and recommendations",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is protected and private",
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Available in your preferred language",
    },
  ];

  return (
    <div className="space-y-12"> {/* increased spacing */}
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-senior-2xl font-bold text-foreground">
            Welcome to BudgetWise Senior
          </h1>
          <p className="text-senior-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your monthly budget effortlessly with voice assistance and AI-powered insights designed specifically for seniors.
          </p>
        </div>

        <div className="flex justify-center mt-6">
  <Button
    onClick={onGetStarted}
    size="lg"
    className="h-16 px-10 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 flex items-center justify-center space-x-3"
  >
    <Mic className="h-5 w-5" />
    <span>Get Started with Voice</span>
  </Button>
</div>

      </div>

      {/* Features Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 px-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="p-8 hover:shadow-gentle transition-all duration-300 bg-gradient-subtle border-border"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-senior-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-senior-base text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto px-4">
  {features.map((feature, index) => {
    const Icon = feature.icon;
    return (
      <Card
        key={index}
        className="flex flex-col items-center text-center p-6 rounded-2xl border border-[#C8F7DC] shadow-md bg-white transition-transform hover:scale-[1.02]"
        style={{ height: "180px", minWidth: "240px" }}
      >
        <div className="w-12 h-12 mb-3 bg-[#E6F9EF] rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="font-semibold text-[17px] text-gray-900">{feature.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
      </Card>
    );
  })}
</div>

      
      {/* Quick Start Tips */}
      <Card className="p-6 bg-accent border-border mx-4">
        <div className="space-y-4">
          <h3 className="text-senior-lg font-semibold text-accent-foreground">
            Quick Start Tips
          </h3>
          <div className="space-y-3">
            {[
              "Click \"Voice Input\" and tell us about your monthly income and expenses",
              "View your personalized dashboard with spending insights",
              "Track your spending history and get AI-powered recommendations",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {i + 1}
                </div>
                <p className="text-senior-base text-accent-foreground">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
