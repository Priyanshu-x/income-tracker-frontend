import { StatsCard } from "../components/StatsCard";
import { TransactionTable } from "../components/TransactionTable";
import { useTransaction } from "../context/TransactionContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export function Dashboard() {
  const { transactions, updateTransaction, deleteTransaction, loading, error } = useTransaction();
  const { logout } = useAuth();

  const totalIncome = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  const thisMonthIncome = transactions.reduce((sum, t) => {
    const transactionMonth = new Date(t.date).toLocaleString('default', { month: 'short' });
    return transactionMonth === currentMonth ? sum + Number(t.amount) : sum;
  }, 0);

  // Mock stats (to be updated with real data later)
  const stats = [
    { title: "Total Income", value: totalIncome, trend: 5.2, color: "bg-chart-1" },
    { title: "This Month", value: thisMonthIncome, trend: -1.8, color: "bg-chart-2" },
    { title: "Top Source", value: "Freelancing", trend: 8.3, color: "bg-chart-3" },
    { title: "Average Monthly", value: "₹1,800", trend: 3.5, color: "bg-chart-4" },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Dashboard</h2>
      {loading && <p className="text-yellow-500">Loading transactions...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {stats.map((stat, index) => (
          <StatsCard key={index} title={stat.title} value={stat.value} trend={stat.trend} color={stat.color} />
        ))}
      </motion.div>
      <motion.div
        className="mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <TransactionTable />
      </motion.div>
    </div>
  );
}