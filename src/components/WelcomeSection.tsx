import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, BarChart3, Shield, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ScrollDownButton } from "@/components/ScrollDownButton";

interface WelcomeSectionProps {
  onGetStarted: () => void;
  firstName?: string;
  secondName?: string;
}


export function WelcomeSection({ onGetStarted, firstName, secondName }: WelcomeSectionProps) {
  const { t } = useTranslation();
  const features = [
    {
      icon: Globe,
      title: t("features.voice.title"),
      description: t("features.voice.description"),
    },
    {
      icon: BarChart3,
      title: t("features.insights.title"),
      description: t("features.insights.description"),
    },
    {
      icon: Shield,
      title: t("features.secure.title"),
      description: t("features.secure.description"),
    },
    {
      icon: Globe,
      title: t("features.language.title"),
      description: t("features.language.description"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-6 space-y-8 overflow-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Hi {firstName} {secondName}, {t("welcome.title")}
        </h1>
        <p className="text-base text-muted-foreground max-w-xl mx-auto">
          {t("welcome.description")}
        </p>

        <Button
          onClick={onGetStarted}
          size="sm"
          className="h-12 px-5 text-base font-semibold bg-gradient-primary text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 hover:ring-2 hover:ring-offset-1 hover:ring-primary transition-all duration-300"
        >
          <Mic className="h-4 w-4 mr-2" />
          {t("welcome.get_started")}
        </Button>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl text-sm mb-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-xl border border-[#C8F7DC] shadow-sm bg-white"
              style={{ height: "160px" }}
            >
              <div className="w-10 h-10 mb-2 bg-[#E6F9EF] rounded-md flex items-center justify-center">
                <Icon className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-base text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
            </Card>
          );
        })}
      </div>
      {/* Quick Start Tips */}
      <Card className="p-4 lg:p-3 bg-accent border-border w-full max-w-3xl text-sm">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-accent-foreground">
            {t("welcome.quick_start")}
          </h3>
          <div className="space-y-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {step}
                </div>
                <p className="text-sm text-accent-foreground">
                  {t(`welcome.step${step}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Scroll Button */}
      <ScrollDownButton
        onClick={() => {
          window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
        }}
      />
    </div>
  );
}
