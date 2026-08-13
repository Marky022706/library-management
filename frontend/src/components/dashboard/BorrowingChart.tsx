import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { borrowingTrend } from '../../data/borrowingTrend';

export function BorrowingChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={borrowingTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="4 4" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: '#f0fdf4' }}
          contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13 }}
          formatter={(value: number) => [`${value} books`, 'Borrowed']}
        />
        <Bar dataKey="count" fill="#16a34a" radius={[6, 6, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  );
}
