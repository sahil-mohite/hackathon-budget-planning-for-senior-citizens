import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface DailyExpense {
  day: string; // YYYY-MM-DD
  expense: number;
}

const ExpenseLineChart = ({ data }: { data: DailyExpense[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300} style={{ margin: '1rem 0' }}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={80}
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
          />
          <YAxis />
          <Tooltip />
        <Line type="monotone" dataKey="expense" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ExpenseLineChart;
