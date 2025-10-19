import { ArrowUp, ArrowDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext"; // Import useTheme

export function StatsCard({ title, value, trend, color }) {
  const { isDarkMode } = useTheme(); // Use the theme context
  const isPositive = trend >= 0;
  const trendColor = isPositive ? "text-green-500" : "text-red-500";
  const TrendIcon = isPositive ? ArrowUp : ArrowDown;

  // Dynamically select color based on dark mode
  const cardColorClass = isDarkMode ? color.replace('bg-chart-', 'bg-dark-chart-') : color;

  return (
    <div className="p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-700 dark:shadow-none">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${cardColorClass}`}>
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">{title}</h3>
      <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
        {typeof value === 'number' ? `₹${value.toFixed(2)}` : value}
      </p>
      <div className={`flex items-center mt-2 ${trendColor}`}>
        <TrendIcon className="h-4 w-4 mr-1" />
        <span>{trend}%</span>
      </div>
    </div>
  );
}