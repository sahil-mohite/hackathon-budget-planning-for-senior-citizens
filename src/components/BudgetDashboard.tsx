import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import DashboardContainer from "./dashboardCharts/DashboardContainer";
import { BarChart } from "lucide-react";

interface BudgetItem {
  category: string;
  amount: number;
  percentage: number;
  trend: "up" | "down" | "stable";
}


export function BudgetDashboard() {


  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-senior-xl font-bold text-foreground">
          Monthly Budget Overview
        </h2>
        <p className="text-senior-base text-muted-foreground">
          Your spending breakdown for this month
        </p>
      </div>
      
      <h3 className="text-senior-lg font-semibold text-foreground flex items-center gap-2" style={{ marginBottom:'1rem'}}>
          <BarChart className="h-6 w-6 text-primary" />
          Analytics Overview
      </h3>
      <DashboardContainer/>

    </div>
  );
}