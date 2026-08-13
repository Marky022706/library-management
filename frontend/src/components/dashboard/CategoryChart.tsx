import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useLibraryData } from '../../context/LibraryDataContext';

const SHADES = ['#14532d', '#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

export function CategoryChart() {
  const { categoryBreakdown } = useLibraryData();

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <ResponsiveContainer width="100%" height={260} className="max-w-xs">
        <PieChart>
          <Pie
            data={categoryBreakdown}
            dataKey="count"
            nameKey="category"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={2}
            label={({ percent }) => `${Math.round((percent ?? 0) * 100)}%`}
            labelLine={false}
          >
            {categoryBreakdown.map((slice, index) => (
              <Cell key={slice.category} fill={SHADES[index % SHADES.length]} stroke="#ffffff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, _name, entry) => [`${value} titles`, entry?.payload?.category]} />
        </PieChart>
      </ResponsiveContainer>

      <ul className="flex flex-col gap-2 text-sm">
        {categoryBreakdown.map((slice, index) => (
          <li key={slice.category} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: SHADES[index % SHADES.length] }} aria-hidden="true" />
            <span className="text-ink">{slice.category}</span>
            <span className="text-muted">{slice.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
