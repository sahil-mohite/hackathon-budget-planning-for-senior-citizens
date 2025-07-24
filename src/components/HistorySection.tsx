import React, {useState} from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, FileText } from "lucide-react";
import { HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HistorySection = () => {
   
const [activeSection, setActiveSection] = useState("home");
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
                <p className="text-senior-base text-muted-foreground">
                    Start recording your budget to see history here
                </p>
            </Card>
        </div>
    );
};
