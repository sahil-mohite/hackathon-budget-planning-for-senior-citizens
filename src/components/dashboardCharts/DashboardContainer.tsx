import { useEffect, useState } from 'react';
import ExpenseLineChart from './ExpenseLineChart';
import ExpensePieChart from './ExpensePieChart';
import { ExpenseData } from './ExpenseTypes';
import { Card } from "@/components/ui/card";
import HeatmapChart from './HeatmapChart';
import KpiCards from './KpiCards';


const DashboardContainer = () => {
    const [data, setData] = useState<ExpenseData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/expenseData.json')
          .then((res) => res.json())
          .then((json: ExpenseData) => {
            setData(json);
            setLoading(false);
          })
          .catch((err) => {
            console.error('Failed to fetch data:', err);
            setLoading(false);
          });
      }, []);

    if (loading) return <p className="p-4">Loading...</p>;
    if (!data) return <p className="p-4 text-red-500">Failed to load data.</p>;
    
    return (
    <div>
        <Card className="dashboard">
            <div className="flex justify-evenly flex-wrap gap-4" style={{ paddingTop:'1rem', paddingBottom:'1rem'}}>
                <ExpenseLineChart data={data.dailyExpenses} />
                <ExpensePieChart data={data.categoryBreakdown} />
                {/* <HeatmapChart data={data.dailyExpenses} /> */}
                <KpiCards dailyExpenses={data.dailyExpenses} categoryBreakdown={data.categoryBreakdown}/>
            </div>
        </Card>
    </div>
    );
  };
  export default DashboardContainer;