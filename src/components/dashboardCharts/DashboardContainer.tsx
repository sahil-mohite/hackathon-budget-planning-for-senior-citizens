import { useEffect, useState } from 'react';
import ExpenseLineChart from './ExpenseLineChart';
import ExpensePieChart from './ExpensePieChart';
import KpiCards from './KpiCards';
import { Card } from '@/components/ui/card';

interface RawExpense {
  store_name: string | null;
  bill_date: string;
  item_name: string;
  quantity: number;
  unit_price: number | null;
  category: string;
}

interface DailyExpense {
  day: string; // YYYY-MM-DD
  expense: number;
}

interface CategoryExpense {
  category: string;
  value: number;
}

const DashboardContainer = () => {
  const [dailyExpenses, setDailyExpenses] = useState<DailyExpense[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch('http://localhost:8090/expenses', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then((res) => res.json())
      .then((rawData: RawExpense[])=>{
        console.log(rawData)

        const dailyMap = new Map<string, number>();
        const categoryMap = new Map<string, number>();

        rawData.forEach((item) => {
          if (item.unit_price !== null) {
            const cost = item.quantity * item.unit_price;

            const day = item.bill_date; // use actual date string
            dailyMap.set(day, (dailyMap.get(day) || 0) + cost);

            categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + cost);
          }
        });

        const dailyExpensesArr: DailyExpense[] = Array.from(dailyMap.entries())
          .map(([day, expense]) => ({ day, expense }))
          .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

        const categoryBreakdownArr: CategoryExpense[] = Array.from(categoryMap.entries()).map(
          ([category, value]) => ({ category, value })
        );

        setDailyExpenses(dailyExpensesArr);
        setCategoryBreakdown(categoryBreakdownArr);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div style={{ display:'flex', flexDirection:'column' }}>
      <Card style={{padding:'2rem'} }>
        <ExpenseLineChart data={dailyExpenses} />
      </Card>

<div style={{
  display: 'flex', 
  marginTop: '1rem',
  gap: '1rem',
  flexWrap: 'wrap'
}}>
  <Card style={{ 
    flex: '1 1 300px',
    minWidth: '300px',
    display: 'flex', 
    justifyContent: 'center'
  }}>
    <ExpensePieChart data={categoryBreakdown} />
  </Card>
  
  <Card style={{ 
    flex: '1 1 300px',
    minWidth: '300px',
    display: 'flex', 
    justifyContent: 'center'
  }}>
    <ExpensePieChart data={categoryBreakdown} />
  </Card>
</div>


      <KpiCards dailyExpenses={dailyExpenses} categoryBreakdown={categoryBreakdown} />
      {/* <Card className="dashboard">
        <div className="flex justify-evenly flex-wrap gap-4 py-4">
          <ExpenseLineChart data={dailyExpenses} />
          <ExpensePieChart data={categoryBreakdown} />
          <KpiCards dailyExpenses={dailyExpenses} categoryBreakdown={categoryBreakdown} />
        </div>
      </Card> */}
    </div>
  );
};

export default DashboardContainer;
