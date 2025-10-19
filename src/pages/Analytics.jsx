import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from "recharts";
import { useTransaction } from "../context/TransactionContext";
import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

export function Analytics() {
  const { transactions } = useTransaction();
  const { isDarkMode } = useTheme();

  const textColor = isDarkMode ? "#E0E0E0" : "#333333";
  const gridColor = isDarkMode ? "#444444" : "#CCCCCC";
  const barFill = isDarkMode ? "#9F7AEA" : "#8884d8";
  const lineStroke = isDarkMode ? "#66BB6A" : "#8884d8";

  // Aggregate income by category with validation
  const categoryData = useMemo(() => {
    const categoryMap = {};
    transactions.forEach((t) => {
      const amount = parseFloat(String(t.amount || "0").replace("₹", ""));
      if (!isNaN(amount) && amount > 0) { // Validate amount
        const category = t.category || "Other";
        categoryMap[category] = (categoryMap[category] || 0) + amount;
      }
    });
    return Object.keys(categoryMap).map((category) => ({
      name: category,
      income: categoryMap[category],
    }));
  }, [transactions]);

  // Aggregate income over time with chronological sorting
  const timeData = useMemo(() => {
    const monthMap = {};
    transactions.forEach((t) => {
      const date = new Date(t.date);
      if (isNaN(date.getTime())) return; // Skip invalid dates
      const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`; // e.g., "Oct 2025"
      const amount = parseFloat(String(t.amount || "0").replace("₹", ""));
      if (!isNaN(amount) && amount > 0) {
        monthMap[monthYear] = (monthMap[monthYear] || 0) + amount;
      }
    });
    return Object.keys(monthMap)
      .map((monthYear) => ({
        monthYear,
        income: monthMap[monthYear],
      }))
      .sort((a, b) => new Date(a.monthYear.split(" ")[1], ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(a.monthYear.split(" ")[0])) - new Date(b.monthYear.split(" ")[1], ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(b.monthYear.split(" ")[0])));
  }, [transactions]);

  // Empty state
  if (transactions.length === 0 || !transactions.every((t) => t.date && t.amount && t.category)) {
    return (
      <div className="p-6 text-center dark:bg-gray-900 dark:text-white min-h-screen">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Analytics</h2>
        <p className="text-gray-500 dark:text-gray-400">No valid transactions yet. Add some income entries to see analytics!</p>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Analytics</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Income by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} tick={{ fill: textColor }} />
            <YAxis stroke={textColor} tick={{ fill: textColor }} />
            <Tooltip
              contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", borderColor: isDarkMode ? "#555" : "#ccc", color: textColor }}
              formatter={(value) => [`₹${value.toFixed(2)}`, "Income"]}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            <Bar dataKey="income" fill={barFill} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Income Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="monthYear" stroke={textColor} tick={{ fill: textColor }} />
            <YAxis stroke={textColor} tick={{ fill: textColor }} />
            <Tooltip
              contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", borderColor: isDarkMode ? "#555" : "#ccc", color: textColor }}
              formatter={(value) => [`₹${value.toFixed(2)}`, "Income"]}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            <Line type="monotone" dataKey="income" stroke={lineStroke} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}