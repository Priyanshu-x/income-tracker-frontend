import { StatsCard } from "../components/StatsCard";
import { TransactionTable } from "../components/TransactionTable";
import { AddIncomeForm } from "../components/AddIncomeForm";
import { useTransaction } from "../context/TransactionContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export function Dashboard() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, loading, error } = useTransaction();
  const [showForm, setShowForm] = useState(false);
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

  // Basic export to CSV (client-side)
  const exportTransactions = () => {
    const csv = [
      ["Date,Source,Amount,Category,Description"].join(","),
      ...transactions.map((t) => [t.date, t.source, t.amount, t.category, t.description].join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Basic import from CSV (client-side, to be enhanced)
  const importTransactions = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split("\n").slice(1); // Skip header
        const newTransactions = rows
          .map((row) => {
            const [date, source, amount, category, description] = row.split(",");
            return date && source && amount && category ? { date, source, amount, category, description } : null;
          })
          .filter((t) => t);
        newTransactions.forEach((data) => addTransaction(data));
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Dashboard</h2>
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
      <div className="mt-6 space-x-4">
        <motion.button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Income
        </motion.button>
        <motion.button
          onClick={exportTransactions}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Export CSV
        </motion.button>
        <label className="px-4 py-2 bg-yellow-500 text-white rounded-md cursor-pointer hover:bg-yellow-600 transition-all duration-200">
          Import CSV
          <input
            type="file"
            accept=".csv"
            onChange={importTransactions}
            className="hidden"
          />
        </label>
        <motion.button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </div>
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <AddIncomeForm onAdd={addTransaction} onClose={() => setShowForm(false)} />
        </motion.div>
      )}
    </div>
  );
}