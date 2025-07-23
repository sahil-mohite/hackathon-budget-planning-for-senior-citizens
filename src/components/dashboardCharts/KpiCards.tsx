import React from 'react';
import { Card } from '@/components/ui/card';
import { DollarSign, Calendar, ArrowUpCircle, PieChart } from 'lucide-react';

type DailyExpense = { day: string; expense: number };
type CategoryBreakdown = { category: string; value: number };

interface Props {
  dailyExpenses: DailyExpense[];
  categoryBreakdown: CategoryBreakdown[];
}

const KpiCards: React.FC<Props> = ({ dailyExpenses, categoryBreakdown }) => {
  const totalSpend = dailyExpenses.reduce((sum, d) => sum + d.expense, 0);
  const averageSpend = totalSpend / dailyExpenses.length;

  const highestDay = dailyExpenses.reduce((prev, curr) =>
    curr.expense > prev.expense ? curr : prev
  );

  const topCategory = categoryBreakdown.reduce((prev, curr) =>
    curr.value > prev.value ? curr : prev
  );

  const kpis = [
    {
      title: 'Total Weekly Spend',
      value: `$${totalSpend.toLocaleString()}`,
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Average Daily Spend',
      value: `$${averageSpend.toFixed(2)}`,
      icon: <Calendar className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Highest Spend Day',
      value: `${highestDay.day} ($${highestDay.expense})`,
      icon: <ArrowUpCircle className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Top Category',
      value: `${topCategory.category} ($${topCategory.value})`,
      icon: <PieChart className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
