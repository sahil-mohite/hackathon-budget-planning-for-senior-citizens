import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';

const HeatmapChart = ({ data }: { data: { day: string; expense: number }[] }) => {
  const getColor = (value: number) => {
    if (value === 0) return "#f2f2f2";
    if (value < 300) return "#B2EBF2";
    if (value < 600) return "#4DD0E1";
    return "#0097A7";
  };

  return (
    <ResponsiveContainer width="50%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="expense">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.expense)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HeatmapChart;
