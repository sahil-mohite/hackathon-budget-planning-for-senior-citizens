import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CategoryExpense } from './ExpenseTypes';

const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#A28CFF',
    '#FF5C8D',
    '#FF6F00',
    '#2E93fA',
    '#66DA26',
    '#546E7A',
    '#D7263D',
    '#1BC5BD',
    '#F4B400',
    '#DB4437',
  ];

const ExpensePieChart = ({ data }: { data: CategoryExpense[] }) => {
  return (
    <PieChart  width={400} height={300}style={{ margin:'1rem' }}>
      <Tooltip />
      <Legend />
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        nameKey="category"
        label={(entry) => `${entry.category}: ${entry.value}`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default ExpensePieChart;
