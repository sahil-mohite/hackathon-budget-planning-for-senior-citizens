import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, BarChart3, Shield, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

interface WelcomeSectionProps {
  onGetStarted: () => void;
}

export function WelcomeSection({ onGetStarted }: WelcomeSectionProps) {
  const { t } = useTranslation();

  const features = [
    {
      icon: Mic,
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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-senior-2xl font-bold text-foreground">
            {t("welcome.title")}
          </h1>
          <p className="text-senior-lg text-muted-foreground max-w-2xl mx-auto">
            {t("welcome.description")}
          </p>
        </div>

        <Button
          onClick={onGetStarted}
          size="lg"
          className="h-16 px-12 text-senior-lg font-semibold bg-gradient-primary hover:shadow-gentle transition-all duration-300"
        >
          <Mic className="h-6 w-6 mr-3" />
          {t("welcome.get_started")}
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
            {t("welcome.quick_start")}
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {step}
                </div>
                <p className="text-senior-base text-accent-foreground">
                  {t(`welcome.step${step}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
