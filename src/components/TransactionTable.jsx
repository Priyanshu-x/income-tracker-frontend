import { useState } from "react";
import { useTransaction } from "../context/TransactionContext";

export function TransactionTable() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransaction();
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({ date: "", source: "", amount: "", category: "", description: "", type: "" });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortColumn) return 0;
    return sortDirection === "asc"
      ? a[sortColumn] > b[sortColumn] ? 1 : -1
      : a[sortColumn] < b[sortColumn] ? 1 : -1;
  });

  const handleDelete = (id) => {
    deleteTransaction(id);
  };

  const handleEdit = (id) => {
    const transactionToEdit = transactions.find(t => t._id === id);
    if (transactionToEdit) {
      setEditingIndex(id); // Use id as editingIndex to identify the transaction
      setEditData({ ...transactionToEdit, amount: String(transactionToEdit.amount), type: transactionToEdit.type });
    }
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updatedTransaction = {
        ...editData,
        amount: Number(editData.amount.replace(/[$₹]/g, "")), // Convert to number for backend
      };
      updateTransaction(editingIndex, updatedTransaction); // Use editingIndex (which is the _id)
      setEditingIndex(null);
      setEditData({ date: "", source: "", amount: "", category: "", description: "" });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditData({ date: "", source: "", amount: "", category: "", description: "", type: "" });
  };

  return (
    <>
      <div className="glass-card p-2 sm:p-4 rounded-lg shadow-md mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-1 sm:p-2 text-left cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200" onClick={() => handleSort("date")}>
                Date {sortColumn === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-1 sm:p-2 text-left cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200" onClick={() => handleSort("source")}>
                Source {sortColumn === "source" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-1 sm:p-2 text-left cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200" onClick={() => handleSort("amount")}>
                Amount {sortColumn === "amount" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-1 sm:p-2 text-left cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200" onClick={() => handleSort("category")}>
                Category {sortColumn === "category" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-1 sm:p-2 text-left cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200" onClick={() => handleSort("description")}>
                Description {sortColumn === "description" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-1 sm:p-2 text-left cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200" onClick={() => handleSort("type")}>
                Type {sortColumn === "type" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-1 sm:p-2 text-gray-800 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((t) => (
              <tr key={t._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                <td className="p-1 sm:p-2">{t.date}</td>
                <td className="p-1 sm:p-2">{t.source}</td>
                <td className="p-1 sm:p-2">{`₹${Number(t.amount).toFixed(2)}`}</td>
                <td className="p-1 sm:p-2">{t.category}</td>
                <td className="p-1 sm:p-2">{t.description || "N/A"}</td>
                <td className={`p-1 sm:p-2 ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {t.type}
                </td>
                <td className="p-1 sm:p-2 flex flex-col sm:flex-row gap-1 sm:space-x-2">
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(t._id)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:w-full max-w-md text-gray-900 dark:text-gray-100">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Edit Transaction</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
              <input
                type="date"
                value={editData.date}
                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                className="p-2 border rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                required
              />
              <input
                type="text"
                value={editData.source}
                onChange={(e) => setEditData({ ...editData, source: e.target.value })}
                placeholder="Source"
                className="p-2 border rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                required
              />
              <input
                type="number"
                value={editData.amount}
                onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                placeholder="Amount"
                className="p-2 border rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                required
              />
              <select
                value={editData.type}
                onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                className="p-2 border rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={editData.category}
                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                className="p-2 border rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                required
              >
                {["Freelancing", "Trading", "Salary", "Gigs", "Other"].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Description"
                rows="3"
                className="p-2 border rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              ></textarea>
              <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 w-full"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800 w-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}