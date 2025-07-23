import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DailyExpense } from './ExpenseTypes';


const ExpenseLineChart = ({ data }: { data: DailyExpense[] }) => {

  return (
    <LineChart data={data} width={450} height={300} style={{ margin:'1rem'}}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="expense" stroke="#8884d8" strokeWidth={2} />
    </LineChart>
  );
};

export default ExpenseLineChart;
