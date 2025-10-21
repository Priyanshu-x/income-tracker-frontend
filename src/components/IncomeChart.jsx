import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const categoryColors = {
  Trading: 'hsl(var(--chart-1))',
  Freelancing: 'hsl(var(--chart-2))',
  Gigs: 'hsl(var(--chart-3))',
  Other: 'hsl(var(--muted))'
};

export function IncomeChart({ entries }) {
  const categoryData = entries.reduce((acc, entry) => {
    if (!acc[entry.category]) acc[entry.category] = 0;
    acc[entry.category] += Number(entry.amount) || 0; // Ensure amount is a number, default to 0 if NaN
    return acc;
  }, {});

  const chartData = Object.entries(categoryData).map(([name, total]) => ({ name, total }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              formatter={(value) => `₹${value.toFixed(2)}`}
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
            />
            <Legend />
            {chartData.map((item, index) => (
              <Bar key={index} dataKey="total" fill={categoryColors[item.name] || 'hsl(var(--primary))'} radius={[8, 8, 0, 0]} name={item.name} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}