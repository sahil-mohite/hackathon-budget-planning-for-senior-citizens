import React from 'react';
import { Card } from '@/components/ui/card';
import { IndianRupee, Calendar, ArrowUpCircle, PieChart } from 'lucide-react';

type DailyExpense = { day: string; expense: number };
type CategoryBreakdown = { category: string; value: number };

interface Props {
  dailyExpenses: DailyExpense[];
  categoryBreakdown: CategoryBreakdown[];
}

const KpiCards: React.FC<Props> = ({ dailyExpenses, categoryBreakdown }) => {
  const totalSpend = dailyExpenses.reduce((sum, d) => sum + d.expense, 0);
  const averageSpend = dailyExpenses.length > 0 ? totalSpend / dailyExpenses.length : 0;

  const highestDay =
    dailyExpenses.length > 0
      ? dailyExpenses.reduce((prev, curr) => (curr.expense > prev.expense ? curr : prev))
      : { day: '-', expense: 0 };

  const topCategory =
    categoryBreakdown.length > 0
      ? categoryBreakdown.reduce((prev, curr) => (curr.value > prev.value ? curr : prev))
      : { category: '-', value: 0 };

  const kpis = [
    {
      title: 'Total Weekly Spend',
      value: `₹${totalSpend.toFixed(2)}`,
      icon: <IndianRupee className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Average Daily Spend',
      value: `₹${averageSpend.toFixed(2)}`,
      icon: <Calendar className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Highest Spend Day',
      value: `${highestDay.day} (₹${highestDay.expense.toFixed(2)})`,
      icon: <ArrowUpCircle className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Top Category',
      value: `${topCategory.category} (₹${topCategory.value.toFixed(2)})`,
      icon: <PieChart className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6" style={{margin:'1rem 0rem'}}>
      {kpis.map((kpi, index) => (
        <Card key={index} className="p-4 flex items-start gap-4 bg-white shadow-md rounded-lg">
          {kpi.icon}
          <div>
            <div className="text-sm text-muted-foreground">{kpi.title}</div>
            <div className="text-lg font-semibold text-foreground">{kpi.value}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default KpiCards;
