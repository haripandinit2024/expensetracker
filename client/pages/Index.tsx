import { useState, useEffect } from "react";
import { Trash2, Plus, TrendingDown, Wallet, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Healthcare",
  "Other",
];

export default function Index() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const { toast } = useToast();

  // Load expenses from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error("Error loading expenses:", error);
      }
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!description.trim() || !amount.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: numAmount,
      category,
      date: new Date().toISOString().split("T")[0],
    };

    setExpenses([newExpense, ...expenses]);
    setDescription("");
    setAmount("");
    setCategory("Food");

    toast({
      title: "Success",
      description: "Expense added successfully",
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
    toast({
      title: "Deleted",
      description: "Expense removed successfully",
    });
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyExpenses = expenses
    .filter((exp) => {
      const expDate = new Date(exp.date);
      const today = new Date();
      return (
        expDate.getMonth() === today.getMonth() &&
        expDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals: Record<string, number> = {};
  expenses.forEach((exp) => {
    categoryTotals[exp.category] =
      (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const topCategory = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  )[0];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addExpense();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Expense Tracker
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Add Expense Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Add New Expense
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Coffee, Lunch, Gas"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyPress={handleKeyPress}
                    step="0.01"
                    min="0"
                    className="w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={addExpense}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 mt-6"
                >
                  <Plus className="w-5 h-5" />
                  Add Expense
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Stats and List */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Expenses Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Total Expenses
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      ${totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Monthly Expenses Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      This Month
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      ${monthlyExpenses.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Top Category Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Top Category
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {topCategory ? topCategory[0] : "—"}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Expenses List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Expenses
                </h2>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {expenses.length === 0 ? (
                  <div className="p-8 text-center">
                    <Wallet className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No expenses yet. Add one to get started!
                    </p>
                  </div>
                ) : (
                  expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {expense.description}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {expense.category} •{" "}
                              {new Date(expense.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">
                          ${expense.amount.toFixed(2)}
                        </p>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
