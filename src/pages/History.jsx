import { useState, useEffect } from "react";
import { TransactionTable } from "../components/TransactionTable";
import { useTransaction } from "../context/TransactionContext";

export function History() {
  const { transactions } = useTransaction();
  const [filterCategory, setFilterCategory] = useState("");

  const filteredTransactions = filterCategory
    ? transactions.filter((t) => t.category === filterCategory)
    : transactions;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">History</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Category</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="mt-1 p-2 w-full md:w-1/3 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
        >
          <option value="">All</option>
          <option value="Freelancing">Freelancing</option>
          <option value="Trading">Trading</option>
          <option value="Salary">Salary</option>
          <option value="Gigs">Gigs</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <TransactionTable transactions={filteredTransactions} />
    </div>
  );
}