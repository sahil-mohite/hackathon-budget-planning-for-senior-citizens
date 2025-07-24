import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface DailyExpense {
  day: string; // YYYY-MM-DD
  expense: number;
}

const ExpenseMonthlyBarChart = ({ data }: { data: DailyExpense[] }) => {
  const monthlyMap: Record<string, number> = {};

  data.forEach(({ day, expense }) => {
    const date = new Date(day);
    const key = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
    monthlyMap[key] = (monthlyMap[key] || 0) + expense;
  });

  const monthlyData = Object.entries(monthlyMap).map(([month, total]) => ({
    month,
    total,
  }));

  monthlyData.sort(
    (a, b) =>
      new Date(a.month + '-01').getTime() - new Date(b.month + '-01').getTime()
  );

  // Dynamic gap based on number of bars
  const barCount = monthlyData.length;
  const barGap = barCount < 6 ? '20%' : '5%';
  const barSize = barCount < 6 ? 40 : undefined; // optional for thin bars

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyData} barCategoryGap={barGap}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickFormatter={(month) => {
            const [year, mon] = month.split('-');
            return new Date(`${year}-${mon}-01`).toLocaleDateString('en-US', {
              month: 'short',
              year: '2-digit',
            });
          }}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#82ca9d" barSize={barSize} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpenseMonthlyBarChart;
