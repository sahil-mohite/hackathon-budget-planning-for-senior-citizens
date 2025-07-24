import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export const HelpSection = () => {
    const { t } = useTranslation();

    const voiceSteps = t("help.voice_steps", { returnObjects: true }) as string[];
    const dashboardSteps = t("help.dashboard_steps", { returnObjects: true }) as string[];

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-senior-xl font-bold text-foreground flex items-center justify-center gap-3">
                    <HelpCircle className="h-8 w-8 text-primary" />
                    {t("help.title")}
                </h2>
                <p className="text-senior-base text-muted-foreground">
                    {t("help.subtitle")}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-senior-lg font-semibold text-foreground mb-4">
                        {t("help.voice_title")}
                    </h3>
                    <ul className="space-y-2 text-senior-base text-muted-foreground">
                        {voiceSteps.map((step, idx) => (
                            <li key={idx}>• {step}</li>
                        ))}
                    </ul>
                </Card>

                <Card className="p-6">
                    <h3 className="text-senior-lg font-semibold text-foreground mb-4">
                        {t("help.dashboard_title")}
                    </h3>
                    <ul className="space-y-2 text-senior-base text-muted-foreground">
                        {dashboardSteps.map((step, idx) => (
                            <li key={idx}>• {step}</li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};
