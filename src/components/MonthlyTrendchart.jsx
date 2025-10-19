import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function MonthlyTrendChart({ entries }) {
  // Aggregate by month (example logic - group by month)
  const monthlyData = entries.reduce((acc, entry) => {
    const month = new Date(entry.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) acc[month] = 0;
    acc[month] += Number(entry.amount) || 0; // Ensure amount is a number, default to 0 if NaN
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData).map(([month, total]) => ({ month, total }));

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Monthly Income Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
            <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}