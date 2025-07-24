import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, BarChart3, Shield, Globe } from "lucide-react";

interface WelcomeSectionProps {
  onGetStarted: () => void;
  firstName?: string;
  secondName?: string;
}

export function WelcomeSection({ onGetStarted, firstName, secondName }: WelcomeSectionProps) {
  const features = [
    {
      icon: Mic,
      title: "Voice Control",
      description: "Simply speak your expenses - no typing needed"
    },
    {
      icon: BarChart3,
      title: "Smart Insights",
      description: "AI-powered budget analysis and recommendations"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is protected and private"
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Available in your preferred language"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-senior-2xl font-bold text-foreground">
            Hi {firstName} {secondName}, Welcome to BudgetWise Senior
          </h1>
          <p className="text-senior-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your monthly budget effortlessly with voice assistance and AI-powered insights designed specifically for seniors.
          </p>
        </div>
        
        <Button 
          onClick={onGetStarted}
          size="lg"
          className="h-16 px-12 text-senior-lg font-semibold bg-gradient-primary hover:shadow-gentle transition-all duration-300"
        >
          <Mic className="h-6 w-6 mr-3" />
          Get Started with Voice
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={index} 
              className="p-6 hover:shadow-gentle transition-all duration-300 bg-gradient-subtle border-border"
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
      </div>

      {/* Quick Start Tips */}
      <Card className="p-6 bg-accent border-border">
        <div className="space-y-4">
          <h3 className="text-senior-lg font-semibold text-accent-foreground">
            Quick Start Tips
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                1
              </div>
              <p className="text-senior-base text-accent-foreground">
                Click "Voice Input" and tell us about your monthly income and expenses
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                2
              </div>
              <p className="text-senior-base text-accent-foreground">
                View your personalized dashboard with spending insights
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                3
              </div>
              <p className="text-senior-base text-accent-foreground">
                Track your spending history and get AI-powered recommendations
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}