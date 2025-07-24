import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
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

const ExpenseLineChart = ({ data }: { data: DailyExpense[] }) => {
  const [view, setView] = useState<'7days' | '30days'>('7days');

  const filteredData = useMemo(() => {
    const today = new Date();
    const days = view === '7days' ? 7 : 30;

    return data
      .filter((entry) => {
        const date = new Date(entry.day);
        const diffTime = today.getTime() - date.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays <= days;
      })
      .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
  }, [data, view]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Expense Trend</h2>
        <select
          value={view}
          onChange={(e) => setView(e.target.value as '7days' | '30days')}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="7days">Last Week</option>
          <option value="30days">Last Month</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300} style={{padding:'1rem'}}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={80}
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }
          />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseLineChart;
