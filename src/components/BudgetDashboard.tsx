/* eslint-disable @typescript-eslint/no-explicit-any */
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

const mockBudgetData: BudgetItem[] = [
  { category: "Housing", amount: 1200, percentage: 40, trend: "stable" },
  { category: "Groceries", amount: 400, percentage: 13, trend: "up" },
  { category: "Utilities", amount: 200, percentage: 7, trend: "down" },
  { category: "Healthcare", amount: 300, percentage: 10, trend: "up" },
  { category: "Transportation", amount: 150, percentage: 5, trend: "stable" },
  { category: "Entertainment", amount: 100, percentage: 3, trend: "down" },
];

export function BudgetDashboard() {
  const totalBudget = mockBudgetData.reduce((sum, item) => sum + item.amount, 0);

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

      {/* <Card  className="p-4 hover:shadow-gentle transition-shadow">
        <div className="flex items-center justify-between">
          
        </div>
      </Card> */}

      {/* Total Budget Card */}
      <Card className="p-6 bg-gradient-primary text-primary-foreground shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-senior-sm opacity-90">Total Monthly Budget</p>
            <p className="text-senior-2xl font-bold">${totalBudget.toLocaleString()}</p>
          </div>
          <DollarSign className="h-12 w-12 opacity-80" />
        </div>
      </Card>

      

      {/* Budget Categories */}
      <div className="space-y-4">
        <h3 className="text-senior-lg font-semibold text-foreground flex items-center gap-2">
          <PieChart className="h-6 w-6 text-primary" />
          Spending Categories
        </h3>
        <div className="grid gap-4">
          {mockBudgetData.map((item) => (
            <Card key={item.category} className="p-4 hover:shadow-gentle transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-senior-base font-medium text-foreground">
                      {item.category}
                    </h4>
                    <Badge 
                      variant={item.trend === "up" ? "destructive" : item.trend === "down" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {item.trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                      {item.trend === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
                      {item.percentage}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-senior-lg font-semibold text-foreground">
                        ${item.amount.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-primary h-3 rounded-full transition-all duration-700"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-success text-success-foreground">
          <div className="text-center">
            <p className="text-senior-sm opacity-90">Savings This Month</p>
            <p className="text-senior-xl font-bold">$450</p>
          </div>
        </Card>
        
        <Card className="p-4 bg-warning text-warning-foreground">
          <div className="text-center">
            <p className="text-senior-sm opacity-90">Remaining Budget</p>
            <p className="text-senior-xl font-bold">$680</p>
          </div>
        </Card>
      </div>
    </div>
  );
}