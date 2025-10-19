import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import { IncomeTable } from "@/components/IncomeTable";
import { AddIncomeDialog } from "@/components/AddIncomeDialog";
import { toast } from "sonner";

function Index() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("incomeEntries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("incomeEntries", JSON.stringify(entries));
  }, [entries]);

  const addIncome = (newEntry) => {
    setEntries([...entries, { ...newEntry, id: Date.now() }]);
    toast.success("Income added successfully!");
  };

  const totalIncome = entries.reduce((sum, e) => sum + (e.amount || 0), 0);
  const thisMonthIncome = totalIncome; // Simplified for demo
  const topSource = entries.length ? entries[0].source : ""; // Placeholder
  const averageMonthly = entries.length ? totalIncome / entries.length : 0;
  const trend = { value: "0%", positive: true };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <AddIncomeDialog onAddIncome={addIncome} />
        </div>
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <StatsCard title="Total Income" value={`₹${totalIncome.toFixed(2)}`} />
          <StatsCard title="This Month" value={`₹${thisMonthIncome.toFixed(2)}`} trend={trend} />
          <StatsCard title="Top Source" value={topSource} />
          <StatsCard title="Average Monthly" value={`₹${averageMonthly.toFixed(2)}`} />
        </div>
        <IncomeTable entries={entries} />
      </div>
    </div>
  );
}

export default Index;